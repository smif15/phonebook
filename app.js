const express = require('express')
const personRouter = require('./controllers/personController')
const logger = require('./utils/logger')
const config = require('./utils/config')
const mongo = require('mongoose')
const path = require('path')

const app = express()

const url = config.MONGO_URI
logger.log(`Connecting to ${url}`)

mongo.connect(url, { family: 4 })
    .then(() => {logger.log('connected to MongoDB')})
    .catch(err => {logger.error('error connecting to MongoDB : ', err.message)})

app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res, next) => {
    req.start = new Date().toDateString()
    next()
})

app.use((req, res, next) => {
    logger.log('Method:', req.method)
    logger.log('Path:  ', req.path)
    logger.log('Body:  ', req.body)
    logger.log('---')
    next()
})

//middleware json-parser: diletakkan di awal untuk mentransform body ke dalam json shg dapat digunakan
app.use(express.json())

//Memasukkan routing
app.use('/api/persons', personRouter)

//middleware path undefined : diletakkan setelah pendefinisian semua routes selesai
app.use((req, res) => {
    res.status(404).json({ message: 'unknown endpoint' })
})

//middleware menangani error : diletakkan di akhir
app.use((err, req, res, next ) => {

    if(err.name === 'CastError'){
        return res.status(400).send({ message : 'malformatted id' })
    }
    else if (err.name === 'ValidationError') {
        return res.status(400).send({ message : err.message })
    }
    // else {
    //     return res.status(400).send({ message : 'error in client side' })
    // }

    next(err)
})

module.exports = app