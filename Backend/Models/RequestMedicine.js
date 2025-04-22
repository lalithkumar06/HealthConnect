const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const requestModel = mongoose.model("request", requestSchema);
module.exports = requestModel;
