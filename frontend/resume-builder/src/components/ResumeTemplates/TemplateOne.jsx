import React,{useState,useRef,useEffect} from 'react'
import { LuMapPinHouse,LuMail,LuPhone,LuRss,LuGithub,LuUser } from 'react-icons/lu';
import ContactInfoForm from '../../pages/ResumeUpdate/Forms/ContactInfoForm';
import ContactInfo from '../ResumeSections/ContactInfo';
import { RiLinkedinBoxLine } from "react-icons/ri";
import EducationInfo from '../ResumeSections/EducationInfo';
import { formatYearMonth } from '../../utils/helper';
import LanguageSection from '../ResumeSections/LanguageSection';
import WorkExperience from '../ResumeSections/WorkExperience';
import ProjectInfo from '../ResumeSections/ProjectInfo';
import SkillSection from '../ResumeSections/SkillSection';
import CertificationsInfo from '../ResumeSections/CertificationsInfo';


const DEFAULT_THEME=["#EBFDFF","#A1F4FD","#CEFAFE","#00B6DB","#4A5565"]

const Title=({text,color})=>{
    return(
        <div className='relative w-fit mb-2.5'>
            <span
            className='absolute bottom-0 left-0 w-full h-2'
            style={{backgroundColor:color}}>

            </span>
            <h2 className={`relative text-sm font-bold`}>{text}</h2>
        </div>
    );
};

const TemplateOne = ({ resumeData, colorPalette, containerWidth }) => {
    const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME; // Assuming DEFAULT_THEME is defined elsewhere
  console.log("themeColors used in TemplateOne:", themeColors); // ✅ DEBUG
    const resumeRef = useRef(null);
    const [baseWidth, setBaseWidth] = useState(800); // Default value for base width
    const [scale, setScale] = useState(1); // Default scale factor
  
    useEffect(() => {
      // Calculate the scale factor based on the container width
     
        const actualBaseWidth = resumeRef.current.offsetWidth; // Get the actual base width of the resume container
        setBaseWidth(actualBaseWidth); // Update baseWidth state
        setScale(containerWidth / actualBaseWidth); // Calculate and set the scale
      
    }, [containerWidth]); // Recalculate when containerWidth changes
  
    return (
      <div
      ref={resumeRef}
      className='p-3 bg-white'
      style={{
        transform:containerWidth>0?`scale(${scale})` :"none",
        transformOrigin:"top left",
        width:containerWidth>0?`${baseWidth}px`:"auto",
        height:"auto"

      }}>

        <div className='grid grid-cols-12 gap-8'> 
            <div
            className='col-span-4 py-10'
            style={{backgroundColor:themeColors[0]}}
            >
                <div className='flex flex-col items-center px-2'>
                    <div className='w-[100px] h-[100px] max-w-[110px] rounded-full flex items-center justify-center'
                    style={{backgroundColor:themeColors[1]}}>
                        {resumeData.profileInfo.profilePreviewUrl?(
                            <img 
                            src={resumeData.profileInfo.profilePreviewUrl}
                            className='w-[90px] h-[90px] rounded-full'/>
                        ):(
                            <div className='w-[90px] h-[90px] rounded-full flex items-center justify-center text-5xl'
                            style={{color:themeColors[4]}}>
                                <LuUser />
                                </div>
                                
                          
                        )
                    }
                    </div>
                    <h2 className='text-xl font-bold mt-3'>
                        {resumeData.profileInfo.fullName}
                    </h2>
                    <p className='text-sm text-center'>
                        {resumeData.profileInfo.designation}
                    </p>
                </div>

                <div className='my-6 mx-6'>
                    <div className='flex flex-col gap-4'>
                        <ContactInfo
                        icon={<LuMapPinHouse />}
                        iconBG={themeColors[2]}
                        value={resumeData.contactInfo.location} />


                        <ContactInfo
                        icon={<LuMail />}
                        iconBG={themeColors[2]}
                        value={resumeData.contactInfo.email} />


                        <ContactInfo
                        icon={<LuPhone />}
                        iconBG={themeColors[2]}
                        value={resumeData.contactInfo.phone} />

                        {resumeData.contactInfo.linkedin && (
                            <ContactInfo
                            icon={<RiLinkedinBoxLine />}
                            iconBG={themeColors[2]}
                            value={resumeData.contactInfo.linkedin} />

                        )}
                        
                        {resumeData.contactInfo.github &&(
                            <ContactInfo
                            icon={<LuGithub />}
                            iconBG={themeColors[2]}
                            value={resumeData.contactInfo.github} />
                        )}

                        <ContactInfo
                            icon={<LuRss />}
                            iconBG={themeColors[2]}
                            value={resumeData.contactInfo.website} />


                        


                    </div>

                    <div className="mt-5">
                    <Title text="Education" color={themeColors[1]} />

                    {resumeData.education.map((data, index) => (
                        <EducationInfo
                        key={`education_${index}`}
                        degree={data.degree}
                        institution={data.institution}
                        duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                        />
                    ))}
                    </div>  

                    <div className='mt-5'>
                        <Title text="languages" color={themeColors[1]}/>

                        <LanguageSection
                        languages={resumeData.languages}
                        accentColor={themeColors[3]}
                        bgcolor={themeColors[2]} />
                    </div>
                </div>
            </div>
            <div className='col-span-8 pt-10 mr-8 pb-5'>
                <div>
                    <Title text="Professional Summary" color={themeColors[1]} />
                    <p className='text-sm font-medium'>
                        {resumeData.profileInfo.summary}
                    </p>
                </div>


                <div className="mt-4">
                <Title text="Work Experience" color={themeColors[1]} />

                {resumeData.workExperience.map((data, index) => (
                    <WorkExperience
                    key={`work_${index}`}
                    company={data.company}
                    role={data.role}
                    duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                    durationColor={themeColors[4]}
                    description={data.description}
                    />
                ))}
                </div>    

                <div className="mt-4">
                <Title text="Projects" color={themeColors[1]} />

                {resumeData.projects.map((project, index) => (
                    <ProjectInfo
                    key={`project_${index}`}
                    title={project.title}         // ✅ Correct prop name
                    description={project.description}
                    githubLink={project.github}
                    liveDemoUrl={project.liveDemo}
                    bgcolor={themeColors[2]}
                  />
                  
                ))}
                </div>  

                <div className='mt-4'>
                    <Title text="Skills" color={themeColors[1]} />

                    <SkillSection
                    skills={resumeData.skills}
                    accentColor={themeColors[3]}
                    bgcolor={themeColors[2]} />
                    </div>

                <div className='mt-4'>
                <Title text="certifications" color={themeColors[1]} />
                <div className=''>
                {resumeData.certifications.map((data, index) => {
  return (
    <CertificationsInfo
      key={`cert_${index}`}
      title={data.title}
      issuer={data.issuer}
      year={data.year}
      bgcolor={themeColors[2]}
    />
  );
})}
                    </div>
                    </div>

                {resumeData.interests.length>0 && resumeData.interests[0]!="" &&
                <div className='mt-4'>
                    <Title text="interests" color={themeColors[1]}/>

                    <div className='flex items-center flex-wrap gap-3 mt-4'>
                    {resumeData.interests.map((interest, index) => {
                        if (!interest) return null;
                        return (
                        <div
                            key={`interest_${index}`}
                            className="text-[10px] font-medium py-1 px-3 rounded-lg"
                            style={{ backgroundColor: themeColors[2] }}
                        >
                            {interest}
                        </div>
                        );
                    })}
                </div>

                </div>}
            </div>
        </div>
      </div>
    );
  };


export default TemplateOne
