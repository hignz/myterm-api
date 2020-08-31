const cheerio = require('cheerio');
const got = require('got');
const puppeteer = require('puppeteer');
const { Course } = require('../models');
const config = require('../config/config');

const getCurrentSemester = () => {
  const today = new Date();
  const year = today.getFullYear();
  if (
    Date.parse(today) >= Date.parse(`${year}-07-20`) &&
    Date.parse(today) <= Date.parse(`${year}-12-19`)
  ) {
    return config.URL_PARTS[0];
  }

  return config.URL_PARTS[1];
};

const generateSemesterUrl = (sem) => {
  if (!sem || (sem !== '0' && sem !== '1')) {
    return getCurrentSemester();
  }
  return config.URL_PARTS[parseInt(sem, 10)];
};

const generateUrl = (urlPart, sem) =>
  `${config.COLLEGE_URLS[0].TIMETABLE_URL}${config.LIST_URL}${encodeURIComponent(urlPart).replace(
    /_/g,
    '%5F'
  )}${generateSemesterUrl(sem)}`;

/**
 * Scrapes timetable
 * @param {String} urlPart
 * @param {String} college
 * @param {String} sem
 * @returns {Object}
 */
const scrapeTimetable = async (urlPart, college, sem) => {
  const url = generateUrl(urlPart, sem);
  const { body } = await got(url);
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

        if (details[3] > lastEndTime && lastEndTime !== null) {
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
          day: days[i],
          startTime: details[3],
          name: details[1].split('- ')[1] || details[1] || details[0],
          room: details[7].trim() || 'N/A',
          type: details[2],
          teacher: details[8].replace(/,/g, ', ').replace(/ {2}/g, ' '),
          length: details[5],
          endTime: details[4],
        });

        lastEndTime = details[4];
      });
  });

  json.empty = [].concat(...json.data).length <= 0;
  json.courseCode = urlPart;
  json.url = url;
  json.semester = sem;
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
