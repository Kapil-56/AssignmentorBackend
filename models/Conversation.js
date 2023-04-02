const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    postId: {
      type: ObjectId,
      ref: "post",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);

// mongoose.model("Conversation", ConversationSchema)
