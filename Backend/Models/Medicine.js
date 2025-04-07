const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicineSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  use: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
});

const medicineModel = mongoose.model("medicine", medicineSchema);
module.exports = medicineModel;
