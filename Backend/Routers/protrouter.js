const express = require("express");
const router = express.Router();
const ensureAuth = require("../Middleware/Auth");
const visitHistoryModel = require("../Models/VisitHisotry");
const queryModel = require("../Models/Query");
const slotModel = require("../Models/Slots");
const medicineModel = require("../Models/Medicine");
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

router.get("/available-medicines" , ensureAuth , async(req, res)=>{
  try{
    
  const medicines = await medicineModel.find({});
  res.status(200).json({message : "medicines fetched successfully" , medicines , success : true});
  }catch(err){
    res.status(400).json({message : "Error fetching medicnes" , success : false})
  }

})


router.post("getslots", ensureAuth, async(req,res )=>{
  try{
    const doctor = req.body;
    const result = slotModel.findOne({doctor});
    res.status(200).json({message : "Fetched successfully " , success : true , slots : result})

  }catch(err){
    res.status(500).json({message : "Internal Server Error" , success : false})
  }
})

router.post("/bookslot" , ensureAuth , async(req, res)=>{
  try {
    const { slotTime, doctor, meetingType } = req.body;
    const time = new Date(slotTime);
    const currentTime = new Date();
    if (currentTime > time) {
      res.status(400).json({ message: "Slot time expired", success: false });
    }
    const result = await SlotModel.findOneAndUpdate(
      { doctor: doctor, "slot.time": slotTime },
      {
        $set: {
          "slot.$.status": "booked",
          "slot.$.meetingType": meetingType,
        },
      },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "Slot not found", success: false });
    }

    res
      .status(200)
      .json({
        message: "Slot booked successfully",
        data: result,
        success: true,
      });
  } catch (err) {
    console.error("Error booking slot:", err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
})

module.exports = router;
