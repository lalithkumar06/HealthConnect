const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const authRouter = require('./Routers/authrouter');
const protrouter = require('./Routers/protrouter');
const cors = require('cors');
const PORT = process.env.PORT || 3000
require('./Models/database')

app.use(bodyParser());
app.use(cors());
app.use('/auth', authRouter);
//protected - routes
app.use('/protected', protrouter)
app.listen(PORT, ()=>{
    console.log(` server is active on ${PORT}`);
})