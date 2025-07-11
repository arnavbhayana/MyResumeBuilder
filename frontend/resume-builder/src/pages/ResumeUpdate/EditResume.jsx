import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuCircleAlert, LuDownload, LuPalette, LuSave, LuTrash2 } from 'react-icons/lu';
import toast from "react-hot-toast";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TitleInput from '../../components/inputs/TitleInput';
import { useReactToPrint } from 'react-to-print';
import axiosInstance from '../../utils/axiosInstance';
import StepProgress from '../../components/stepProgress';
import { API_PATHS } from '../../utils/apiPaths';
import ProfileInfoForm from './Forms/ProfileInfoForm';
import ContactInfoForm from "./Forms/ContactInfoForm"
import WorkExperienceform from './Forms/WorkExperienceform';
import EducationDetailsForm from './Forms/EducationDetailsForm';
import SkillsInfoForm from './Forms/SkillsInfoForm';
import ProjectDetailForm from './Forms/ProjectDetailForm';
import CertificationInfoForm from './Forms/CertificationInfoForm';
import AdditionalInfoForm from './Forms/AdditionalInfoForm';
import RenderResume from '../../components/ResumeTemplates/RenderResume';
import { fixTailwindColors } from '../../utils/helper';
import { captureElementAsImage } from '../../utils/helper';
import { dataURLtoFile } from '../../utils/helper';
import ThemeSelector from './ThemeSelector';
import Modal from '../../components/modal';
import axios from 'axios';



const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [resumeData, setResumeData] = useState({
    title: "",
    thumbnailLink: "",
    profileInfo: {
      profileImg: null,
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "",
      colorPalette: "", // ✅ use camelCase
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [{
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    }],
    education: [{
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
    }],
    skills: [{
      name: "",
      progress: 0,
    }],
    projects: [{
      title: "",
      description: "",
      github: "",
      liveDemo: "",
    }],
    certifications: [{
      title: "",
      issuer: "",
      year: "",
    }],
    languages: [{
      name: "",
      progress: 0,
    }],
    interests: [""],
  });

  // ✅ Dummy Functions to Avoid Errors
  const validateAndNext = (e) => {
    const errors=[];

    switch(currentPage){
      case "profile-info":
        const {fullName,designation,summary}=resumeData.profileInfo;
        if(!fullName.trim())errors.push("Full Name is required");
        if(!designation.trim())errors.push("Designation is required");
        if(!summary.trim())errors.push("Summary is required");
        break;

        case "contact-info":
        const { email, phone } = resumeData.contactInfo;
        // Validate email format
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.push("Valid email is required.");
        }
        // Validate phone number (simple check for non-empty)
        if (!phone.trim()) {
          errors.push("Valid 10-digit phone number is required");
        }
        break;

      case "work-experience":
        resumeData.workExperience.forEach((
          { company, role, startDate, endDate },
          index
        ) => {
          // Validate company field
          if (!company.trim()) {
            errors.push(`Company is required in experience ${index + 1}`);
          }
          // Validate role field
          if (!role.trim()) {
            errors.push(`Role is required in experience ${index + 1}`);
          }
          // Validate start and end dates
          if (!startDate || !endDate) {
            errors.push(`Start and End dates are required in experience ${index + 1}`);
          }
        });
        break;

        case "education-info":
        resumeData.education.forEach(
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree.trim()) {
              errors.push(`Degree is required in education ${index + 1}`);
            }
            if (!institution.trim()) {
              errors.push(`Institution is required in education ${index + 1}`);
            }
            if (!startDate || !endDate) {
              errors.push(`Start and End dates are required in education ${index + 1}`);
            }
          }
        );
        break;

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim()) {
            errors.push(`Skill name is required in skill ${index + 1}`);
          }
          if (progress < 1 || progress > 100) {
            errors.push(`Skill progress must be between 1 and 100 in skill ${index + 1}`);
          }
        });
        break;

        case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim()) {
            errors.push(`Project title is required in project ${index + 1}`);
          }
          if (!description.trim()) {
            errors.push(`Project description is required in project ${index + 1}`);
          }
        });
        break;

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer }, index) => {
          if (!title.trim()) {
            errors.push(`Certification title is required in certification ${index + 1}`);
          }
          if (!issuer.trim()) {
            errors.push(`Issuer is required in certification ${index + 1}`);
          }
        });
        break;

        case "additionalInfo":
          if(
            resumeData.languages.length===0||
            !resumeData.languages[0].name?.trim()
          ){
            errors.push("At least one language is required");

          }

          if(
            resumeData.interests.length===0||
            !resumeData.interests[0].name?.trim()
          ){
            errors.push("At least one interest is required");
          }
          break;
          default:
            break;
    }
    if(errors.length>0){
      setErrorMsg(errors.join(", "));
      return;
    }

    //move to next step
    setErrorMsg("");
    goToNextStep();
  };

  //function to navigate to next step
  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];
  
    // If current page is the last one, open the preview modal
    if (currentPage === "additionalInfo") {
      setOpenPreviewModal(true);
    }
  
    // Find the index of the current page
    const currentIndex = pages.indexOf(currentPage);
  
    // If current page is found and not the last page
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]); // Set the next page
  
      // Set progress as percentage
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
  
      // Scroll to the top of the page smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  // Function to navigate to the previous page
const goBack = () => {
  const pages = [
    "profile-info",
    "contact-info",
    "work-experience",
    "education-info",
    "skills",
    "projects",
    "certifications",
    "additionalInfo",
  ];

  // If the current page is the first page ("profile-info"), navigate to the dashboard
  if (currentPage === "profile-info") {
    navigate("/dashboard");
  }

  // Find the index of the current page
  const currentIndex = pages.indexOf(currentPage);

  // If the current page is not the first page (index > 0)
  if (currentIndex > 0) {
    const prevIndex = currentIndex - 1; // Calculate the index of the previous page
    setCurrentPage(pages[prevIndex]); // Set the current page to the previous one

    // Update progress based on the previous page's index
    const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
    setProgress(percent);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => updateSection("profileInfo", key, value)}
            onNext={validateAndNext}
          />
        );

        case "contact-info":
          return(
            <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key,value)=>{
              updateSection("contactInfo",key,value);
            }}
            />
          );

          case "work-experience":
          return(
            <WorkExperienceform
  workExperience={resumeData?.workExperience}
  updateArrayItem={(index, key, value) => {
    updateArrayItem("workExperience", key, index, value);
  }}
  addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
  removeArrayItem={(index) => removeArrayItem("workExperience", index)}
/>

          );

          case "education-info":
            return (
              <EducationDetailsForm
                educationInfo={resumeData?.education}
                updateArrayItem={(index, key, value) => {
                  updateArrayItem("education", key, index, value);
                }}
                addArrayItem={(newItem) => addArrayItem("education", newItem)}
                removeArrayItem={(index) => removeArrayItem("education", index)}
              />
            );
          
          case "skills":
            return (
              <SkillsInfoForm
                skillsInfo={resumeData?.skills}
                updateArrayItem={(index, key, value) => {
                  updateArrayItem("skills", key, index, value);
                }}
                addArrayItem={(newItem) => addArrayItem("skills", newItem)}
                removeArrayItem={(index) => removeArrayItem("skills", index)}
              />
            );
          case "projects":
            return (
              <ProjectDetailForm
                projectInfo={resumeData?.projects}
                updateArrayItem={(index, key, value) => {
                  updateArrayItem("projects", key, index, value);
                }}
                addArrayItem={(newItem) => addArrayItem("projects", newItem)}
                removeArrayItem={(index) => removeArrayItem("projects", index)}
              />
            );
            case "certifications":
            return (
              <CertificationInfoForm
              certifications={resumeData?.certifications}
              updateArrayItem={(index, key, value) => {
                updateArrayItem("certifications", key, index, value);
              }}
              addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
              removeArrayItem={(index) => removeArrayItem("certifications", index)}
            />
            );
            case "additionalInfo":
            return(
              <AdditionalInfoForm
              languages={resumeData.languages}
              interests={resumeData.interests}
              updateArrayItem={(section,key,index,value)=>{
                updateArrayItem(section,key,index,value)
              }}
              addArrayItem={(section,newItem)=>addArrayItem(section,newItem)}
              removeArrayItem={(section,index)=>{
                removeArrayItem(section,index)
              }}/>
            );
          

      default:
        return null;
    }
  };
  //update simple nested object like contactinfo
  const updateSection = (section, key, value) => {
    setResumeData((prev)=>({
      ...prev,
      [section]:{
        ...prev[section],
        [key]:value,
      }
    }));
  };
  //update array item like skills[1]
  const updateArrayItem = (section, key, index, value) => {
    setResumeData((prev)=>{
      const updatedArray=[...prev[section]];

      if(key===null){
        updatedArray[index]=value;
      }else{
        updatedArray[index]={
          ...updatedArray[index],
          [key]:value,
        };
      }
      return{
        ...prev,
        [section]:updatedArray,
      };
    });
  };
  //add item to array
  const addArrayItem = (section, newItem) => {
    setResumeData((prev)=>({
      ...prev,
      [section]:[...prev[section],newItem],
    }));
  };
  //remove item from array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);  // ✅ FIXED: Use updatedArray.splice not updateArrayItem.splice
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };
  
  //upload thumbnail and resume profile pic
  const uploadResumeImages = async () => {
    try{
      setIsLoading(true);
      fixTailwindColors(resumeRef.current);
      const imageDataUrl=await captureElementAsImage(resumeRef.current);

      //convert base 64 to file
      const thumbnailFile=dataURLtoFile(
        imageDataUrl,
        `resume-${resumeId}.png`
      );
      const profileImageFile=resumeData?.profileInfo?.profileImg || null;
      const formData=new FormData();
      if(profileImageFile)formData.append("profileImage",profileImageFile);

      if(thumbnailFile)formData.append("thumbnail",thumbnailFile);

      const uploadResponse=await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        {headers :{"Content-Type":"multipart/form-data"}}
      );
     const {thumbnailLink,profilePreviewUrl}=uploadResponse.data;
     
     console.log("RESUME_DATA_",resumeData);

     //call second API to update
     await updateResumeDetails(thumbnailLink,profilePreviewUrl);

     toast.success("Resume Updated Successfully");
     navigate("/dashboard");
    }
    catch(error){
      console.error("Error uploading images",error)
      toast.error("Failed to upload images");
    }finally{
      setIsLoading(false)
    }
  };
  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {
    try{
      setIsLoading(true);
      const response=await axiosInstance.put(
        API_PATHS.RESUME.UPDATE(resumeId),
        {
          ...resumeData,
          thumbnailLink:thumbnailLink||"",
          profileInfo:{
            ...resumeData.profileInfo,
            profilePreviewUrl:profilePreviewUrl||""
          },
        }
      );
    }
    catch(err){
      console.error("Error capturing Images",err)
    }
    finally{setIsLoading(false);}
  };
  const handleDeleteResume = async () => {
    try{
      setIsLoading(true);
      const response=await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success('Resume Seleted Successfully');
      navigate("/dashboard");
    }
    catch(err){
      console.error("Error capturing image",err);
    }
    finally{
      setIsLoading(false);
    }
  };

  // ✅ Fetch Resume Details
  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId));
      const resumeInfo = response.data;

      if (resumeInfo && resumeInfo.profileInfo) {
        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo.title || "Untitled",
          template: resumeInfo.template || prevState.template,
          profileInfo: resumeInfo.profileInfo || prevState.profileInfo,
          contactInfo: resumeInfo.contactInfo || prevState.contactInfo,
          workExperience: resumeInfo.workExperience || prevState.workExperience,
          education: resumeInfo.education || prevState.education,
          skills: resumeInfo.skills || prevState.skills,
          projects: resumeInfo.projects || prevState.projects,
          certifications: resumeInfo.certifications || prevState.certifications,
          languages: resumeInfo.languages || prevState.languages,
          interests: resumeInfo.interests || prevState.interests,
        }));
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const updateBaseWidth = () => {
    if(resumeRef.current){
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  const reactToPrintFn = useReactToPrint({contentRef:resumeDownloadRef});

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);

    if (resumeId) {
      fetchResumeDetailsById();
    }

    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4">
          <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prevState) => ({
                ...prevState,
                title: value,
              }))
            }
          />
          <div className='flex items-center gap-4'>
            <button
            className='btn-small-light'
            onClick={()=>setOpenThemeSelector(true)}>
              <LuPalette className=' text-[16px]' />
              <span className='hidden md:block'>Change Theme</span>
            </button>

            <button 
            className='btn-small-light'
            onClick={handleDeleteResume}>
              <LuTrash2 className='text-[16px]' />
              <span className='hidden md:block'>Delete</span>
            </button>

            <button
            className='btn-small-light'
            onClick={()=>setOpenPreviewModal(true)}>
              <LuDownload className='text-[16px]'/>
              <span className='hidden md:block'>Preview and Download</span>
            </button>
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">

    <StepProgress progress={progress} />
    {renderForm()}

  <div className="mx-5">
    {errorMsg && (
      <div className="flex items-center gap-2 text-[11px] font-medium bg-amber-100 px-2 py-0.5 my-2 rounded text-red-600">
        <LuCircleAlert className="text-md" />
        {errorMsg}
      </div>
    )}

  <div className="flex justify-end items-end mt-3 mb-5 gap-3">
    <button
      className="btn-small-light"
      onClick={goBack}
      disabled={isLoading}
    >
      <LuArrowLeft className="text-[16px]" />
      Back
    </button>
    <button
    className='btn-small-light'
    onClick={uploadResumeImages}
    disabled={isLoading}>
      <LuSave className='text-[16px]'/>
      {isLoading?"Updating...":"Save and Exit"}
    </button>
    <button className='btn-small'
    onClick={validateAndNext}
    disabled={isLoading}>
      {currentPage==='additionalInfo'&&(
        <LuDownload className='text-[16px]' />
      )}
      {currentPage==='additionalInfo'?"Preview & Download":"Next"}
      {currentPage!=="additionalInfo" && (
        <LuArrowLeft className='text-[16px] rotate-180'/>
      )}
    </button>
    </div>
  </div>
</div>

<div ref={resumeRef} className='h-[100vh]'>
  {/* resume templates */}

  <RenderResume
  templateId={resumeData?.template?.theme || ""}
  resumeData={resumeData}
  colorPalette={resumeData?.template?.colorPalette || []}
  containerWidth={baseWidth}
  />

</div>
      </div>
      </div>
      <Modal
  isOpen={openThemeSelector}
  onClose={() => setOpenThemeSelector(false)}
  title="Change Theme"
>
  <div className="w-[90vw] h-[80vh]">
    <ThemeSelector
      selectedTheme={resumeData?.template}
      setSelectedTheme={(value) => {
        setResumeData((prevState) => ({
          ...prevState,
          template: value || prevState.template,
        }));
      }}
      resumeData={null}
      onClose={() => setOpenThemeSelector(false)}
    />
  </div>
</Modal>
<Modal
  isOpen={openPreviewModal}
  onClose={() => setOpenPreviewModal(false)}
  title={resumeData.title}
  showActionBtn
  actionBtnText="Download"
  actionBtnIcon={<LuDownload className="text-[16px]" />}
  onActionClick={() => reactToPrintFn()}
>
  <div ref={resumeDownloadRef} className="w-[98vw] h-[90vh]">
    <RenderResume
      templateId={resumeData?.template?.theme || ''}
      resumeData={resumeData}
      colorPalette={resumeData?.template?.colorPalette || []}
    />
  </div>
</Modal>
    </DashboardLayout>
  );
};

export default EditResume;
