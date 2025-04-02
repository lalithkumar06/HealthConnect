const express = require("express");
const router = express.Router();
const ensureAuth = require("../Middleware/Auth");
const visitHistoryModel = require("../Models/VisitHisotry");
const queryModel = require("../Models/Query");
router.get("/home", ensureAuth, (req, res) => {
  res.status(200).json({ message: "Welcome to Dashboard", user: req.user });
});

router.post("/visitHistory", ensureAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.email) {
      return res.status(400).json({ error: "User email not provided" });
    }

    const history = await visitHistoryModel.findOne({ email: user.email });

    if (!history) {
      return res.status(404).json({ error: "No visit history found" });
    }

    res.json({ history });
  } catch (error) {
    console.error("Error fetching visit history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/submitquery", ensureAuth, async (req, res) => {
  const querydetails = req.body;
  try {
    const newQuery = new queryModel({
      name: querydetails.name,
      email: querydetails.email,
      query: querydetails.query,
    });
    await newQuery.save();
    res.status(200).json({message : "query posted successfuly"});
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error posting the query" });
  }
});

router.get("/settings", ensureAuth, (req, res) => {
  res.status(200).json({ message: "User Settings", user: req.user });
});

module.exports = router;
