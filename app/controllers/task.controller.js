const Task = require('../models/task.model.js')
const User = require('../models/user.model.js')

/**
 * @api {get} /tasks Get task list
 * @apiGroup Tasks
 * @apiName Task list
 * @apiVersion 0.1.0
 * 
 * @apiParam {String} [sort] Field to sort by (title, description, dueDate, priority)
 * @apiParam {String} [asc=asc] Sorting direction (asc, desc)
 * @apiParam {Number} [limit=10] Items per page
 * @apiParam {Number} [page=1] Page number
 * @apiParam {ObjectId} [author] Author's id to filter by
 */
exports.index = ({query: {sort, asc, limit = 10, page = 1, author}}, res) => {
    const sortField = sort || 'title'
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
        .sort({[sortField]: asc === 'desc' ? -1 : 1})
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

/**
 * @api {post} /tasks Create new task
 * @apiGroup Tasks
 * @apiName New task
 * @apiVersion 0.1.0
 * @apiPermission authorized user
 * 
 * @apiParam {String} title Task title
 * @apiParam {String} [description] Task description
 * @apiParam {Date} [dueDate] Task due date
 * @apiParam {String} [proiroty=normal] Task prority (low, normal, high)
 */
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

/**
 * @api {put} /tasks/:id Update existing task
 * @apiGroup Tasks
 * @apiName Update task
 * @apiVersion 0.1.0
 * @apiPermission authorized user
 * 
 * @apiParam {ObjectId} id Task ID
 * @apiParam {String} title Task title
 * @apiParam {String} [description] Task description
 * @apiParam {Date} [dueDate] Task due date
 * @apiParam {String} [proiroty] Task prority (low, normal, high)
 */
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

/**
 * @api {delete} /tasks/:id Delete existing task
 * @apiGroup Tasks
 * @apiName Detele task
 * @apiVersion 0.1.0
 * @apiPermission authorized user
 * 
 * @apiParam {ObjectId} id Task ID
 */
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
