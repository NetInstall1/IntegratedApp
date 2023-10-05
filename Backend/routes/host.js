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

router.get('/api/scan', (req, res) => {
    console.log("scan initiated")
    eventEmitter.emit('agentScan')
    eventEmitter.once('scan_result',async ()=>{
        const hostData = await HOST.find()
        res.json(hostData)
    })
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
        await HOST.deleteMany({});
        const insertedHosts = await HOST.insertMany(hostData)
        eventEmitter.emit('scan_result')
        res.status(201).json({ status: 'successful', insertedHosts });
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: "Error saving data"})
    }
    
})

router.post('/api/agent-update-host/:host_ip', async(req, res)=>{
    const host_ip = req.params.host_ip
    const _action = req.body.action
    console.log(host_ip, _action)
    try{
        const updated_host = await HOST.findOneAndUpdate(
            { 'ip_address': host_ip }, 
            { $set: { 'action': _action } },
            { new: true }
          );
          console.log(`Updated host: ${updated_host}`)
        console.log(updated_host)
    }catch(err){
        console.log(`error updating the host:${err}`)
        res.json({update_status: "Error updating"})
    }
})
module.exports = router