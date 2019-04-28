require('dotenv/config');
const Koa = require('koa');
const KoaJson = require('koa-json');
const cors = require('@koa/cors');
const path = require('path');
const render = require('koa-ejs');
const mongoose = require('mongoose');
const router = require('./src/router/routes');

const app = new Koa();
const config = require('./src/config');
const scraper = require('./src/utils/courseScraper');

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

app.listen(config.PORT, () => {
  console.log(`Server live on port ${config.PORT}`);
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });
});

const db = mongoose.connection;

db.on('error', (err => console.log(err)));

(async () => {
  await scraper();
})();
