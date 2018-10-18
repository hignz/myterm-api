const urlFactory = require('./urlFactory');
const tabletojson = require('tabletojson');

module.exports = async (courseCode) => {
  const json = await tabletojson.convertUrl(urlFactory(courseCode));

  const jsonObj = {};
  jsonObj.timetable = [];

  let counter = 0;

  for (let day = 8; day < 13; day += 1) {
    jsonObj.timetable.push([]);
    for (let entry = 1; entry < json[day].length; entry += 1) {
      if (json[day][entry][2] === '' || json[day][entry][5] === '' || json[day][entry][0] === '') continue;
      jsonObj.timetable[counter].push({
        name: json[day][entry][0],
        type: json[day][entry][2],
        startTime: json[day][entry][3],
        endTime: json[day][entry][4],
        length: json[day][entry][5],
        room: json[day][entry][7],
      });
    }
    counter += 1;
  }

  if (Object.keys(jsonObj.timetable[4]).length === 0) {
    console.log(Array.isArray(jsonObj.timetable[4]));
    jsonObj.timetable.splice(4, 1);
    console.log(jsonObj.timetable[0].length);
  }

  console.log(jsonObj);
  return jsonObj;
};
