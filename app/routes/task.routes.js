module.exports = (app) => {
    const tasks = require('../controllers/task.controller.js')
    const auth = require('../middlewares/auth.js')
    
    app.post('/tasks', auth, tasks.create)
    app.get('/tasks', tasks.index)
    app.put('/tasks/:id', auth, tasks.update)
    app.delete('/tasks/:id', auth, tasks.delete)
}
