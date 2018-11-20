const got = require('got');
const cheerio = require('cheerio');

const config = require('../config');

module.exports = async (type) => {
  const url = type === '0' ? config.LABROOM_URL : config.LECTUREROOM_URL;

  const { body } = await got(url);

  const $ = cheerio.load(body);

  const jsonObj = {};
  jsonObj.data = [];

  $('.room').not('.hide').each((i, elm) => {
    const time = $(elm).attr('id');
    const room = $(elm).find('.room_id').not('.hide').text()
      .trim()
      .replace(/\./g, '')
      .replace(/\s\s+/g, ' ');

    jsonObj.data.push({
      time,
      freerooms: [room],
    });
  });

  return jsonObj;
};
