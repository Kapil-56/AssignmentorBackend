const express = require('express');
const router = express.Router()
const { default: mongoose } = require('mongoose');
const fetchuser = require('../middleware/fetchuser');
const Post = mongoose.model('post')
const User = mongoose.model('user')

router.get('/posts/:id',(req,res)=>{
    Post.findOne({_id:req.params.id})
    .populate("postedBy" ,"-password -email")
    // .select('-password')
    .then(post=>{
        res.json({post}.post)    
    }).catch(err=>{
        return res.status(404).json({err})
    })
})




module.exports = router