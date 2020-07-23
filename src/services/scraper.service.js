const cheerio = require('cheerio');
const got = require('got');
const puppeteer = require('puppeteer');
const { Course } = require('../models');
const config = require('../config/config');

/**
 * Gets the current semester
 * @param {ObjectId} id
 * @returns {Promise<Timetable>}
 */
const getSemester = async (sem) => {
  if (sem === '0' || sem === '1') {
    return sem;
  }

  const today = new Date();
  const year = today.getFullYear();

  if (
    Date.parse(today) >= Date.parse(`${year}-07-20`) &&
    Date.parse(today) <= Date.parse(`${year}-12-19`)
  ) {
    return '0';
  }

  return '1';
};

const getCurrentSemester = () => {
  const today = new Date();
  const year = today.getFullYear();
  if (
    Date.parse(today) >= Date.parse(`${year}-07-20`) &&
    Date.parse(today) <= Date.parse(`${year}-12-19`)
  ) {
    return config.SEM1_URL_PART;
  }

  return config.SEM2_URL_PART;
};

const generateSemesterUrl = (sem) => {
  if (!sem || sem !== '0' || sem !== '1') {
    return getCurrentSemester();
  }

  return config.urlParts[parseInt(sem, 10)];
};

const generateUrl = (urlPart, collegeIndex, sem) =>
  `${config.COLLEGE_URLS[collegeIndex].TIMETABLE_URL}${config.LIST_URL}${encodeURIComponent(
    urlPart
  ).replace(/_/g, '%5F')}${generateSemesterUrl(sem)}`;

/**
 * Scrapes timetable
 * @param {String} urlPart
 * @param {String} college
 * @param {String} sem
 * @returns {Object}
 */
const scrapeTimetable = async (urlPart, college, sem) => {
  const url = generateUrl(urlPart, college, sem);
  const { body } = await got(url);
  const $ = cheerio.load(body);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const jsonObj = {};
  jsonObj.data = [];

  // Get top level tables
  const tables = $('table')
    .filter((i, elm) => !$(elm).parents('table').length)
    .slice(1, -1);
  // Each day
  $(tables).each((i, table) => {
    let lastEndTime;
    jsonObj.data.push([]);
    // Only days with class
    $(table)
      .children('tbody')
      .find('tr')
      .each((j, row) => {
        if (j === 0) return; // Skip row with useless data
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
            jsonObj.data[i].push({ break: true, breakLength: difference });
          }
        }
        jsonObj.data[i].push({
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

  const isEmpty = (a) => Array.isArray(a) && a.every(isEmpty);
  jsonObj.empty = isEmpty(jsonObj.data);

  jsonObj.courseCode = urlPart;
  jsonObj.url = url;
  jsonObj.semester = sem;
  jsonObj.college = config.COLLEGE_URLS[college].NAME;

  const course = await Course.findOne({
    course: encodeURIComponent(urlPart)
      .replace(/_/g, '%5F')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29'),
  });
  if (course) {
    if (course.college === '1') {
      const match = course.title.match(/\d-/);
      jsonObj.title = course.title.match(/\d-/)
        ? course.title.substring(course.title.indexOf(match) + 2)
        : course.title.substring(course.title.indexOf(' '), course.title.length);
    } else {
      jsonObj.title = course.title;
    }
  } else {
    jsonObj.title = jsonObj.courseCode;
  }
  return jsonObj;
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
  getSemester,
  scrapeCourses,
  scrapeTimetable,
};
