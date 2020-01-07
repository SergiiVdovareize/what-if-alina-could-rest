const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema({
    title: String,
    description: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Task', TaskSchema)