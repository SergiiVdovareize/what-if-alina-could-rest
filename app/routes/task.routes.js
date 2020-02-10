module.exports = (app) => {
    const tasks = require('../controllers/task.controller.js')
    const auth = require('../middlewares/auth.middleware.js')
    const getTask = require('../middlewares/tasks.middleware.js').getTask
    
    app.post('/tasks', auth, tasks.create)
    app.get('/tasks', tasks.index)
    app.put('/tasks/:id', [auth, getTask], tasks.update)
    app.delete('/tasks/:id', [auth, getTask], tasks.delete)
}
