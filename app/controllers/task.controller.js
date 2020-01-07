const Task = require('../models/task.model.js')
const User = require('../models/user.model.js')

exports.create = ({ body }, res) => {
    if(!body.title || !body.author) {
        return res.status(400).send({
            message: "Check the data"
        })
    }

    User.findById(body.author)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "Author not found with id " + body.author
                });            
            }
            const task = new Task({
                title: body.title,
                description: body.description,
                author: user,
            })
        
            task.save()
                .then(data => {
                    res.send(data);
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Task."
                    })
                })
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Author not found with id " + body.author
                });                
            }
            return res.status(500).send({
                message: "Error adding task"
            });
        });
}
