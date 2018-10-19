const Koa = require('koa');
const KoaJson = require('koa-json');

const app = new Koa();
const router = require('./router/routes');
const cors = require('@koa/cors');

const port = process.env.PORT || 3000;

app
  .use(KoaJson())
  .use(cors());

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, () => console.log(`Server live on port ${port}`));
