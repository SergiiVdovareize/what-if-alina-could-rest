const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require('../models/user.model.js')

/**
 * @api {post} /signup New user registration
 * @apiGroup Auth
 * @apiName Signup
 * @apiVersion 0.1.0
 * 
 * @apiParam {String} [fname] User's first name
 * @apiParam {String} [lname] User's last name
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 */
exports.signup = async ({ body }, res) => {
    if(!body.email || !body.password) {
        return res.status(400).send({
            message: "Check the data"
        })
    }

    try {
        let user = await User.findOne({ email: body.email })
        if (user) {
            return res.status(409).send({ message: "User with such email already exists" })
        }

        user = new User({
            firstName: body.fname,
            lastName: body.lname,
            email: body.email,
            password: await bcrypt.hash(body.password, 10)
        });
    
        const newUser = await user.save()
        res.status(200).json({
            token: generateToken(newUser),
            expiresIn: process.env.TOKEN_EXPIRATION
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

/**
 * @api {get} /signin Log in
 * @apiGroup Auth
 * @apiName Signin
 * @apiVersion 0.1.0
 * 
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 */
exports.signin = async ({ body: { email, password } }, res) => {
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).send({ message: `User not found` })            
        }

        const authCheck = await bcrypt.compare(password, user.password)
        if (!authCheck) {
            return res.status(401).json({ message: "Authentication failed" })
        }

        res.status(200).json({
            token: generateToken(user),
            expiresIn: parseInt(process.env.TOKEN_EXPIRATION, 10)
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const generateToken = ({ _id: id, email }) => {
    return jwt.sign({ email, id }, 
        process.env.AUTH_SECRET, 
        { expiresIn: parseInt(process.env.TOKEN_EXPIRATION, 10) })
}