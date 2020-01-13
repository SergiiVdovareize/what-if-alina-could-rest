module.exports = (app) => {
    const auth = require('../controllers/auth.controller.js')
    app.post('/signup', auth.signup)
    app.get('/signin', auth.signin)
}
