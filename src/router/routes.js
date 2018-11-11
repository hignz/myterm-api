const KoaRouter = require('koa-router');
const jsonFactory = require('../utils/timeTableChecker');
const roomChecker = require('../utils/roomChecker');
const Timetable = require('../models/Timetable');

const router = new KoaRouter();

router.get('/timetable/:code', async (ctx) => {
  try {
    const data = await Timetable.find({ course: ctx.params.code.toUpperCase().replace(/-/g, '/') });
    console.log(data[0].url);
    ctx.body = await jsonFactory(data[0].url);
  } catch (err) {
    console.log(err);
  }
});

router.get('/freerooms/:type', async (ctx) => {
  ctx.body = await roomChecker(ctx.params.type);
});

module.exports = router;
