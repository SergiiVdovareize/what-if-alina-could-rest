require('dotenv').config()
const express = require('express')
const { urlencoded, json } = require('body-parser')

const app = express()
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(express.static('docs'))

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
const mongoConnection = mongoose.connection
mongoConnection.on('error', error => console.log(error))
mongoConnection.once('open', () => console.log('connected to the database'))


app.get('/', (req, res) => {
    res.render('./docs/index.html')
})

require('./app/routes/auth.routes.js')(app)
require('./app/routes/task.routes.js')(app)

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})