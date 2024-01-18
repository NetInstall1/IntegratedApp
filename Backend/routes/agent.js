const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const GUEST = require('../models/guest')
const AGENT = mongoose.model('Agent')
const USER = mongoose.model('User')
const protect = require('../middleware/authMiddleware')
const {
    createAgent, updateAgent, usersAgent
} = require('../controllers/agentControllers')

router.post('/create', protect, createAgent)
router.post('/update', protect, updateAgent)
router.get('/get-my-agents', protect, usersAgent)


router.get('/api/all-agent', (req, res) => {
    const user_id = req.body.user_id

    try {
        const agent_list = USER.findById(
            user_id,
        ).populate('agent_list')
            .exec((err, user) => {
                if (err) {
                    // Handle any errors here
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json(agent_list);
            });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while getting agents' })
    }

})



router.post('/api/deploy', (req, res)=>{
    const deploy_info = req.body
    console.log(deploy_info)
})
module.exports = router