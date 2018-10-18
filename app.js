const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaJson = require('koa-json');
const jsonFactory = require('./utils/jsonFactory');

const app = new Koa();
const router = new KoaRouter();

const port = process.env.PORT || 3000;

app.use(KoaJson());

router.get('/api', async (ctx) => {
  ctx.body = 'example /api/SG_KSDEV_B07-F-Y2-1-(A)';
});

router.get('/api/:code', async (ctx) => {
  ctx.body = await jsonFactory(ctx.params.code);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => console.log(`Server live on port ${port}`));
