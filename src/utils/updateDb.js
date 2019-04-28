const Timetable = require('../models/Timetable');

module.exports = async (model, data) => {
  await model.findOneAndUpdate({}, data, { upsert: true }, (err) => {
    console.log(err);
  });
};
