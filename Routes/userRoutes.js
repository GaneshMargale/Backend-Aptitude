const express = require('express');
const authController = require('../Controller/authController');
const profileController = require('../Controller/profileController');
const batchController = require('../Controller/batchController');

const router = express.Router();

router.post('/signup', authController.signup, profileController.createProfile);

router.post('/login', authController.login);

router.get('/:batchName', batchController.createBatch);
module.exports = router;
