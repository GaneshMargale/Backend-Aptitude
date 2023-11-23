const express = require('express');
const profileController = require('../Controller/profileController');
const resultController = require('../Controller/resultController');
const authController = require('../Controller/authController');
const router = express.Router();

// router.route('/').post(profileController.createProfile);

router.route('/:contestNumber/:usn').patch(
  // resultController.createResult,
  profileController.updateAptitudeProfile,
  resultController.updateAptitudeResult
);

router.route('/:usn').post(profileController.getUserProfileDetails);

module.exports = router;
