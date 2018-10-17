const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaJson = require('koa-json');
const tabletojson = require('tabletojson');

const app = new Koa();
const router = new KoaRouter();

const groupCode = 'SG_KSDEV_B07';
const port = process.env.PORT || 3000;

app.use(KoaJson());

async function createJson () {
  const json = await tabletojson.convertUrl(`http://timetables.itsligo.ie:81/reporting/textspreadsheet;student+set;id;${groupCode}%2FF%2FY2%2F1%2F%28A%29%0D%0A?`
    + 't=student+set+textspreadsheet&days=1-5&weeks=&periods=3-20&template=student+set+textspreadsheet');

  const jsonObj = {};
  jsonObj.timetable = [];

  let counter = 0;

  for (let day = 8; day < 13; day += 1) {
    jsonObj.timetable.push([]);
    for (let entry = 1; entry < Object.keys(json[day]).length; entry += 1) {
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

  return jsonObj;
}

router.get('/timetable', async (ctx) => {
  ctx.body = await createJson();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => console.log(`Server live on port ${port}`));
