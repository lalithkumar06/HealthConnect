const bcrypt = require("bcrypt");
const UserModel = require("../Models/User");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "email already exists", success: false });
    }
    const type = "student";
    const userModel = new UserModel({ name, email, password , type});
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    const jwttoken = jwt.sign(
      { name : userModel.name ,email: userModel.email , _id : _id, type : "student"},
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: " singup successful",
      success: true,
      jwttoken: jwttoken,
      email: email,
      name: name,
      _id: user._id,
      
    });
  } catch (err) {
    return res
      .status(400)
      .json({ message: " internal server error", success: false });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "invalid email ", success: false });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res
        .status(400)
        .json({ message: "incorrect password ", success: false });
    }
    const jwttoken = jwt.sign(
      {  name: user.name , email: user.email , _id : user._id, type : "student"},
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res
      .status(200)
      .json({
        message: " login successful",
        success: true,
        jwttoken: jwttoken,
        name: user.name,
        email: email,
      });
  } catch (err) {
    return res
      .status(400)
      .json({ message: " internal server error", success: false });
  }
};
module.exports = { signup, login };
