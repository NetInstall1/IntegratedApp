const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const HOST = mongoose.model('HOST')
const { EventEmitter } = require('events')

const eventEmitter = new EventEmitter()

router.get('/api/agent-do', (req, res) => {
    console.log("/agent-do request recieved")
    eventEmitter.once('agentScan', () => {
        res.json({
            work: "scan"
        })
    })

})

router.get('/api/scan', async(req, res) => {
    console.log("scan initiated")
    eventEmitter.emit('agentScan')
    const hostData = await HOST.find()
    res.json(hostData)
    
})

router.get('/api/hostInfo',(req, res)=>{
    HOST.find()
    .then((result)=>{
        res.json(result)
    })
    .catch((err)=>{
        console.log("cannot get the hostsinfo"+err)
        res.json({status:"Error"})
    })
})

router.post('/scan_result', async(req, res) => {
    console.log('scan result')
    console.log("body:", req.body)
    try{
        const hostData = req.body
        const insertedData = await HOST.insertMany(hostData)
        // res.status(201).json({ status: 'successful', insertedHosts });
        res.end()
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: "Error saving data"})
    }
    
})
module.exports = router