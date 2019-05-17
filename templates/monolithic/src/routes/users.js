const router = require('express').Router();
const { usersController } = require('../controllers');

router.get('/:id', usersController.get);
router.post('/', usersController.create);
router.patch('/:id', usersController.update);
router.delete('/:id', usersController.delete);

module.exports = router;
