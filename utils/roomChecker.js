const got = require('got');
const cheerio = require('cheerio');

const url = 'https://www.itsligo.ie/student-hub/lecture-rooms/';

module.exports = async () => {
  const { body } = await got(url);

  console.log(body);

  const $ = cheerio.load(body);

  const json = {};

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

    json[time] = [{
      rooms: [room],
    }];
  });

  console.log(JSON.stringify(json));

  return json;
};
