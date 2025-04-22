require("dotenv").config();
const express = require("express");
const router = express.Router();
const ensureAuth = require("../Middleware/Auth");
const visitHistoryModel = require("../Models/VisitHisotry");
const queryModel = require("../Models/Query");
const slotModel = require("../Models/Slots");
const medicineModel = require("../Models/Medicine");
const requestModel = require("../Models/RequestMedicine");
const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const {
  Types: { ObjectId },
} = require("mongoose");
const cors = require("cors");

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
    res.status(200).json({
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

router.post("/cancelslot", ensureAuth, async (req, res) => {
  try {
    const { slotTime, doctor } = req.body;
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
    res.json({ message: "cancelled successfully", success: true });
  } catch (err) {
    res.status(400).json({
      message: "error cancelling the slot",
      success: false,
      data: null,
    });
  }
});

router.get("/test", ensureAuth, (req, res) => {
  console.log("No issues");
  res.send({ mes: "Good" });
});

router.post("/getdoctorslots", ensureAuth, async (req, res) => {
  const doctor = req.user.name;
  try {
    const resp = await slotModel.findOne({ doctor });
    const slots = resp.slot;
    for (const slot of slots) {
      if (slot.status === "booked") {
        const user = await UserModel.findOne({ _id: slot.id });
        slot.student = user?.name || "Unknown";
      }
    }

    return res.status(200).json({ success: true, slots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/getmedicineRequest", async (req, res) => {
  try {
    const requests = await requestModel.find();
    res.status(200).json({
      message: "requests sent succcessfully",
      success: true,
      requests,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed to load request", success: false });
  }
});

router.post("/acceptrequest", (req, res) => {
  try {
    const { id } = req.body;
    requestModel
      .deleteOne({ _id: id })
      .then(() => {
        res.status(200).json({ message: "Processed Request", success: true });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Unable to accept request", success: false });
      });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Unable to process request", success: false });
  }
});

router.post("/rejectrequest", (req, res) => {
  try {
    const { id } = req.body;
    requestModel
      .deleteOne({ _id: id })
      .then(() => {
        res.status(200).json({ message: "Processed Request", success: true });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Unable to reject request", success: false });
      });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Unable to process request", success: false });
  }
});

router.get("/getQueries", async (req, res) => {
  try {
    const queries = await queryModel.find();
    res
      .status(200)
      .json({ message: "Success fetching queries", success: true, queries });
  } catch (err) {
    res.status(400).json({ message: "error fetching queries", success: false });
  }
});

//setting up nodemailer
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.log("Error sending email:", err);
  }
};

router.post("/sendReply", async (req, res) => {
  try {
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);
    const { id, replyText, email } = req.body;

    const objectId = new ObjectId(id);
    const result = await queryModel.deleteOne({ _id: objectId });
    await sendMail(
      email,
      "Health Connect is there for you",
      "hello",
      `
      <div><p>Hi student, ${replyText}</p></div>`
    );
    return res
      .status(200)
      .json({ message: "Reply Sent Successfully", success: true });
  } catch (err) {
    console.error("Error while deleting:", err);
    res.status(400).json({ message: "Error sending reply", success: false });
  }
});

router.post("/addmedicine", async (req, res) => {
  try {
    const { name, use, quantity, medicineCode } = req.body;
    const newMed = new medicineModel({
      name,
      use,
      quantity,
      medicineCode,
    });

    await newMed.save();
    res
      .status(200)
      .json({ message: "Successfully added medicine", success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error adding medicine", success: false });
  }
});

router.delete("/removemedicine", async (req, res) => {
  try {
    const { medicineCode } = req.body;

    const result = await medicineModel.deleteOne({ medicineCode });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Medicine not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Successfully removed medicine",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Error removing medicine",
      success: false,
    });
  }
});

router.put("/updatemedicine", async (req, res) => {
  try {
    const { medicineCode, quantity } = req.body;

    const updatedMedicine = await medicineModel.findOneAndUpdate(
      { medicineCode },
      { quantity },
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({
        message: "Medicine not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Successfully updated medicine quantity",
      success: true,
      medicine: updatedMedicine,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Error updating medicine",
      success: false,
    });
  }
});

function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
}

function isMeetingTimeValid(slotTime) {
  const slot24 = convertTo24Hour(slotTime);
  const [slotHour, slotMin] = slot24.split(":").map(Number);
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const slotTotal = slotHour * 60 + slotMin;

  return current >= slotTotal;
}
router.post("/join-meeting", async (req, res) => {
  try {
    const { userName, uid, type } = req.body;

    if (!userName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing user name" });
    }

    let roomName = "";
    let allowStart = false;

    if (type === "student") {
      const slot = await slotModel.findOne({ "slot.id": uid });
      if (!slot) {
        return res
          .status(404)
          .json({ success: false, message: "No slot found" });
      }

      const { time: slotTime, meetingType } = slot.slot;
      const doctor = slot.doctor;

      if (meetingType === "offline") {
        return res
          .status(200)
          .json({ success: false, message: "This meeting is offline" });
      }

      if (!isMeetingTimeValid(slotTime)) {
        return res
          .status(403)
          .json({ success: false, message: "Meeting time not started yet" });
      }
      const saltRounds = 10;
      const hash = await bcrypt.hash(doctor, saltRounds);
      const sanitizedHash = hash.replace(/\//g, "_").replace(/\./g, "-");
      roomName = `healthconnect-room${sanitizedHash}`;
      allowStart = true;
    } else if (type === "Admin") {
      if (!uid || !isMeetingTimeValid(uid)) {
        return res
          .status(403)
          .json({ success: false, message: "Meeting time not started yet" });
      }
      const saltRounds = 10;
      const hash = await bcrypt.hash(userName, saltRounds);
      const sanitizedHash = hash.replace(/\//g, "_").replace(/\./g, "-");
      roomName = `healthconnect-room${sanitizedHash}`;
      allowStart = true;
    } else {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    if (!allowStart) {
      return res
        .status(403)
        .json({ success: false, message: "Not allowed to start meeting" });
    }

    res.json({ success: true, roomName });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Joining room unsuccessful", success: false });
  }
});

router.post("/updateHistory", async (req, res) => {
  try {
    const { email, issue, status } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const userExists = await userModel.findOne({ email });
    if (!userExists) {
      return res.status(404).json({
        message: "No user registered with this email",
        success: false,
      });
    }

    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();

    const newVisit = {
      date,
      time,
      issue,
      status,
    };

    const existingHistory = await visitHistoryModel.findOne({ email });

    if (!existingHistory) {
      const newHistory = new visitHistoryModel({
        email,
        visits: [newVisit],
      });

      await newHistory.save();

      return res.status(201).json({
        message: "First visit recorded successfully",
        success: true,
      });
    } else {
      existingHistory.visits.push(newVisit);
      await existingHistory.save();

      return res.status(200).json({
        message: "Visit history updated successfully",
        success: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error updating history",
      success: false,
    });
  }
});

module.exports = router;
