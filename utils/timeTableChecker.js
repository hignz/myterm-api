const urlFactory = require('./urlFactory');
const tabletojson = require('tabletojson');
const getDay = require('../utils/intToDay');

module.exports = async (courseCode) => {
  const json = await tabletojson.convertUrl(urlFactory(courseCode));

  const jsonObj = {};
  jsonObj.timetable = [];

  for (let d = 8; d < 13; d += 1) {
    const day = getDay(d - 7);

    jsonObj.timetable.push({
      [day]: [],
    });

    console.log('sd');

    for (let entry = 1; entry < json[d].length; entry += 1) {
      if (json[d][entry][2] === '' || json[d][entry][5] === '' || json[d][entry][0] === '') { continue; }
      jsonObj.timetable[d - 8][day].push({
        name: json[d][entry][0],
        type: json[d][entry][2],
        startTime: json[d][entry][3],
        endTime: json[d][entry][4],
        length: json[d][entry][5],
        room: json[d][entry][7],
      });
    }
  }

  if (Object.keys(jsonObj.timetable[4]).length === 0) {
    jsonObj.timetable.splice(4, 1);
  }

  return jsonObj;
};
