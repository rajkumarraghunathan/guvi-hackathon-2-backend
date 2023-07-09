const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const router = require('./Route/route');
const userRoutes = require('./Route/userRoutes')
const db = require('./Connect/connect');



//app connection
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))
app.use(cookieParser());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
});


//DB connect
db();



const Portal = 5000;

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.use(router)
app.use(userRoutes)

app.listen(Portal, () => {
    console.log(`App is runing in a portal ${Portal}`);
})