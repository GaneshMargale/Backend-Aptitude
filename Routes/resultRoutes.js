const express = require('express');
const resultController = require('../Controller/resultController');
const authController = require('../Controller/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, resultController.getAllResults)
  .post(resultController.createResult);

router
  .route('/:contestNumber/:usn')
  .get(authController.protect, resultController.getResultByUsn);

router
  .route('/:contestNumber')
  .get(authController.protect, resultController.getResult)
  .delete(resultController.deleteResult);

module.exports = router;
