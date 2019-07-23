if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const router = require('./routes')
const errHandler = require('./middlewares/errHandler')
const port = process.env.PORT
const app = express()

if (process.env.NODE_ENV === 'development') {
    mongoose.connect(`${process.env.DB_SERVER}`, {
        useNewUrlParser: true
    }, (err) => {
        if (err) console.log(err), console.log(`Can't connect to mongoose server.`);
        else console.log(`Mongoose connect success`)
    })
} else if (process.env.NODE_ENV === 'production') {
    mongoose.connect(`${process.env.DB_SERVER_ATLAS}`, {
        useNewUrlParser: true
    }, (err) => {
        if (err) console.log(err), console.log(`Can't connect to mongoose server.`);
        else console.log(`Mongoose connect success`)
    })
}
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(morgan('tiny'))

app.use('/', router)
app.use('/', errHandler)

app.listen(port, () => {
    console.log(`Connected to port: ${port} !!!`)
})