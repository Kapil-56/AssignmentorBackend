const jwt = require('jsonwebtoken')
const JWT_SECRET = "Kashish@2005";
const mongoose = require('mongoose');
const User = mongoose.model('user')
// var cookies = require("cookie-parser");


const fetchuser = (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  // const token = req.header('auth-token')
  const token = req.cookies.jwt

  if (!token) {
    return res.status(401).send({ error: "Pleasee authenticate using a valid token" })

  }
  else {
    try {
      const data = jwt.verify(token, JWT_SECRET);
      // req.user = data._id;
      // console.log(req.user);
      User.findById(data._id)
        .then(UserData => {
          req.user = UserData
          next();
        })
    } catch (error) {
      res.status(401).send({ error: "Please authenticate using a valid token" })
    }
  }
}
module.exports = fetchuser;