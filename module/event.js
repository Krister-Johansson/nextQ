const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.ObjectId;

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        required: true
    },
    startAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    endAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    interval: {
        type: Number,
        required: true
    },
    appointments: [{
        id: {
            type: ObjectId
        },
        name: {
            type: String
        },
        phonenumber: {
            type: String
        },
        time: {
            type: Date,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

EventSchema.statics.list = function ({ skip = 0, limit = 50 }) {
    let that = this;
    return new Promise((resolve, reject) => {
        that.find()
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec()
            .then((event) => {
                if (event) {
                    resolve(event);
                }
                reject(new Error('No such event exists!'));
            });
    });
}
EventSchema.statics.get = function (id) {
    let that = this;
    return new Promise((resolve, reject) => {
        that.findById(id)
            .exec()
            .then((event) => {
                if (event) {
                    resolve(event);
                }
                reject(new Error('No such event exists!'));
            });
    });
}


module.exports = mongoose.model('Event', EventSchema);