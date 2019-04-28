const puppeteer = require('puppeteer');
const config = require('../config');

const updateDb = require('./updateDb');
const Timetable = require('../models/Timetable');

const scrape = async (collegeIndex) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(config.COLLEGE_TIMETABLE_URLS[collegeIndex]);
  await page.waitFor(2000);

  const result = await page.evaluate(() => {
    const data = [];
    const form = document.querySelector('select[name=identifier]');

    for (const element of form) {
      const url = element.value;
      const title = element.innerText;

      data.push({ url, title });
    }

    return data;
  });

  browser.close();
  return result;
};

module.exports = async function updater () {
  for (let i = 0; i < config.COLLEGE_TIMETABLE_URLS.length; i += 1) {
    setTimeout(async function updateCoursesLoop () {
      await scrape(i).then((result) => {
        console.log(result);
        updateDb(Timetable, result);
      })
        .catch(err => console.log(err));
      setTimeout(updateCoursesLoop, config.COURSE_UPDATER_INTERVAL);
    }, 0);
  }

  //   setTimeout(async function updateCoursesLoop () {
  //     await scrape(1).then((result) => {
  //       console.log(result);
  //     });
  //     setTimeout(updateCoursesLoop, config.COURSE_UPDATER_INTERVAL);
  //   }, 0);

//   setTimeout(async function updateCoursesLoop () {
//     await scrape(2).then((result) => {
//       console.log(result);
//     });
//     setTimeout(updateCoursesLoop, config.COURSE_UPDATER_INTERVAL);
//   }, 0);
};
