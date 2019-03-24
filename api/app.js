const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { contactsRouter } = require('./routes');
const Router = require('koa-router');

const cors  = require('koa2-cors');

const { parseQuery, validateBody, errorHandler } = require('./middlewares');

const app = new Koa();
const router = new Router();

app
    .use(cors())
    .use(errorHandler)
    .use(bodyParser())
    .use(parseQuery)
    .use(validateBody)
    .use(contactsRouter.routes())
    .use(router.allowedMethods());

app.on('error', (err, ctx) => {
    if (!err.status || err.status == 500) {
        console.error(err.stack);
    }
});

module.exports = app;