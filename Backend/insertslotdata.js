const mongoose = require('mongoose');
require('dotenv').config();
const URL = process.env.URL;
const slotModel = require('./Models/Slots');
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>{
  console.log("YES Connected");
})
const baseSlot = [
  { time: "10:00 AM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "10:15 AM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "10:30 AM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "10:45 AM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "11:00 AM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "11:15 AM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "11:30 AM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "11:45 AM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "12:00 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "12:15 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "12:30 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "12:45 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "02:30 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "02:45 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "03:00 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "03:15 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "03:30 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "03:45 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "04:00 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "04:15 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "04:30 PM", meetingType: "none", status: "unbooked", id: "none" },
  { time: "04:45 PM", meetingType: "none", status: "unbooked", id: "none" },
];

const doctors = [
  "Dr. Ramesh Kumar",
  "Dr. Arvind Desai",
  "Dr. Manish Verma",
  "Dr. Suresh Iyer",
  "Dr. Anjali Verma",
  "Dr. Priya Nair",
];

async function insertMultipleDoctors() {
  try {
    const slotDocs = doctors.map((doctor) => ({
      doctor,
      slot: [...baseSlot],
    }));

    await slotModel.insertMany(slotDocs);
    console.log("Slot data inserted for all doctors");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Insertion Error:", error);
  }
}
insertMultipleDoctors();
