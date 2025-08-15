import React, { Children } from 'react'

export default function BigCard({ children }) {
  return (
    <div className='bg-[#101010] border border-[#CBF273] shadow-[0_4px_10px_rgba(203,242,115,0.1)] rounded-[33px]'>
        {children}
    </div>
  )
}