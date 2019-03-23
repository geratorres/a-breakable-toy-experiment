const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { contactsRouter } = require('./routes');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app
    .use(bodyParser())
    .use(contactsRouter.routes())
    .use(router.allowedMethods());

app.on('error', (err, ctx) => {
    if (!err.status || err.status == 500) {
        console.error('server error: ', err);
    }
});

module.exports = app;