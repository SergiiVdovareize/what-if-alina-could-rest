const express = require('express')
const { urlencoded, json } = require('body-parser')
const PORT = process.env.PORT || 5000

const app = express()

app.use(urlencoded({ extended: true }))

app.use(json())

const dbConfig = require('./config/database.config.js')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGODB_URI || dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database")    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err)
    process.exit()
})

app.get('/', (req, res) => {
    res.json({"message": "Hello. Is it me you're looking for?"})
})

require('./app/routes/auth.routes.js')(app)
require('./app/routes/task.routes.js')(app)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})