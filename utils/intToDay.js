module.exports = (i) => {
  let day = '';

  switch (i) {
    case 1:
      day = 'monday';
      break;
    case 2:
      day = 'tuesday';
      break;
    case 3:
      day = 'wednesday';
      break;
    case 4:
      day = 'thursday';
      break;
    case 5:
      day = 'friday';
      break;
    default:
      day = 'invalid';
      break;
  }

  return day;
};
