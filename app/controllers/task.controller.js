const Task = require('../models/task.model.js')
const User = require('../models/user.model.js')

exports.index = ({query: {sort, asc, limit = 10, page = 1, author}}, res) => {
    const sortFiels = sort || 'title'
    limit = parseInt(limit, 10)
    page = parseInt(page, 10)
    if (page < 1) {
        page = 1
    }

    const query = {}
    if (author) {
        query.author = author
    }

    Task.find(query)
        .sort({[sortFiels]: asc === 'desc' ? -1 : 1})
        .limit(limit, 10)
        .skip((page - 1) * limit)
        .then(tasks => {
            res.send(tasks)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tasks"
            })
        })
}

exports.create = ({ body }, res) => {
    if (!body.title || !body.author) {
        return res.status(400).send({
            message: "Check the data and try again"
        })
    }

    User.findById(body.author)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: `Author not found with id ${body.author}`
                })            
            }
            const task = new Task({
                title: body.title,
                description: body.description,
                dueDate: body.dueDate,
                priority: body.priority,
                author: user,
            })
        
            task.save()
                .then(data => {
                    res.send(data)
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Task"
                    })
                })
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: `Author not found with id ${body.author}`
                })                
            }
            return res.status(500).send({
                message: "Error adding task"
            })
        })
}

exports.update = ({ body, params: { id } }, res) => {
    Task.findByIdAndUpdate(id, {
            title: body.title,
            description: body.description,
            dueDate: body.dueDate,
        }, { new: true })
        .then(note => {
            if(!note) {
                return res.status(404).send({
                    message: `Task not found with id ${id}`
                })
            }
            res.send(note)
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: `Task not found with id ${id}`
                })                
            }
            return res.status(500).send({
                message: `Error updating task with id ${id}`
            })
        })
}

exports.delete = ({ params: { id } }, res) => {
    Task.findByIdAndRemove(id)
        .then(task => {
            if(!task) {
                return res.status(404).send({
                    message: `Task not found with id ${id}`
                })
            }
            res.send({message: "Task deleted successfully"})
        }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: `Task not found with id ${id}`
                })                
            }
            return res.status(500).send({
                message: `Could not delete task with id ${id}`
            })
        })
}