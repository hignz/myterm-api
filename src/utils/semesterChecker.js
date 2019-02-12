const config = require('../config');

const getCurrentSemester = () => {
  const today = new Date();
  const year = today.getFullYear();
  if (Date.parse(today) >= Date.parse(`07/01/${year}`) && Date.parse(today) <= Date.parse(`12/19/${year}`)) {
    return config.SEM1_URL_PART;
  }

  return config.SEM2_URL_PART;
};

module.exports = (sem) => {
  const url = (!sem || sem === '')
    ? getCurrentSemester()
    : sem === '0'
      ? config.SEM1_URL_PART
      : sem === '1'
        ? config.SEM2_URL_PART
        : getCurrentSemester();

  return url;
};
