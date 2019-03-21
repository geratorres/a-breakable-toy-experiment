const Router = require('koa-router');
const router = new Router();

const contactsCtrl = require('../controllers/contactsController');


router.get('/contacts/:page', contactsCtrl.get);

router.post('/contacts', contactsCtrl.post);

module.exports = router;