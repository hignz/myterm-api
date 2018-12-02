const KoaRouter = require('koa-router');
const jsonFactory = require('../utils/timeTableChecker');
const roomChecker = require('../utils/roomChecker');
const Timetable = require('../models/Timetable');

const router = new KoaRouter();

router.get('/api/timetable/:code', async (ctx) => {
  console.log(decodeURIComponent(ctx.params.code));
  const data = await Timetable.findOne({ course: ctx.params.code.toUpperCase().replace(/-/g, '/') });
  console.log(data.url);
  ctx.body = await jsonFactory(data.url);
});

router.get('/api/allcourses', async (ctx) => {
  const allCourses = await Timetable.find({}).select({
    course: 1, title: 1, url: 1, _id: 0,
  });
  ctx.body = allCourses;
});

router.get('/api/freerooms/:type', async (ctx) => {
  ctx.body = await roomChecker(ctx.params.type);
});

module.exports = router;
