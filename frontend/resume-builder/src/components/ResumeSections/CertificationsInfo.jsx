import React from 'react'

function CertificationsInfo({title,issuer,year,bgcolor}) {
  return (
    <div className=''>
        <h3 className='text-[15px] font-semibold text-gray-900'>{title}</h3>
        <div className='flex items-center gap-2'>
            {year &&(
                <div
                className='text-[11px] font-bold text-gray-800 px-3 py-0.5 inline-block mt-2 rounded-lg'
                style={{backgroundColor:bgcolor}}>
                    {year}
                </div>
            )}
            <p className='text-[12px] text-gray-700 font-medium mt-1'>{issuer}</p>
        </div>
      
    </div>
  )
}

export default CertificationsInfo
