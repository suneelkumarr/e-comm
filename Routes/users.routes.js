const router = require('express').Router();

const controller = require('./../Controllers/users.controller');

router.post('', controller.register)
router.post('/login', controller.login)

module.exports = router;