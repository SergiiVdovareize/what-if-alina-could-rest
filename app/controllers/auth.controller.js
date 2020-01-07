const crypto = require("crypto")
const User = require('../models/user.model.js')

exports.signup = (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Check the data"
        })
    }

    const salt = crypto.randomBytes(16).toString('base64')
    const hash = crypto.createHmac('sha512',salt)
                                    .update(req.body.password)
                                    .digest("base64")
                                    
    const user = new User({
        firstName: req.body.fname,
        lastName: req.body.lname, 
        email: req.body.email, 
        password: salt + "$" + hash
    })

    user.save()
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            })
        })
}
