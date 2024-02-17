const express = require('express');
const resultController = require('../Controller/resultController');
const authController = require('../Controller/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, resultController.getAllResults)
  .post(resultController.createResult);

router
  .route('/aptitude')
  .get(authController.protect, resultController.getAllAptitudeResults)
  .post(resultController.createAtitudeResult);

router
  .route('/dsa')
  .get(authController.protect, resultController.getAllDSAResults)
  .post(resultController.createDSAResult);

router
  .route('/aptitude/:contestNumber')
  .get(authController.protect, resultController.getAptitudeResult);

router
  .route('/dsa/:contestNumber')
  .get(authController.protect, resultController.getDSAResult);

router
  .route('/:contestNumber/:usn')
  .get(authController.protect, resultController.getResultByUsn);

router
  .route('/:contestNumber')
  .get(authController.protect, resultController.getResult)
  .delete(resultController.deleteResult);

module.exports = router;
