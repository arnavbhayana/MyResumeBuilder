const fs = require("node:fs");
const path = require("node:path");
const Resume = require("../models/resume");


// @desc    Get a new resume
// @route   GET /api/resumes
// @access  Private
const createResume = async (req, res) => {
  try {
    const {title}=req.body;

    //default template
    const defaultResumeData = {
        profileInfo: {
          profileImg: null,
          previewUrl: "",
          fullName: "",
          designation: "",
          summary: "",
        },
        contactInfo: {
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          website: "",
        },
        workExperience: [
          {
            company: "",
            role: "",
            startDate: "",
            endDate: "",
            description:"",
        },
        ],
            education:[
                {
                    degree:"",
                    institution:"",
                    startDate:"",
                    endDate:"",
                },
            ],
            skills:[
                {
                    name:"",
                    progress:0,
                },
            ],
            projects:[
                {
                    title:"",
                    description:"",
                    github:"",
                    liveDemo:"",
                },
            ],
            certifications:[
                {
                    title:"",
                    issuer:"",
                    year:"",
                },
            ],
            languages:[
                {
                    name:"",
                    progress:0,
                },
            ],
            interests:[""],
        };
        const newResume=await Resume.create({
            userID:req.user._id,
            title,
            ...defaultResumeData,
        });
        res.status(201).json(newResume)

  } catch (error) {
    res.status(500).json({ message: "Failed to create resume", error: error.message });
  }
};

// @desc    Get single resume for logged in user
// @route   GET /api/resumes
// @access  Private 
const getUserResumes = async (req, res) => {
  try {
    const resumes=await Resume.find({userID:req.user._id}).sort({
        updatedAt:-1
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Failed to create resumes", error: error.message });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private (requires authentication)
const getResumeById = async (req, res) => {
try {
    const resume = await Resume.findOne({ _id: req.params.id, userID: req.user._id });


    if(!resume)
    {
        return res.status(404).json({message:"Resume not found"});
    }

    res.json(resume);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resume", error: error.message });

  }
};

// @desc   update a resume
// @route   PUT /api/resumes/:id
// @access  Private 

const updateResume=async(req,res)=>{
    try {
        const resume=await Resume.findOne({
            _id:req.params.id,
            userID:req.user._id,
        });
        if(!resume){
            return res.status(404).json({message:"Resume not found or unauthorized"});
        }
        //merge updates from req.body into existing resume
        Object.assign(resume,req.body);

        //save updated resume
        const savedResume=await resume.save();
        res.json(savedResume);
    } catch (error) {
      res.status(500).json({ message: "Failed to create resumes", error: error.message });
    }
}
// @desc    deleta a resume
// @route   DELETE /api/resumes/:id
// @access  Private (requires authentication)
const deleteResume=async(req,res)=>{
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userID: req.user._id,
          });
          
          if (!resume) {
            return res.status(404).json({ message: "Resume not found or unauthorized" });
          }
          
          // Delete thumbnailLink and profilePreviewUrl images from uploads folder
          const uploadsFolder = path.join(__dirname, '..', 'uploads'); // Adjust path as needed
          const baseURL = `${req.protocol}://${req.get("host")}`;
          
          if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
          }
          
          if (resume.profileInfo?.previewUrl) {
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.previewUrl));
            if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
          }
          
          const deleted = await Resume.findOneAndDelete({
            _id: req.params.id,
            userID: req.user.id,
          });

          if(!deleted){
            return res.status(404).json({message:"Resume not found or unauthorized"});
          }

          res.json({message:"Resume Deleted successfully"});
    } catch (error) {
      res.status(500).json({ message: "Failed to create resumes", error: error.message });
    }
}

module.exports={
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume
}