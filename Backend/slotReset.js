
const cron = require("node-cron");
const slotModel = require("../models/Slots");

const setupSlotResetJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("🔄 Resetting all slots...");

    try {
      const allSlots = await slotModel.find();

      for (const doc of allSlots) {
        doc.slot = doc.slot.map((s) => ({
          ...s,
          status: "unbooked",
          meetingType: "none",
        }));
        await doc.save();
      }

      console.log("All slots reset successfully.");
    } catch (error) {
      console.error(" Error resetting slots:", error);
    }
  });
};

module.exports = setupSlotResetJob;
