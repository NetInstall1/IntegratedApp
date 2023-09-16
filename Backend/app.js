const express = require('express')
const bodyParser = require('body-parser')
const {EventEmitter} = require('events')
const app = express()
const port = 3000 | process.env.port

const eventEmitter = new EventEmitter()

app.get('/scan',(req, res)=>{
    eventEmitter.emit('agentScan')
    res.json({
        status: "success"
    })
}) 

app.get('/agent-do',(req, res)=>{
    console.log("/agent-do request recieved")
    eventEmitter.once('agentScan',()=>{
        res.json({
            work:"scan"
        })
    })
    
})
app.listen(port, ()=>{
    console.log(`Listening at port ${port}`)
})