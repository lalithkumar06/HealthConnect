const express = require("express");
const router = express.Router();
const ensureAuth = require("../Middleware/Auth");
const visitHistoryModel = require("../Models/VisitHisotry");
const queryModel = require("../Models/Query");
const slotModel = require("../Models/Slots");
const medicineModel = require("../Models/Medicine");
const requestModel = require("../Models/RequestMedicine");

const cors = require("cors");

router.use(cors());
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
    res.status(200).json({ message: "query posted successfuly" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error posting the query" });
  }
});

router.get("/available-medicines", ensureAuth, async (req, res) => {
  try {
    const medicines = await medicineModel.find({});
    res
      .status(200)
      .json({
        message: "medicines fetched successfully",
        medicines,
        success: true,
      });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error fetching medicnes", success: false });
  }
});

router.post("/requestmedicine", ensureAuth, async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const user = req.user.name;

    if (!name || isNaN(Number(quantity))) {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid data" });
    }

    const newRequest = new requestModel({
      user,
      name,
      quantity: Number(quantity),
    });

    await newRequest.save();
    res
      .status(200)
      .json({ success: true, message: "Request sent successfully" });
  } catch (err) {
    console.error("Error in /requestmedicine:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post("/getslots", ensureAuth, async (req, res) => {
  try {
    const { selectedOption } = req.body;
    const result = await slotModel.findOne({ doctor: selectedOption });
    res
      .status(200)
      .json({ message: "Fetched successfully ", success: true, slots: result });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

router.post("/bookslot", ensureAuth, async (req, res) => {
  try {
    const { slotTime, doctor, meetingType } = req.body;
    const user = req.user;
    const now = new Date();

    // Convert "10:00 AM" → 24-hour Date object
    const cleaned = slotTime.replace(/\s+/g, "");
    const match = cleaned.match(/(\d{1,2}):(\d{2})(AM|PM)/i);

    if (!match) {
      return res
        .status(400)
        .json({ message: "Invalid slot time format", success: false });
    }

    let [_, hourStr, minuteStr, period] = match;
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (period.toUpperCase() === "AM" && hour === 12) hour = 0;

    const slotDateTime = new Date();
    slotDateTime.setHours(hour);
    slotDateTime.setMinutes(minute);
    slotDateTime.setSeconds(0);
    slotDateTime.setMilliseconds(0);

    if (now > slotDateTime) {
      return res
        .status(400)
        .json({ message: "Slot time expired", success: false });
    }

    const response = await slotModel.findOne({ doctor });
    for (let slot of response.slot) {
      if (
        slot.status === "booked" &&
        slot.id?.toString() === user._id.toString()
      ) {
        return res.status(409).json({
          message: "You already booked a slot",
          success: false,
        });
      }
    }

    const result = await slotModel.findOneAndUpdate(
      { doctor: doctor, "slot.time": slotTime },
      {
        $set: {
          "slot.$.status": "booked",
          "slot.$.meetingType": meetingType,
          "slot.$.id": user._id,
        },
      },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "Slot not found", success: false });
    }

    res.status(200).json({
      message: "Slot booked successfully",
      data: result,
      success: true,
    });
  } catch (err) {
    console.error("Error booking slot:", err);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});


router.post('/cancelslot', ensureAuth , async(req ,res)=>{
  try{
    const {slotTime , doctor} = req.body;
    const [hours, minutes] = slotTime.replace(/\s/g, "").split(":").map(Number);
    const user = req.user;
    const now = new Date();

    const slotDateTime = new Date(now);
    slotDateTime.setHours(hours);
    slotDateTime.setMinutes(minutes);
    slotDateTime.setSeconds(0);
    slotDateTime.setMilliseconds(0);
    const result = await slotModel.findOneAndUpdate(
      { doctor: doctor, "slot.time": slotTime },
      {
        $set: {
          "slot.$.status": "unbooked",
          "slot.$.meetingType": "none",
          "slot.$.id": "none",
        },
      },
      { new: true }
    );
    res.json({message : "cancelled successfully", success : true})
  }catch(err){
    res.status(400).json({message : "error cancelling the slot" , success : false , data : null})
  }
})

module.exports = router;
