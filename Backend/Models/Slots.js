const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotSchema = new Schema({
  doctor: {
    type: String,
    required: true,
  },
  slot: [
    {
      time: {
        type: String,
        required: true,
      },
      meetingType: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      id : {
        type : String , 
        required : true
      }
    },
  ],
});
const slotModel = mongoose.model('slot', slotSchema);
module.exports = slotModel;