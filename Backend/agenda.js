
// agenda.js
const Agenda = require("agenda");
const mongoConnectionString = process.env.URL;
const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: "jobs" },
});

module.exports = agenda;
