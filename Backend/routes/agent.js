const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const AGENT = mongoose.model('AGENT')
const USER = mongoose.model('USER')

router.post('/api/create-agent', async (req, res) => {
    try {
        console.log(req.body)
        const Agent = req.body
        const newAgent = new AGENT(Agent)
        await newAgent.save()
        res.status(201).json({ message: 'Agent created successfully', agent: newAgent });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' })
    }
})


let disconnectFlag = false;

router.post('/api/agent-disconnect', (req, res) => {
    disconnectFlag = true;
    console.log("Disconnect clicked")
    res.status(200).json({ message: 'Disconnect signal sent to agent.' });
});


router.get('/api/check-disconnect', (req, res) => {
    if (disconnectFlag) {
        // Reset the flag after sending it once
        disconnectFlag = false;
        res.json({ disconnect: true });
    } else {
        res.json({ disconnect: false });
    }
});



router.post('/api/update-agent', async (req, res) => {
    try {
        console.log(req.body)
        const { Agent_id, hostname, ip_address, mac_address, status, os } = req.body

        const agent = AGENT.findByIdAndUpdate(
            Agent_id,
            {
                hostname,
                ip_address,
                mac_address,
                status,
                os
            }
        )
        if (!agent) {
            return res.status(401).json({ error: `Can't update Agent` })
        }
        res.status(201).json({ message: 'Agent Updated successfully', agent: newAgent });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' })
    }
})

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

module.exports = router