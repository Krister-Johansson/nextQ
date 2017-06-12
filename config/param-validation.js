"use strict";

const Joi = require('Joi');

module.exports = {
    // POST /event
    createUser: {
        body: {
            name: Joi.string().required(),
            startAt: Joi.date().required(),
            endAt: Joi.date().required(),
            interval: Joi.number().min(1).positive().required()
        }
    },

    createAppointment: {
        body: {
            name: Joi.string().required(),
            phonenumber: Joi.string().required(),
            time: Joi.string().required()
        }
    },
};