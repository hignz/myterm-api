const urlFactory = require('./urlFactory');
const cheerio = require('cheerio');
const got = require('got');

module.exports = async (urlPart) => {
  const url = urlFactory(urlPart);
  const { body } = await got(url);
  const $ = cheerio.load(body);

  const tables = $('table') // Only top level tables
    .filter((i, elm) => (!$(elm).parents('table').length))
    .slice(1, -1);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const jsonObj = {};
  jsonObj.data = [];

  $(tables).each((i, table) => { // Day
    jsonObj.data.push([]);
    $(table).children('tbody').find('tr').each((j, row) => { // Only days with class
      if (j === 0) return; // Skip row with useless data
      const details = [];
      $(row).find('td').each((k, cell) => {
        details.push($(cell).text());
      });
      jsonObj.data[i].push({
        day: days[i],
        startTime: details[3],
        name: details[1].split('- ')[1] || details[0],
        room: details[7].trim() || 'N/A',
        type: details[2],
        teacher: details[8],
        length: details[5],
        endTime: details[4],
      });
    });
  });

  console.log(JSON.stringify(jsonObj));
  jsonObj.courseCode = decodeURIComponent(urlPart);
  jsonObj.url = url;

  console.log(urlFactory(urlPart));

  return jsonObj;
};
