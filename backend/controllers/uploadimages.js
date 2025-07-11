const fs = require("fs");
const path = require("path");
const Resume = require("../models/resume");
const upload = require("../middlewares/uploadMiddleware");

const uploadResumeImages = async (req, res) => {
  try {
    upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload failed", error: err.message });
      }

      const resumeId = req.params.id;
      const resume = await Resume.findOne({ _id: resumeId, userID: req.user._id });

      if (!resume) {
        return res.status(404).json({ message: "Resume not found or unauthorized" });
      }

      const uploadsFolder = path.join(__dirname, "..", "uploads");
      const baseURL = `${req.protocol}://${req.get("host")}`;

      const newThumbnail = req.files.thumbnail?.[0];
      const newProfileImage = req.files.profileImage?.[0];

      // Delete old thumbnail if new one is uploaded
      if (newThumbnail) {
        if (resume.thumbnailLink) {
          const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
          if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
        }
        resume.thumbnailLink = `${baseURL}/uploads/${newThumbnail.filename}`;
      }

      // Delete old profile image if new one is uploaded
      if (newProfileImage) {
        if (resume.profileInfo?.profilePreviewUrl) {
          const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
          if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
        }
        resume.profileInfo.profilePreviewUrl = `${baseURL}/uploads/${newProfileImage.filename}`;
      }

      // Save and respond
      await resume.save();

      res.status(200).json({
        message: "Images uploaded successfully",
        thumbnailLink: resume.thumbnailLink,
        profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
      });
    });
  } catch (error) {
    console.error("Error uploading resume images:", error);
    res.status(500).json({ message: "Failed to upload images", error: error.message });
  }
};

module.exports = { uploadResumeImages };
