const mongoose = require('mongoose')

const agentSchema = mongoose.Schema({
    agent_name:{
        type: String,
        required: true
    },
    hostname: String,
    ip_address: {
        type: String,
    },
    mac_address: String,
    status: String,
    os:String,
    
    guest_user: {
        type: String,
        required: true
    },
    guest_pass: {
        type: String,
        required: true
    },
    ip_range: {
        type: String,
        // required: true
    },
    
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    
})

const Agent = mongoose.model('Agent', agentSchema)
module.exports = Agent