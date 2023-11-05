const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const GUEST = mongoose.model('GUEST')
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
        const guestData = await GUEST.find()
        res.json(guestData)
    })
})

router.get('/api/guestInfo',(req, res)=>{
    GUEST.find()
    .then((result)=>{
        res.json(result)
    })
    .catch((err)=>{
        console.log("cannot get the guestsinfo"+err)
        res.json({status:"Error"})
    })
})

router.post('/scan_result', async(req, res) => {
    console.log('scan result')
    console.log("body:", req.body)
    try{
        const guestData = req.body
        await GUEST.deleteMany({});
        const insertedGuests = await GUEST.insertMany(guestData)
        eventEmitter.emit('scan_result')
        res.status(201).json({ status: 'successful', insertedGuests });
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: "Error saving data"})
    }
    
})

router.post('/api/agent-update-guest/:guest_ip', async(req, res)=>{
    const guest_ip = req.params.guest_ip
    const _action = req.body.action
    console.log(guest_ip, _action)
    try{
        const updated_guest = await GUEST.findOneAndUpdate(
            { 'ip_address': guest_ip }, 
            { $set: { 'action': _action } },
            { new: true }
          );
          console.log(`Updated guest: ${updated_guest}`)
        console.log(updated_guest)
        res.json({update_status: "successful updation"})
    }catch(err){
        console.log(`error updating the guest:${err}`)
        res.json({update_status: "Error updating"})
    }
})
module.exports = router