const Task = require('../models/task.model.js')

exports.getTask = async ({ params: { id: taskId }}, res, next) => {
    let task

    try {
        task = await Task.findById(taskId)
        if (task == null) {
        return res.status(404).json({ message: 'Cannot find task' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    
    res.task = task
    next()
}