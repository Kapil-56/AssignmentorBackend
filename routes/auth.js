const express = require('express');
const router = express.Router()
const { default: mongoose } = require('mongoose');
const User = mongoose.model('user')
const Post = mongoose.model('post')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "Kashish@2005"
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });






router.post('/signup', csrfProtection, (req, res) => {
    const { email, name, password, avatar } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Enter all the fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User with the email exists" });
            }
            bcrypt.hash(password, 12)
                .then(secPass => {
                    const user = new User({
                        email,
                        name,
                        password: secPass,
                        avatar
                    });
                    if (!avatar) {
                        return res.send({ savedUser });
                    }
                    user.save()
                        .then(user => res.send({ message: "user saved successfully" }))
                        .catch(err => res.send(err));
                });
        })
        .catch(err => { console.log(err) });
});





router.post('/login', csrfProtection, (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json("Enter all the fields")
    }
    User.findOne({ email: email })
        .then(Exists => {
            if (!Exists) {
                return res.status(422).json({ error: "Incorrect email or password" })
            }
            bcrypt.compare(password, Exists.password)

                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: Exists._id }, JWT_SECRET)
                        const { _id, name, email, avatar } = Exists
                        // res.cookie("jwt", token, {
                        //     expires: new Date(Date.now() + 25982000000),
                        //     httpOnly: true
                        // })
                        res.json({ token, user: { name, _id, email, avatar } })
                    }
                    else { res.status(422).json({ error: "Incorrect email or password" }) }
                })
                .catch(err => console.log(err))
        })
})


router.get('/myliked', fetchuser, (req, res) => {
    try {
        Post.find({ "likes": req.user._id })
            .select('_id')
            .then(myLiked => {
                const likedIds = myLiked.map(post => post._id)
                res.json(likedIds)
            })
            .catch(err => {
                res.status(401).json({ err })
            })
    }
    catch (error) {
        return res.json({ error })
    }
})



router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    User.findById(userId)
        .select('-password')
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});


module.exports = router