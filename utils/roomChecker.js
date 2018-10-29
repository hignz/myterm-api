const got = require('got');
const cheerio = require('cheerio');

module.exports = async (type) => {
  const url = type === '0' ? 'https://www.itsligo.ie/student-hub/computer-labs/' : 'https://www.itsligo.ie/student-hub/lecture-rooms/';

  const { body } = await got(url);

  const $ = cheerio.load(body);

  const json = {};
  json.data = [];

  $('.timeslot').each((i, element) => {
    const item = $(element);
    const time = item.children('div .time').text();
    const room = item.children('.room')
      .children('.room_id')
      .not('.hide')
      .text()
      .trim()
      .replace(/\./g, '')
      .replace(/\s\s+/g, ' ');

    json.data.push({
      time,
      freerooms: [room],
    });
  });

  return json;
};
