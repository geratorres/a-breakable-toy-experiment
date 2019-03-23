const Router = require('koa-router');
const router = new Router();

const { contactsCtrl } = require('../controllers');

router.get('/api/contacts', contactsCtrl.readAll)
    .post('/api/contacts', contactsCtrl.createOne)
    .get('/api/contacts/:id', contactsCtrl.readOne)
    .delete('/api/contacts/:id', contactsCtrl.deleteOne)
    .put('/api/contacts/:id', contactsCtrl.updateOne);

module.exports = router;