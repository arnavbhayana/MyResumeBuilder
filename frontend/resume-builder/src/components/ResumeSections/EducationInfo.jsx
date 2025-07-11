import React from 'react'

function EducationInfo({degree,institution,duration}) {
  return (
    <div className='mb-5'>
        <h3 className='text-[15px] font-semibold text-gray-900'>{degree}</h3>
        <p className='text-gray-700 font-medium text-sm'>{institution}</p>
        <p className='text-xs text-gray-500 font-medium italic mt-0.5'>{duration}</p>
      
    </div>
  )
}

export default EducationInfo
