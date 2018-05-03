const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema ({
    name: {
        type: String,
        reuired: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);