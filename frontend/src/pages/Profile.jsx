import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'


const ProfilePage = () => {
   
  const navigate = useNavigate();
  
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-6 sm:px-0 '>
    
    <div onClick={() => navigate('/')} className='cursor-pointer flex absolute top-2 sm:left-10 left-3 gap-2'>
            <img src={assets.logo} alt="" className='w-13 sm:w-15' /><span className=' text-gray-800 font-semibold sm:text-3xl text-2xl pt-4'>MiChat</span>
            </div>
            </div>
  )
}

export default ProfilePage