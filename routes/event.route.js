"use strict";

const router = require('express').Router();
const validate = require('express-validator');
const paramValidation = require('../config/param-validation');
const eventCtrl = require('../controllers/event.controller');

router.route('/')
  /** GET /event - Get list of events */
  .get(eventCtrl.list)
  /** POST /event - Create new event */
  .post(validate(paramValidation.createUser), eventCtrl.create);

router.route('/create')
  /** GET /event/create - Get view of new event */
  .get(eventCtrl.createView);
  
router.route('/:eventId')
  /** GET /event/:eventId - Get event */
  .get(eventCtrl.getView)
  /** POST /event - Create new appointment */
  .post(validate(paramValidation.createAppointment), eventCtrl.createAppointment);



module.exports = router;