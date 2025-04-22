const bcrypt = require("bcryptjs");
const UserModel = require("../Models/User");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    const type = "student";
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      type,
    });
    await newUser.save();

    const jwttoken = jwt.sign(
      { name: newUser.name, email: newUser.email, _id: newUser._id, type },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Signup successful",
      success: true,
      jwttoken,
      email: newUser.email,
      name: newUser.name,
      type,
      _id: newUser._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
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
      {  name: user.name , email: user.email , _id : user._id, type : user.type},
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
        type :user.type
      });
  } catch (err) {
    return res
      .status(400)
      .json({ message: " internal server error", success: false });
  }
};
module.exports = { signup, login };
