const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const contactRtr = require('./routes/contactsRouter');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app
    .use(bodyParser())
    .use(contactRtr.routes())
    .use(router.allowedMethods());

app.on('error', err => {
    console.error('server error', err);
});

module.exports = app;