const express = require('express');
const profileController = require('../Controller/profileController');
const resultController = require('../Controller/resultController');
const authController = require('../Controller/authController');
const router = express.Router();

// router.route('/').post(profileController.createProfile);

router
  .route('aptitude/:contestNumber/:usn')
  .patch(
    profileController.updateAptitudeProfile,
    resultController.updateAptitudeResult
  );

router
  .route('dsa/:contestNumber/:usn')
  .patch(profileController.updateDSAProfile, resultController.updateDSAResult);

router.route('/:usn').get(profileController.getUserProfileDetails);

module.exports = router;
