const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const AbortController = require('abort-controller');
const { Course } = require('../models');
const config = require('../config/config');

/**
 * Gets courses by college id
 * @param {String} str
 * @returns {Promise<Course>}
 */
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.substr(1);
    })
    .join(' ');
};

const getCurrentSemester = () => {
  const today = new Date();
  const year = today.getFullYear();
  if (
    Date.parse(today) >= Date.parse(`${year}-07-20`) &&
    Date.parse(today) <= Date.parse(`${year}-12-19`)
  ) {
    return 0;
  }

  return 1;
};

const generateSemesterUrl = (sem) => {
  if (!sem || (sem !== '0' && sem !== '1')) {
    return config.URL_PARTS[getCurrentSemester()];
  }
  return config.URL_PARTS[parseInt(sem, 10)];
};

const generateUrl = (urlPart, sem) =>
  `${config.COLLEGE_URLS[0].TIMETABLE_URL}${config.LIST_URL}${encodeURIComponent(urlPart).replace(
    /_/g,
    '%5F'
  )}${generateSemesterUrl(sem)}`;

/**
 * Fetches body of timetable, handle timeouts in case of target site being down
 * @param {String} url
 * @returns {Object}
 */
const fetchBody = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
    return null;
  }, 3500);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.text();
  } catch (error) {
    if (error.name === 'AbortError') {
      return null;
    }
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Scrapes timetable
 * @param {String} urlPart
 * @param {String} college
 * @param {String} sem
 * @returns {Object}
 */
const scrapeTimetable = async (urlPart, college, sem) => {
  const url = generateUrl(urlPart, sem);
  const body = await fetchBody(url);
  if (!body) {
    return null;
  }

  const $ = cheerio.load(body);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const json = {
    data: [],
  };

  // Get top level tables
  const tables = $('table')
    .filter((i, elm) => !$(elm).parents('table').length)
    .slice(1, -1);

  // Each day
  $(tables).each((i, table) => {
    let lastEndTime;
    let lastStartTime;
    json.data.push([]);
    // Only days with class
    $(table)
      .children('tbody')
      .find('tr')
      .each((j, row) => {
        // Skip row with useless data
        if (j === 0) return;
        const details = [];
        $(row)
          .find('td')
          .each((k, cell) => {
            details.push($(cell).text());
          });
        if (lastEndTime !== null && lastEndTime !== details[4] && lastStartTime !== details[3]) {
          const difference =
            Math.abs(
              new Date(`01/01/1990 ${details[3]}`).getTime() -
                new Date(`01/01/1990 ${lastEndTime}`).getTime()
            ) / 60000;
          if (difference > 0) {
            json.data[i].push({ break: true, breakLength: difference });
          }
        }
        json.data[i].push({
          activity: details[0],
          day: days[i],
          startTime: details[3],
          name: toTitleCase(details[1].split('- ')[1] || details[1] || details[0]),
          room: details[7].trim() || 'N/A',
          type: details[2],
          teacher: details[8].replace(/,/g, ', ').replace(/ {2}/g, ' '),
          length: details[5],
          endTime: details[4],
        });

        lastEndTime = details[4];
        lastStartTime = details[3];
      });
  });
  json.empty = [].concat(...json.data).length <= 0;
  json.courseCode = urlPart;
  json.url = url;
  json.semester = sem || getCurrentSemester();
  json.college = config.COLLEGE_URLS[0].NAME;

  const course = await Course.findOne({
    course: encodeURIComponent(urlPart)
      .replace(/_/g, '%5F')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29'),
  }).lean();
  json.title = course ? course.title : json.courseCode;

  return json;
};

const scrapeCourses = async (college) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  await page.goto(config.COLLEGE_URLS[college].COURSES_URL);
  await page.waitFor(1000);

  const result = await page.evaluate((college) => {
    const data = [];
    const select = document.querySelector('select[name=identifier]');

    if (select) {
      for (const option of select) {
        const course = option.value;
        const title = option.innerText;

        data.push({ course, title, college });
      }
    }

    return data;
  }, college);

  await browser.close();

  return result;
};

module.exports = {
  scrapeCourses,
  scrapeTimetable,
};
