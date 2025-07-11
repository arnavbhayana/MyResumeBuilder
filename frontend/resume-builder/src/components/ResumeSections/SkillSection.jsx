import React from 'react';
import Progress from '../Progress';

const SkillInfo = ({ skill, progress, accentColor, bgcolor }) => {
  return (
    <div className='flex items-center justify-between'>
      <p className='text-[12px] font-semibold text-gray-900'>{skill}</p>
      {progress > 0 && (
        <Progress
          progress={(progress / 100) * 5}
          color={accentColor}
          bgColor={bgcolor}
        />
      )}
    </div>
  );
};

function SkillSection({ skills, accentColor, bgcolor }) {
  return (
    <div className='grid grid-cols-2 gap-x-5 gap-y-1 mb-5'>
      {skills?.map((skill, index) => (
        <SkillInfo
          key={`skill_${index}`}
          skill={skill.name}
          progress={skill.progress}
          accentColor={accentColor}
          bgcolor={bgcolor}
        />
      ))}
    </div>
  );
}

export default SkillSection;
