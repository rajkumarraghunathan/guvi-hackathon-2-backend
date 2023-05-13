const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const router = require('./Route/route');
const db = require('./Connect/connect');


//app connection
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors())
//DB connect
db();



const Portal = 5000;

app.get('/hi', (req, res) => {
    res.send('Hello World');
})

app.use(router)

app.listen(Portal, () => {
    console.log(`App is runing in a portal ${Portal}`);
})