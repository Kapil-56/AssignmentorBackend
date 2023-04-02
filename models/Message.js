const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const MessageSchema = new mongoose.Schema({
   conversationId: {
      type: String
   },
   senderId: {
      type: String
   },
   text: {
      type: String
   },
   readFlag: {
      type: Boolean,
      default:false,
   }
}, { timestamps: true })

// mongoose.model("Message", MessageSchema)
module.exports = mongoose.model('Message', MessageSchema);
