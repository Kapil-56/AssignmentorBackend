const express = require('express');
const {generateimage} = require('./Controller')
const router = express.Router()

router.post('/generateimage',generateimage)

module.exports = router