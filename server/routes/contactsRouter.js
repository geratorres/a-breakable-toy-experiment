const Router = require('koa-router');
const router = new Router();

const { contactsCtrl } = require('../controllers');

//TODO: add api version on Routes
router.get('/contact-management/contacts', contactsCtrl.readAll)
    .post('/contact-management/contacts', contactsCtrl.createOne)
    .get('/contact-management/contacts/:id', contactsCtrl.readOne)
    .delete('/contact-management/contacts/:id', contactsCtrl.deleteOne)
    .put('/contact-management/contacts/:id', contactsCtrl.updateOne);

module.exports = router;