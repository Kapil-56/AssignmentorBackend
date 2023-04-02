const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    deadline: {
        type: Date,
        require: true
    }
    ,
    likes: [
        {
            type: ObjectId,
            ref: "user",
        }
    ],
    price: {
        type: Number,
        require: true
    },
    postedBy: {
        type: ObjectId,
        ref: "user",
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true })

mongoose.model("post", postSchema)