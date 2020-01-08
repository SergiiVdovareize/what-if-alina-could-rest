const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require('../models/user.model.js')
const { secret } = require('../../config/app.config.js')

exports.signup = ({body}, res) => {
    if(!body.email || !body.password) {
        return res.status(400).send({
            message: "Check the data"
        })
    }

    User.findOne({
        email: body.email
    }).then(user => {
        if (user) {
            res.status(500).send({
                message: "User with such email already exists"
            }) 
        } else {
            bcrypt.hash(body.password, 10).then((hash) => {
                const user = new User({
                    firstName: body.fname,
                    lastName: body.lname,
                    email: body.email,
                    password: hash
                });
        
                user.save()
                    .then(data => {
                        res.send(data)
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the User"
                        })
                    })
            })
        }
    })
}

exports.signin = ({ body: { email, password } }, res) => {
    let getUser
    User.findOne({
        email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            })
        }
        getUser = user
        return bcrypt.compare(password, user.password)
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Authentication failed"
            })
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, secret, {
            expiresIn: "10m"
        })
        res.status(200).json({
            token: jwtToken,
            expiresIn: 10 * 60,
        })
    }).catch(err => {
        return res.status(401).json({
            message: "Authentication failed"
        })
    })
}