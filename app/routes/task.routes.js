module.exports = (app) => {
    const tasks = require('../controllers/task.controller.js')
    
    app.post('/tasks', tasks.create)
    app.get('/tasks', tasks.index)
    app.put('/tasks/:id', tasks.update)
    app.delete('/tasks/:id', tasks.delete)
}
