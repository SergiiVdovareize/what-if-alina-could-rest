const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    priority: {
        type: String,
        enum: ['low', 'normal', 'high'],
        default: 'normal',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Task', TaskSchema)