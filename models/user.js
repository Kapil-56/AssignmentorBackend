const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    Myliked: [
        {
            type: ObjectId,
            ref: "post",
        }
    ],
    password: {
        type: String,
        required: true,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: "",
    },
    socketId: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// mongoose.model("user", userSchema)

module.exports = mongoose.model('user', userSchema);

