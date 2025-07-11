import React, { useRef, useState, useEffect } from "react";
import {
  LuMapPinHouse,
  LuMail,
  LuPhone,
  LuRss,
  LuGithub,
  LuUser,
} from "react-icons/lu";
import { RiLinkedinBoxLine } from "react-icons/ri";
import ContactInfo from "../ResumeSections/ContactInfo";
import EducationInfo from "../ResumeSections/EducationInfo";
import { formatYearMonth } from "../../utils/helper";
import LanguageSection from "../ResumeSections/LanguageSection";
import WorkExperience from "../ResumeSections/WorkExperience";
import ProjectInfo from "../ResumeSections/ProjectInfo";
import SkillSection from "../ResumeSections/SkillSection";
import CertificationsInfo from "../ResumeSections/CertificationsInfo";

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B6DB", "#4A5565"];

const Title = ({ text, color }) => (
  <h2 className="text-[15px] font-bold underline" style={{ color }}>{text}</h2>
);

const TemplateTwo = ({ resumeData, colorPalette, containerWidth }) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const actualBaseWidth = resumeRef.current.offsetWidth;
    setBaseWidth(actualBaseWidth);
    setScale(containerWidth / actualBaseWidth);
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className="p-6 bg-white"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        height: "auto",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <div
          className="flex items-center justify-center w-[80px] h-[80px] rounded-xl"
          style={{ backgroundColor: themeColors[1] }}
        >
          {resumeData.profileInfo.profilePreviewUrl ? (
            <img
              src={resumeData.profileInfo.profilePreviewUrl}
              alt="profile"
              className="w-[70px] h-[70px] rounded-xl"
            />
          ) : (
            <LuUser className="text-4xl text-gray-600" />
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{resumeData.profileInfo.fullName}</h1>
          <p className="text-sm font-semibold">{resumeData.profileInfo.designation}</p>
          <ContactInfo icon={<LuMapPinHouse />} iconBG={themeColors[2]} value={resumeData.contactInfo.location} />
          {resumeData.contactInfo.linkedin && (
            <ContactInfo icon={<RiLinkedinBoxLine />} iconBG={themeColors[2]} value={resumeData.contactInfo.linkedin} />
          )}
          {resumeData.contactInfo.website && (
            <ContactInfo icon={<LuRss />} iconBG={themeColors[2]} value={resumeData.contactInfo.website} />
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <ContactInfo icon={<LuMail />} iconBG={themeColors[2]} value={resumeData.contactInfo.email} />
          <ContactInfo icon={<LuPhone />} iconBG={themeColors[2]} value={resumeData.contactInfo.phone} />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <Title text="Professional Summary" color={themeColors[3]} />
        <p className="text-sm font-medium mt-1">{resumeData.profileInfo.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <Title text="Work Experience" color={themeColors[3]} />
        {resumeData.workExperience.map((job, index) => (
          <div key={index} className="mt-2">
            <h3 className="font-bold text-sm">{job.company}</h3>
            <p className="italic text-sm">{job.role}</p>
            <p className="text-[13px] italic text-gray-700">{job.description}</p>
            <p className="text-[12px] font-semibold text-right">
              {`${formatYearMonth(job.startDate)} - ${formatYearMonth(job.endDate)}`}
            </p>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="mb-4">
        <Title text="Projects" color={themeColors[3]} />
        {resumeData.projects.map((project, index) => (
          <ProjectInfo
            key={`project_${index}`}
            title={project.title}
            description={project.description}
            githubLink={project.github}
            liveDemoUrl={project.liveDemo}
            bgcolor={themeColors[2]}
          />
        ))}
      </div>

      {/* Education */}
      <div className="mb-4">
        <Title text="Education" color={themeColors[3]} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumeData.education.map((edu, index) => (
            <EducationInfo
              key={`edu_${index}`}
              degree={edu.degree}
              institution={edu.institution}
              duration={`${formatYearMonth(edu.startDate)} - ${formatYearMonth(edu.endDate)}`}
            />
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <Title text="Skills" color={themeColors[3]} />
        <SkillSection skills={resumeData.skills} accentColor={themeColors[3]} bgcolor={themeColors[2]} />
      </div>

      {/* Certifications */}
      <div className="mb-4">
        <Title text="Certifications" color={themeColors[3]} />
        {resumeData.certifications.map((cert, index) => (
          <CertificationsInfo
            key={`cert_${index}`}
            title={cert.title}
            issuer={cert.issuer}
            year={cert.year}
            bgcolor={themeColors[2]}
          />
        ))}
      </div>

      {/* Languages */}
      <div className="mb-4">
        <Title text="Languages" color={themeColors[3]} />
        <LanguageSection languages={resumeData.languages} accentColor={themeColors[3]} bgcolor={themeColors[2]} />
      </div>

      {/* Interests */}
      {resumeData.interests.length > 0 && resumeData.interests[0] !== "" && (
        <div className="mb-4">
          <Title text="Interests" color={themeColors[3]} />
          <div className="flex flex-wrap gap-2 mt-2">
            {resumeData.interests.map((interest, index) => (
              <span
                key={`interest_${index}`}
                className="text-xs font-medium py-1 px-3 rounded-lg"
                style={{ backgroundColor: themeColors[2] }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateTwo;
