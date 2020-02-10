const Task = require('../models/task.model.js')
const User = require('../models/user.model.js')

/**
 * @api {get} /tasks Get task list
 * @apiGroup Tasks
 * @apiName Task list
 * @apiVersion 0.1.0
 * 
 * @apiParam {String=title,description,dueDate,priority} [sort] Field to sort by
 * @apiParam {String=asc,desc} [asc=asc] Sorting direction
 * @apiParam {Number} [limit=10] Items per page
 * @apiParam {Number} [page=1] Page number
 * @apiParam {ObjectId} [author] Author's id to filter by
 */
exports.index = async ({query: {sort, asc, limit = 10, page = 1, author}}, res) => {
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

    try {
        const tasks = await Task.find(query)
            .sort({[sortField]: asc === 'desc' ? -1 : 1})
            .limit(limit, 10)
            .skip((page - 1) * limit)
        res.send(tasks)
    } catch (err) {
        res.status(500).json( {message: err.message } )
    }
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
 * @apiParam {String=low,normal,high} [priority=normal] Task priority
 */
exports.create = async ({ body }, res) => {
    if (!body.title || !body.author) {
        return res.status(400).send({
            message: "Check the data and try again"
        })
    }

    try {
        const user = await User.findById(body.author)
        if(!user) {
            return res.status(400).send({
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
    
        const newTask = await task.save()
        res.status(201).json(newTask)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
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
 * @apiParam {String} [priority] Task priority
 */
exports.update = async ({ body }, res ) => {
    const task = res.task
    task.title = body.title
    task.description = body.description
    task.dueDate = body.dueDate
    
    try {
        const updatedTask = await task.save()
        res.json(updatedTask)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

/**
 * @api {delete} /tasks/:id Delete existing task
 * @apiGroup Tasks
 * @apiName Delete task
 * @apiVersion 0.1.0
 * @apiPermission authorized user
 * 
 * @apiParam {ObjectId} id Task ID
 */
exports.delete = async (req, res) => {
    try {
        await res.task.remove()
        res.json({ message: 'Task deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
