const router = require('express').Router();
const { usersController } = require('../controllers');

router.get('/:id', usersController.get);

module.exports = router;
