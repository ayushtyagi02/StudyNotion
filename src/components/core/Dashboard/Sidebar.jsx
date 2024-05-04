import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import SidebarLink from './SidebarLink'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../services/operations/authApi'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../../common/ConfirmationModal'
import { VscSignIn, VscSignOut } from 'react-icons/vsc'
const Sidebar = () => {
    const {user}=useSelector((state)=>state.profile)
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [confirmationModal,setConfirmationModal]=useState(null)
  return (
    <div>
    <div className='flex flex-col  min-w-[222px] border-r-[1px] border-r-richblack-700 h-full bg-richblack-800 py-10'>

        <div className='flex flex-col'>
        {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            )
          })}           
        </div>
        <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600'></div>
        <div className='flex flex-col'>
        <SidebarLink link={ {name: "Setting",path: "dashboard/settings"}} iconName={"VscSettingsGear"}/>
        <button
            onClick={()=>setConfirmationModal({
                text1:"Are you sure?",
                text2:"You will be logged out of your account",
                btn1Text:"Logout",
                btn2Text:"Cancel",
                btn1Handler:()=>dispatch(logout(navigate)),
                btn2Handler:()=>setConfirmationModal(null)
            }

            )} className='px-8 py-2 text-sm font-medium text-richblack-300'>
           <div className='flex items-center gap-x-2 '>
            <VscSignOut className='text-lg'/>
            <span>Logout</span>
           </div>
        </button>
        </div>
    </div>
    {confirmationModal &&  <ConfirmationModal modalData={confirmationModal}/>}


    </div>
  )
}

export default Sidebar