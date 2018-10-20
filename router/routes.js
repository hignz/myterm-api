const KoaRouter = require('koa-router');
const jsonFactory = require('../utils/timeTableChecker');
const roomChecker = require('../utils/roomChecker');

const router = new KoaRouter();

router.get('/timetable', async (ctx) => {
  ctx.body = 'example /timetable/SG_KSDEV_B07-F-Y2-1-(A)';
});

router.get('/timetable/:code', async (ctx) => {
  ctx.body = await jsonFactory(ctx.params.code);
});

router.get('/freerooms', async (ctx) => {
  ctx.body = await roomChecker();
});

module.exports = router;
