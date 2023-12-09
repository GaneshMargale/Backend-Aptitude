const express = require('express');
const profileController = require('../Controller/profileController');
const resultController = require('../Controller/resultController');
const authController = require('../Controller/authController');
const router = express.Router();

// router.route('/').post(profileController.createProfile);
const delayMiddleware = (req, res, next) => {
  if (res.headersSent) {
    return next();
  }

  setTimeout(() => {
    console.log('Delaying middleware execution...');
    next();
  }, 3000);
};
router
  .route('/aptitude/:contestNumber/:usn')
  .patch(
    profileController.updateAptitudeProfile,
    delayMiddleware,
    resultController.updateAptitudeResult
  );

router
  .route('/dsa/:contestNumber/:usn')
  .patch(
    profileController.updateDSAProfile,
    delayMiddleware,
    resultController.updateDSAResult
  );

router.route('/:usn').get(profileController.getUserProfileDetails);

module.exports = router;
