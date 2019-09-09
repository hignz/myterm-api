const puppeteer = require('puppeteer');
const config = require('../config');

module.exports = async (college) => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
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
