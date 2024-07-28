import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

import config from '../config/config.js';
import Course from '../models/course.model.js';

interface Timetable {
  data?: ((Day | null)[] | null)[] | null;
  empty: boolean;
  courseCode: string;
  url: string;
  semester: number;
  college: string;
  title: string;
}

interface Day {
  activity?: string | null;
  day?: string | null;
  startTime?: string | null;
  name?: string | null;
  room?: string | null;
  type?: string | null;
  teacher?: string | null;
  length?: string | null;
  endTime?: string | null;
  break?: boolean | null;
  breakLength?: number | null;
}

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.substring(1);
    })
    .join(' ');
};

const getCurrentSemester = () => {
  const today = new Date();
  const year = today.getFullYear();
  if (
    today.getTime() >= Date.parse(`${year}-07-20`) &&
    today.getTime() <= Date.parse(`${year}-12-19`)
  ) {
    return 0;
  }

  return 1;
};

const generateSemesterUrl = (sem: string) => {
  if (!sem || (sem !== '0' && sem !== '1')) {
    return config.URL_PARTS[getCurrentSemester()];
  }
  return config.URL_PARTS[parseInt(sem, 10)];
};

const generateUrl = (urlPart: string, sem: string) =>
  `${config.COLLEGE_URLS[0]?.TIMETABLE_URL}${config.LIST_URL}${encodeURIComponent(
    urlPart,
  ).replace(/_/g, '%5F')}${generateSemesterUrl(sem)}`;

const fetchBody = async (url: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
    return null;
  }, 3500);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.text();
  } catch (error) {
    // @ts-expect-error narrow error
    if (error.name === 'AbortError') {
      return null;
    }
  } finally {
    clearTimeout(timeout);
  }
};

const scrapeTimetable = async (
  urlPart: string,
  college: string,
  sem: string,
) => {
  const url = generateUrl(urlPart, sem);
  const body = await fetchBody(url);

  if (!body) return null;

  const $ = cheerio.load(body);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const course = await Course.findOne({
    course: encodeURIComponent(urlPart)
      .replace(/_/g, '%5F')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29'),
  }).lean();

  const timetable: Timetable = {
    courseCode: urlPart,
    url,
    semester: parseInt(sem, 10) || getCurrentSemester(),
    empty: false,
    college: config.COLLEGE_URLS[0]?.NAME ?? '',
    title: course?.title ?? urlPart,
    data: [],
  };

  // Get top level tables
  const tables = $('table')
    .filter((i, elm) => !$(elm).parents('table').length)
    .slice(1, -1);

  // Each day
  $(tables).each((i, table) => {
    let lastEndTime: string | undefined;
    let lastStartTime: string | undefined;
    timetable.data?.push([]);
    // Only days with class

    $(table)
      .children('tbody')
      .find('tr')
      .each((j, row) => {
        // Skip row with useless data
        if (j === 0) return;

        const details = $(row)
          .find('td')
          .map((_, cell) => $(cell).text())
          .get();

        if (
          lastEndTime !== null &&
          lastEndTime !== details[4] &&
          lastStartTime !== details[3]
        ) {
          const difference =
            Math.abs(
              new Date(`01/01/1990 ${details[3]}`).getTime() -
                new Date(`01/01/1990 ${lastEndTime}`).getTime(),
            ) / 60000;
          if (difference > 0) {
            timetable.data?.[i]?.push({ break: true, breakLength: difference });
          }
        }

        timetable.data?.[i]?.push({
          activity: details[0],
          day: days[i],
          startTime: details[3],
          name: toTitleCase(
            details[1]?.split('- ')[1] ?? details[1] ?? details[0] ?? '',
          ),
          room: details[7]?.trim() || 'N/A',
          type: details[2],
          teacher: details[8]?.replace(/,/g, ', ').replace(/ {2}/g, ' '),
          length: details[5],
          endTime: details[4],
        });

        lastEndTime = details[4];
        lastStartTime = details[3];
      });
  });

  timetable.empty = (timetable.data?.length ?? 0) <= 0;

  return timetable;
};

const scrapeCourses = async (college: number) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  const collegeUrl = config.COLLEGE_URLS[college]?.COURSES_URL;

  if (!collegeUrl) {
    return [];
  }

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

  await page.goto(collegeUrl);

  // Wait for the select element to be present and have options
  await page.waitForFunction(
    () => {
      const select = document.querySelector(
        'select[name=identifier]',
      ) as HTMLSelectElement;
      return select && select.options.length > 0;
    },
    { timeout: 10000 },
  ); // 10 second timeout, adjust as needed

  const result = await page.evaluate((c) => {
    const data = [];
    const select = document.querySelector(
      'select[name=identifier]',
    ) as HTMLSelectElement;
    if (!select) return [];

    for (const option of Array.from(select.options)) {
      const course = option.value;
      const title = option.innerText;

      // console.log(`Option - value: ${course}, text: ${title}`);

      data.push({ course, title, college: c });
    }

    return data;
  }, college);

  await browser.close();

  return result;
};

export { scrapeCourses, scrapeTimetable };
