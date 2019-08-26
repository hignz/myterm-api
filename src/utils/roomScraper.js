const got = require('got');
const cheerio = require('cheerio');

const config = require('../config');

module.exports = async (type) => {
  const url = type ? [config.LABROOM_URL, config.LECTUREROOM_URL][type] : config.LABROOM_URL;

  const { body } = await got(url);

  const $ = cheerio.load(body);

  const rooms = {};
  rooms.data = [];

  $('.room')
    .not('.hide')
    .each((i, elm) => {
      const time = $(elm).attr('id');
      const room = $(elm).find('.room_id')
        .not('.hide')
        .text()
        .trim()
        .replace(/\./g, '')
        .replace(/\s\s+/g, ' ');

      console.log(room);

      rooms.data.push({
        time,
        freerooms: [room],
      });
    });

  return rooms;
};
