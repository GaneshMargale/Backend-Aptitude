const express = require('express');
const leaderShipController = require('../Controller/leadershipController');
const authController = require('../Controller/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, leaderShipController.getLeaderShip);

module.exports = router;
