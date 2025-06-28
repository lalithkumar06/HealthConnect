const cron = require("node-cron");
const slotModel = require("./Models/Slots");

const setupSlotResetJob = () => {
  // Schedule job to run daily at midnight (00:00)
  cron.schedule("0 0 * * *", async () => {
    console.log("🔄 Resetting all slots at:", new Date().toISOString());

    try {
      // Option 1: More efficient bulk update (recommended)
      const result = await slotModel.updateMany(
        {},
        {
          $set: {
            "slot.$[].status": "unbooked",
            "slot.$[].meetingType": "none",
          },
        }
      );

      console.log(
        `✅ All slots reset successfully. Modified ${result.modifiedCount} documents.`
      );

      /* 
      // Option 2: Your original approach (works but less efficient)
      const allSlots = await slotModel.find();

      for (const doc of allSlots) {
        doc.slot = doc.slot.map((s) => ({
          ...s,
          status: "unbooked",
          meetingType: "none",
        }));
        await doc.save();
      }
      
      console.log("✅ All slots reset successfully.");
      */
    } catch (error) {
      console.error("❌ Error resetting slots:", error);
      // Optional: Add alerting mechanism here (email, Slack, etc.)
    }
  });

  console.log("📅 Slot reset job scheduled - runs daily at midnight");
};

module.exports = setupSlotResetJob;
