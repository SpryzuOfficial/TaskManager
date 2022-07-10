const {Schema} = require('mongoose');

const TaskSchema = Schema(
{
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    done: {
        type: Boolean,
        default: false
    }
});

module.exports = TaskSchema;