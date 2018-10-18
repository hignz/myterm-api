const KoaRouter = require('koa-router');
const jsonFactory = require('../utils/jsonFactory');

const router = new KoaRouter();

router.get('/api', async (ctx) => {
  ctx.body = 'example /api/SG_KSDEV_B07-F-Y2-1-(A)';
});

router.get('/api/:code', async (ctx) => {
  ctx.body = await jsonFactory(ctx.params.code);
});

module.exports = router;
