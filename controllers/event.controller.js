'use strict';

const moment = require('moment');
const Event = require('../module/event');

const getEventStatus = (startAt, endAt) => {

    if (moment(endAt).diff(moment()) < 0) {
        return {
            text: 'Event är stängt',
            lable: 'warning'
        };
    }

    if (moment(startAt).diff(moment()) >= 0) {
        return {
            text: 'Event har ej börjat',
            lable: 'default'
        }
    }

    return {
        text: 'Event är igång',
        lable: 'success'
    };

};

module.exports = {
    list: (req, res, next) => {
        let { limit = 50, skip = 0 } = req.query;

        Event.list({ limit, skip })
            .then(event => {
                let events = event.map(event => {

                    return {
                        id: event.id,
                        name: event.name,
                        startAt: moment(event.startAt).format('YYYY-MM-DD HH:mm:SS'),
                        endAt: moment(event.endAt).format('YYYY-MM-DD HH:mm:SS'),
                        attendeesCount: event.appointments.filter((value) => {
                            return (value.phonenumber && value.phonenumber != null);
                        }).length,
                        total: event.appointments.length,
                        status: getEventStatus(event.startAt, event.endAt)
                    }
                });
                res.render('eventList', { events: events });
            })
            .catch(e => next(e));
    },

    create: (req, res, next) => {
        const startDate = moment(req.body.startAt);
        const endDate = moment(req.body.endAt);
        let appointments = [];

        for (let date = moment(startDate); date.diff(endDate) < 0; date.add(req.body.interval, 'minutes')) {
            appointments.push({
                time: date.format()
            });
        }

        const event = new Event({
            name: req.body.name,
            startAt: req.body.startAt,
            endAt: req.body.endAt,
            interval: req.body.interval,
            appointments: appointments,
        });

        event.save()
            .then(savedEvent => res.redirect('/event'))
            .catch(e => next(e));
    },

    getView: (req, res, next) => {
        Event.get(req.params.eventId)
            .then((event) => {
                let data = {
                    id: event.id,
                    name: event.name,
                    startAt: moment(event.startAt).format('YYYY-MM-DD HH:mm:SS'),
                    endAt: moment(event.endAt).format('YYYY-MM-DD HH:mm:SS'),
                    attendeesCount: event.appointments.filter((value) => {
                        return (value.phonenumber && value.phonenumber != null);
                    }).length,
                    availables: event.appointments.filter((appointment) => {
                        return (!appointment.phonenumber && appointment.phonenumber == null);
                    }).map((appointment) => {
                        return {
                            id: appointment._id,
                            time: appointment.time,
                            friendlyTime: moment(appointment.time).format('HH:mm'),
                        }
                    }),
                    attendees: event.appointments.filter((value) => {
                        return (value.phonenumber && value.phonenumber != null);
                    }).map((appointment) => {
                        return {
                            id: appointment._id,
                            name: appointment.name,
                            phonenumber: appointment.phonenumber,
                            time: moment(appointment.time).format('HH:mm'),
                        }
                    }),
                    total: event.appointments.length,
                    status: getEventStatus(event.startAt, event.endAt)
                }
                res.render('event', { event: data });
            })
            .catch(e => console.log(e));
    },

    createView: (req, res, next) => {
        res.render('eventNew');
    },

    createAppointment: (req, res, next) => {
        Event.update({ 'appointments._id': req.body.time }, {
            $set: {
                'appointments.$.name': req.body.name,
                'appointments.$.phonenumber': req.body.phonenumber
            }
        })
            .exec()
            .then((event) => {
                res.redirect('/event/' + req.params.eventId);
            })
            .catch(e => next(e));
    }
}