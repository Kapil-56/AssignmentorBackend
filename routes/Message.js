const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const fetchuser = require("../middleware/fetchuser");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

//add
// router.post("/messages", async (req, res) => {
//     const newMessage = new Message(req.body)

//     try {
//         const savedMessage = await newMessage.save();
//         res.status(200).json(savedMessage)
//     } catch (error) {
//         res.status(500).json(error)

//     }
// })

// router.post("/messages", fetchuser, async (req, res) => {
//     // Check if a conversation already exists between the sender and the receiver
//     const existingConversation = await Conversation.findOne({
//         members: { $all: [req.body.senderId, req.body.receiverId] }
//     });

//     let conversationId;
//     if (!existingConversation) {
//         // If no conversation exists, create a new one
//         const newConversation = new Conversation({
//             members: [req.body.senderId, req.body.receiverId]
//         });
//         const savedConversation = await newConversation.save();
//         conversationId = savedConversation._id;
//     } else {
//         conversationId = existingConversation._id;
//     }

//     // Create a new message
//     const newMessage = new Message({
//         ...req.body,
//         conversationId: conversationId
//     });

//     try {
//         const savedMessage = await newMessage.save();
//         res.status(200).json(savedMessage);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });

// router.post("/messages", fetchuser, csrfProtection, async (req, res) => {
//     // Check if a conversation already exists between the sender and the receiver
//     const existingConversation = await Conversation.findOne({
//         members: { $all: [req.body.senderId, req.body.receiverId] }
//     });

//     let conversationId;
//     if (!existingConversation) {
//         // If no conversation exists, create a new one
//         const newConversation = new Conversation({
//             members: [req.body.senderId, req.body.receiverId]
//         });
//         const savedConversation = await newConversation.save();
//         conversationId = savedConversation._id;
//     } else {
//         conversationId = existingConversation._id;

//         // Update the updatedAt field of the conversation to the current time
//         existingConversation.updatedAt = new Date();
//         await existingConversation.save();
//     }

//     // Create a new message
//     const newMessage = new Message({
//         ...req.body,
//         conversationId: conversationId
//     });

//     try {
//         const savedMessage = await newMessage.save();
//         res.status(200).json(savedMessage);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });

router.post("/messages", fetchuser, csrfProtection, async (req, res) => {
  try {
    const { senderId, receiverId, text, postId } = req.body;
    console.log(postId);
    // Check if a conversation already exists between the sender and the receiver
    let existingConversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
      postId,
    });

    let conversationId;
    if (!existingConversation) {
      // If no conversation exists, create a new one
      const newConversation = new Conversation({
        members: [senderId, receiverId],
        postId,
      });
      const savedConversation = await newConversation.save();
      conversationId = savedConversation._id;
    } else {
      conversationId = existingConversation._id;

      // Update the updatedAt field of the conversation to the current time
      existingConversation.updatedAt = new Date();
      await existingConversation.save();
    }

    // Create a new message
    const newMessage = new Message({
      conversationId,
      senderId,
      text,
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

//get all messages
router.get("/messages/:conversationId", fetchuser, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get the last message
router.get("/lastessage/:conversationId", fetchuser, async (req, res) => {
  try {
    const lastMessage = await Message.findOne({
      conversationId: req.params.conversationId,
    })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastMessage) {
      res
        .status(404)
        .json({ message: "No messages found for this conversation" });
    } else {
      res.status(200).json(lastMessage);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
