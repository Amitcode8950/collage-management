const express = require('express')

const app = express()

app.post('/',(req,res)=>{
    res.send('hello world')
})


module.exports = app
