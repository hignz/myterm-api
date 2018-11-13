const urlFactory = require('./urlFactory');
const cheerio = require('cheerio');
const got = require('got');

module.exports = async (urlPart) => {
  const { body } = await got(urlFactory(urlPart));
  const $ = cheerio.load(body);
  const tables = $('table').filter(function () { return $(this).parents('table').length === 0; }).slice(1, -1); // Only top level tables
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const jsonObj = {};
  jsonObj.data = [];

  $(tables).each((h, e) => { // Day
    jsonObj.data.push([]);
    $(e).children('tbody:not(:nth-child(1))').each((i, elm) => { // Only days with class
      $(elm).find('tr').each((j, elmem) => { // Class
        if (j === 0) return; // Skip row with useless data
        const module = $(elmem);
        const details = [];
        $(module).find('td').each((k, elmm) => {
          details.push($(elmm).text());
        });
        jsonObj.data[h].push({
          day: days[h],
          startTime: details[3],
          name: details[0],
          room: details[7],
          type: details[2],
          teacher: details[8],
          length: details[5],
          endTime: details[4],
        });
      });
    });
  });

  console.log(urlFactory(urlPart));

  return jsonObj;
};
