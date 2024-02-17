const express = require('express');
const profileController = require('../Controller/profileController');
const resultController = require('../Controller/resultController');
const authController = require('../Controller/authController');
const router = express.Router();

router
  .route('/aptitude/:contestNumber/:usn')
  .patch(
    resultController.updateAptitudeResult,
    profileController.updateAptitudeProfile
  );

router
  .route('/dsa/:contestNumber/:usn')
  .patch(resultController.updateDSAResult, profileController.updateDSAProfile);

router.route('/:usn').get(profileController.getUserProfileDetails);

module.exports = router;
