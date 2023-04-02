const express = require('express');
const router = express.Router()
const { default: mongoose } = require('mongoose');
const fetchuser = require('../middleware/fetchuser');
const Conversation = require("../models/Conversation")
const Message = require("../models/Message")


//new conversation
// router.post('/conversation', async (req, res) => {
//     const newConversation = new Conversation({
//         members: [req.body.senderId, req.body.recieverId]
//     })
//     try {
//         const savedConversation = await newConversation.save();
//         res.status(201).json(savedConversation)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })


//get conversation of a user
router.get("/conversation/:userId", fetchuser, async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        })
        res.status(200).json(conversation)
    } catch (error) {
        res.status(500).json(error)
    }
})


//of 2 users

router.get("/conversation/:senderId/:receiverId", fetchuser, async (req, res) => {
    try {
        // Look for a conversation between the sender and receiver
        const conversation = await Conversation.find({
            members: { $all: [req.params.senderId, req.params.receiverId] }
        });

        if (!conversation) {
            return res.status(404).json({ error: "No conversation found" });
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error);
    }
});




//delete conversation
router.delete("/conversation/:conversationId", fetchuser, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.conversationId);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // Delete all messages associated with the conversation
        await Message.deleteMany({ conversationId: conversation._id });

        // Delete the conversation itself
        await conversation.remove();

        res.status(200).json({ message: "Conversation and messages deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});






module.exports = router