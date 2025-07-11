const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload=require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser);     // Login User
router.get("/profile", protect, getUserProfile); // Get User Profile

router.post("/upload-image", upload.single("image"), (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    // Construct the image URL
    // req.protocol: 'http' or 'https'
    // req.get('host'): 'localhost:5000' or your domain
    // req.file.filename: the name of the uploaded file
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  
    // Send back a success response with the image URL
    res.status(200).json({ imageUrl });
  });
module.exports = router;