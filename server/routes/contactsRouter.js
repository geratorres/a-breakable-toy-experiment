const Router = require('koa-router');
const router = new Router();

const { contactsCtrl } = require('../controllers');


router.get('/contacts', contactsCtrl.index);

router.post('/contacts', contactsCtrl.create);
/*
router.get('/contacts/:id', contactsCtrl.getOne);

router.put('/contacts/:id', contactsCtrl.update);

router.delete('/contacts/:id', contactsCtrl.delete);
*/
module.exports = router;