const express = require('express')
const app = express()
const dotdev = require('dotenv').config()
// const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const connectDB = require('./config/dbConnection.js')
// const multer = require('multer')
const route = require('./routes/route.js')
const {errorHandler} = require('./middleware/errorHanlder.js')

connectDB();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use(multer.any())
// mongoose.set('strictQuery', false)

app.use('/', route)

app.use('/*', (req,res) => {
    res.status(400).send({status:true, message:"invalid endpoints"})
})
app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Your server is working on http://localhost:${PORT}`)
})

