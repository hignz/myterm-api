const Koa = require('koa');
const KoaJson = require('koa-json');
const router = require('./src/router/routes');
const cors = require('@koa/cors');
const path = require('path');
const render = require('koa-ejs');

const app = new Koa();
const config = require('./src/config');

render(app, {
  root: path.join(`${__dirname}/src/`, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false,
});

router.get('/', async (ctx) => {
  await ctx.render('index');
});

app
  .use(KoaJson())
  .use(cors());

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(config.Port, () => console.log(`Server live on port ${config.Port}`));
