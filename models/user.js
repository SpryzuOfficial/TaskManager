const {Schema, model} = require('mongoose');

const TaskSchema = require('./task');

const UserSchema = Schema(
{
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    
    tasks: {
        type: [TaskSchema],
        default: []
    }
});

module.exports = model('User', UserSchema);