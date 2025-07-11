// ThemeSelector.js
import React, { useRef, useState, useEffect } from "react";
import { resumeTemplates, themeColorPalette, DUMMY_RESUME_DATA } from "../../utils/data";
import { LuCircleCheckBig } from "react-icons/lu";
import Tabs from "../../components/Tabs";
import TemplateCard from "../../components/cards/TemplateCard";
import RenderResume from "../../components/ResumeTemplates/RenderResume";

const TAB_DATA = [{ label: "Templates" }, { label: "Color Palettes" }];

const ColorPalette = ({ colors, isSelected, onSelect }) => (
  <div
    className={`h-28 bg-purple-50 flex rounded-lg overflow-hidden border-2 ${
      isSelected ? "border-purple-500" : "border-none"
    }`}
    onClick={onSelect}
  >
    {colors.map((color, index) => (
      <div
        key={`color_${index}`}
        className="flex-1"
        style={{ backgroundColor: color }}
      ></div>
    ))}
  </div>
);

function ThemeSelector({ selectedTheme, setSelectedTheme, resumeData, onClose }) {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [tabValue, setTabValue] = useState("Templates");

  const [selectedColorPalette, setSelectedColorPalette] = useState({
    colors: selectedTheme?.colorPalette || themeColorPalette.themeOne[0],
    index: 0,
  });

  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectedTheme?.theme || resumeTemplates[0]?.id,
    index: 0,
  });

  // 🔁 Sync selection with parent on every change
  useEffect(() => {
    setSelectedTheme({
      colorPalette: selectedColorPalette.colors,
      theme: selectedTemplate.theme,
    });
  }, [selectedColorPalette, selectedTemplate]);

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);
    return () => window.removeEventListener("resize", updateBaseWidth);
  }, []);

  return (
    <div className="container mx-auto px-2 md:px-0">
      <div className="flex items-center justify-between mb-5 mt-2">
        <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />
        <button
          className="flex items-center gap-2 text-[13px] font-semibold text-purple-800 bg-purple-600/15 border border-purple-50 hover:border-purple-400 px-3 py-1.5 rounded cursor-pointer"
          onClick={onClose}
        >
          <LuCircleCheckBig className="text-[16px]" />
          Done
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5 bg-white">
          <div className="grid grid-cols-2 gap-5 max-h-[80vh] overflow-y-scroll custom-scrollbar md:pr-5">
            {tabValue === "Templates" &&
              resumeTemplates.map((template, index) => (
                <TemplateCard
                  key={`templates_${index}`}
                  thumbnailImg={template.thumbnailImg}
                  isSelected={selectedTemplate.index === index}
                  onSelect={() =>
                    setSelectedTemplate({ theme: template.id, index })
                  }
                />
              ))}

            {tabValue === "Color Palettes" &&
              themeColorPalette.themeOne.map((colors, index) => (
                <ColorPalette
                  key={`palette_${index}`}
                  colors={colors}
                  isSelected={selectedColorPalette.index === index}
                  onSelect={() =>
                    setSelectedColorPalette({ colors, index })
                  }
                />
              ))}
          </div>
        </div>

        <div
          ref={resumeRef}
          className="col-span-12 md:col-span-7 bg-white -mt-3 overflow-hidden"
        >
          <RenderResume
  key={`resume-${selectedTemplate.theme}-${selectedColorPalette.colors.join("")}`}
  templateId={selectedTemplate.theme}
  resumeData={resumeData || DUMMY_RESUME_DATA}
  containerWidth={baseWidth}
  colorPalette={selectedColorPalette.colors}
/>

        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;
