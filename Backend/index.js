const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./Routers/authrouter");
const protrouter = require("./Routers/protrouter");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
require("./Models/database");

const app = express();

// MongoDB connection
const URL = process.env.URL;
mongoose.connect(URL, {
  useUnifiedTopology: true,
});

// Apply CORS globally for HTTP routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers for handling JSON and URL encoded data
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRouter); // Authentication routes
app.use("/protected", protrouter); // Protected routes (e.g. for authenticated users)

// Ping route for health check
app.get("/ping", (req, res) => {
  res.json({ mes: "Done" });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
