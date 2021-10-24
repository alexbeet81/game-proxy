const express = require('express');
const userCtrl = require('../controllers/user');
const router = express.Router();

// login
router.post('/login', userCtrl.login);
// regiister
router.post('/register', userCtrl.register);

module.exports = router;