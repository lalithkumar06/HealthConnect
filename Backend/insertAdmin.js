const UserModel = require('./Models/User')
const mongoose = require('mongoose');
require('dotenv').config();
const URL = process.env.URL;
const bcrypt = require('bcrypt');
mongoose.connect(URL, { useUnifiedTopology: true });
const userData = [
  {
    name: "Dr. Ramesh Kumar",
    email: "ramesh.kumar@gmail.com",
    password: "123456",
    type: "Admin",
  },
  {
    name: "Dr. Arvind Desai",
    email: "arvind.desai@gmail.com",
    password: "234567",
    type: "Admin",
  },
  {
    name: "Dr. Manish Verma",
    email: "manish.verma@gmail.com",
    password: "345678",
    type: "Admin",
  },
  {
    name: "Dr. Suresh Iyer",
    email: "suresh.iyer@gmail.com",
    password: "456789",
    type: "Admin",
  },
  {
    name: "Dr. Anjali Verma",
    email: "anjali.verma@gmail.com",
    password: "567890",
    type: "Admin",
  },
  {
    name: "Dr. Priya Nair",
    email: "priya.nair@gmail.com",
    password: "678901",
    type: "Admin",
  },
];

const attendantUsers = [
  {
    name: "Amit Sharma",
    email: "amitsharma@gmail.com",
    password: "123456",
    type: "User",
  },
  {
    name: "Sneha Patil",
    email: "snehapatil@gmail.com",
    password: "234567",
    type: "User",
  },
  {
    name: "Rahul Mehta",
    email: "rahulmehta@gmail.com",
    password: "345678",
    type: "User",
  },
  {
    name: "Divya Kapoor",
    email: "divyakapoor@gmail.com",
    password: "456789",
    type: "User",
  },
];


userData.map(async(user)=>{
  const hashpass = await bcrypt.hash(user.password , 10);
    const newUser = new UserModel({name : user.name , email  : 
      user.email , password : hashpass , type : user.type})
   await  newUser.save();
})

attendantUsers.map(async (user) => {
  const hashpass = await bcrypt.hash(user.password, 10);
  const newUser = new UserModel({
    name: user.name,
    email: user.email,
    password: hashpass,
    type: user.type,
  });
  await newUser.save();
});