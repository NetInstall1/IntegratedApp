const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
// const Agent = require('../models/agent')
const Agent = mongoose.model('Agent')


const getUserId = asyncHandler(async (agent_id)=>{
    const user = await Agent.findById(agent_id)
    if(!user){
        throw new Error('Agent has no user_id')
    }
    return user.user_id
})


const usersAgent = asyncHandler(async (req, res)=>{
    const {_id} = req.user;
    console.log(req.user)
    const agents = await Agent.find({user_id:_id})

    if(!agents){
        throw new Error(`Error getting user's agents`)
    }
    res.json(agents)
})


const createAgent = asyncHandler(async (req, res)=>{
    console.log(req.body)
    const { agent_name, guest_user, guest_pass, ip_range} = req.body
    const user_id = req.user
    console.log(agent_name, guest_user, guest_pass, user_id)

    if(!ip_range || !agent_name || !guest_user || !guest_pass){
        return res.status(400).json({ error: 'Some information is missing' });
    }
    const agent_name_unique = await Agent.find({agent_name})
    console.log(agent_name_unique)
    if(agent_name_unique){
        return res.status(400).json({ error: 'Agent with this name already exists' });
    }

    await Agent.create({
        agent_name,
        guest_pass,
        guest_user,
        user_id
    })

    res.json({
        message:`Agent created!!`
    })

})

const updateAgent = asyncHandler(async (req, res)=>{
    const {_id} = req.body
    const agent = await Agent.findById(_id)

})

const deleteAgent = asyncHandler(async(req, res)=>{
    const {_id} = req.body
    const agent = await Agent.findByIdAndDelete(_id)
    if(agent){
        res.json({
            message:`Agent deleted`
        })
    }
    throw new Error('Error deleting Agent')
})


module.exports = {
    createAgent,
    updateAgent,
    deleteAgent,
    usersAgent,
    getUserId
}