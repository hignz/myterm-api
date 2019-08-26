module.exports = (sem) => {
  if (sem === '0' || sem === '1') {
    return sem;
  }

  const today = new Date();
  const year = today.getFullYear();

  if (Date.parse(today) >= Date.parse(`${year}-07-20`)
    && Date.parse(today) <= Date.parse(`${year}-12-19`)) {
    return '0';
  }

  return '1';
};
