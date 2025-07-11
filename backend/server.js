// Load environment variables from .env file
require("dotenv").config();

// Import required packages
const express = require("express");
const cors = require("cors");
const ConnectDB = require("./config/db");
const path = require("path");

const authRoutes=require("./routes/authRoutes")
const resumeRoutes=require("./routes/resumeRoutes")

// Initialize express app
const app = express();

// Define PORT and CLIENT_URL from environment variables
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "*";

// Middleware: Enable CORS
app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware: Parse JSON bodies
app.use(express.json());

// Connect to database
ConnectDB();

//routes
app.use("/api/auth",authRoutes);
app.use("/api/resume",resumeRoutes);

app.use(
  "/uploads", 
  express.static(path.join(__dirname, "uploads"), {
    
    setHeaders: (res, path) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    },
  })
);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
