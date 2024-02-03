const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const GUEST = mongoose.model('Guest')
const { EventEmitter } = require('events')

const eventEmitter = new EventEmitter()

router.get('/api/agent-do', (req, res) => {
    console.log("/agent-do request recieved")
    eventEmitter.once('agentScan', () => {
        res.json({
            work: "scan"
        })
    })

    eventEmitter.once('agentDeploy', (ip_address)=>{
        console.log(ip_address)
        res.json({
            work:"deploy",
            ip_address
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

router.post('/api/deploy', (req, res)=>{
    const deploy_info = req.body
    eventEmitter.emit('agentDeploy', deploy_info)
    // eventEmitter.once('scan_result',async ()=>{
    //     const guestData = await GUEST.find()
    //     res.json(guestData)
    // })
    res.end()
    console.log(deploy_info)
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
        const guestData = req.body.scan_result
        const agent_id = req.body.agent_id
        console.log(agent_id)
        console.log(guestData)

        const updatedGuestData = guestData?.map((guest)=>({...guest, agent_id}))
        console.log(updatedGuestData)
        await GUEST.deleteMany({});
        const insertedGuests = await GUEST.insertMany(updatedGuestData)
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
    const details = req.body.details
    console.log(req.body)
    try{
        const updated_guest = await GUEST.findOneAndUpdate(
            { 'ip_address': guest_ip }, 
            { $set: { 'action': _action , details: details }},
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


router.post('/api/guest-sys-info/:guest_ip', async(req, res)=>{
    var details = req.body

    // console.log(req.body)
    // details = JSON.stringify(details)
    console.log(details)
    const guest_ip = req.params.guest_ip
    try{
        const updated_guest = await GUEST.findOneAndUpdate(
            { 'ip_address': guest_ip }, 
            { $set:{details: details}},
            { new: true }
          );
        console.log(updated_guest)
        res.json({update_status: "successful updation", data: updated_guest})
    }catch(err){
        console.log(`error updating the guest:${err}`)
        res.json({update_status: "Error updating"})
    }
})


router.post('/api/delete_all_guests', async(req, res)=>{
    try{
        await GUEST.deleteMany({})
        res.status(200).json({
            "message":"All guests deleted successfully"
        })
    } catch (err) {
        res.status(500).json({
            "message":"Error ocurred while deleting guests"
        })
    }
})

router.get('/api/guests/:agent_id', async (req, res) => {
    try {
        const agent_id = req.params.agent_id;

        // Retrieve guests based on the specified agent_id
        const guests = await GUEST.find({ agent_id });
        console.log(guests)
        // Check if guests are found
        if (guests.length > 0) {
            res.json(guests);
        } else {
            res.json({ message: 'No guests found for the specified agent_id.' });
        }
    } catch (err) {
        console.error(`Error getting guests: ${err}`);
        res.status(500).json({ error: 'Error getting guests.' });
    }
});
module.exports = router