const express = require('express');
const connectToMongo = require('./db');
const cookieparser = require("cookie-parser")
const compression = require("compression");
const app = express()
const PORT = 5000
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });


app.use(express.json())
app.use(cookieparser())
app.use(csrfProtection);
app.use(compression());


connectToMongo()


require('./models/user')
require('./models/post')



app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/openai'))
// app.use(require('./routes/EnterPost'))
app.use(require('./routes/Conversation'))
app.use(require('./routes/Message'))

app.listen(PORT, () => {
    console.log("connected to port", PORT);
})