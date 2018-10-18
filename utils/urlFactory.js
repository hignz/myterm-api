module.exports = (courseCode) => {
  const splitCode = courseCode.replace(/-/g, '/').split(/[/()]+/);
  return `http://timetables.itsligo.ie:81/reporting/textspreadsheet;student+set;id;${splitCode[0]}%2F${splitCode[1]}`
  + `%2F${splitCode[2]}%2F${splitCode[3]}%2F%28${splitCode[4]}%29%0D%0A`
  + '?t=student+set+textspreadsheet&days=1-5&weeks=&periods=3-20&template=student+set+textspreadsheet';
};
