const jwt = require("jsonwebtoken")
const { secret } = require('../../config/app.config.js')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, secret)
        next()
    } catch (error) {
        res.status(401).json({ message: "Authentication failed!" })
    }
}