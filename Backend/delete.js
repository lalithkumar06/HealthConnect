const express= require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userModel = require('./Models/User')

const URL = process.env.URL;
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function deleteAllDocuments() {
  try {
    await userModel.deleteMany({type : "User"});
    console.log("All documents deleted from the Medicine collection.");
  } catch (error) {
    console.error("Error deleting documents:", error);
  } finally {
    mongoose.disconnect();
  }
}

deleteAllDocuments();
