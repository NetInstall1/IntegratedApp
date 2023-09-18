const express = require('express')
const bodyParser = require('body-parser')
const {EventEmitter} = require('events')
const app = express()
app.use(bodyParser.json())
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

app.post('/scan_result', (req, res)=> {
    console.log('scan result')
    console.log(req)
    console.log("body:", req.body)
    res.json({status: "successful"})
})
app.listen(port, ()=>{
    console.log(`Listening at port ${port}`)
})