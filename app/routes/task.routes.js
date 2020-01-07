module.exports = (app) => {
    const tasks = require('../controllers/task.controller.js')
    app.post('/tasks', tasks.create)
}
