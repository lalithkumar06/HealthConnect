const mongoose = require('mongoose');
const URL = process.env.URL;
require('dotenv').config(); 
mongoose.connect(URL)
    .then(()=>{
        console.log("connected to data base");
    }).catch((err)=>{
      console.log("Mongo Db error",err);
    })