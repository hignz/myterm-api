const urlFactory = require('./urlFactory');
const tabletojson = require('tabletojson');
const getDay = require('./intToDay');

module.exports = async (courseCode) => {
  let json = await tabletojson.convertUrl(urlFactory(courseCode));

  const jsonObj = {};
  jsonObj.data = [];

  json = json.splice(8, 5);

  for (let d = 0; d < json.length; d += 1) {
    jsonObj.data.push([]);

    for (let entry = 1; entry < json[d].length; entry += 1) {
      if (json[d][entry][2] === '' || json[d][entry][5] === '' || json[d][entry][0] === '') continue;

      jsonObj.data[d].push({
        day: getDay(d),
        startTime: json[d][entry][3],
        name: json[d][entry][0],
        room: json[d][entry][7],
        type: json[d][entry][2],
        teacher: json[d][entry][8],
        length: json[d][entry][5],
        endTime: json[d][entry][4],
      });
    }
  }

  return jsonObj;
};
