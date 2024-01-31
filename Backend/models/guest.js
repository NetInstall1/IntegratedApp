const mongoose = require('mongoose')

const guestSchema = new mongoose.Schema({
    hostname: String,
    ip_address: String,
    mac_address: String,
    status: String,
    os:String,
    action: {type: String},
    details:{type: mongoose.Schema.Types.Mixed},
    agent_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Agent'},
    installed_software:[{type: mongoose.Schema.Types.ObjectId, ref: 'Software'}]
})

const Guest = mongoose.model('Guest', guestSchema)
module.exports = Guest