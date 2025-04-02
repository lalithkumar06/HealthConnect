const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitHistorySchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  visits: [
    {
      date: {
        type: String,
        required: true,
      },
      time: {
        type: String, 
        required: true,
      },
      issue: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
  ],
});

const visitHistoryModel = mongoose.model("visitHistory", visitHistorySchema);
module.exports = visitHistoryModel;
