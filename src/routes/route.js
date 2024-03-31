const express = require('express')
const {createUser, loginUser } =  require('../controllers/UserController')
const route = express.Router()

// User Auth
// route.get('/', (res,req) => {
//     return res.status(200).send("Home Page")
// })
route.get('/', async (req, res) => {
    return res.status(200).send({status:200, Message:"Home Page"})
})
route.post('/register', createUser)

module.exports = route