const got = require('got');
const cheerio = require('cheerio');

const url = 'https://www.itsligo.ie/student-hub/computer-labs/';

module.exports = async () => {
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

    // json[time] = [{
    //   rooms: [room],
    // }];
  });

  return json;
};
