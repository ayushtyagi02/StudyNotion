import React, { useState } from 'react'
import { FiDelete, FiTrash2 } from 'react-icons/fi'
import { deleteAccount } from '../../../../services/operations/SettingsAPI'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../../../common/ConfirmationModal'

const DeleteAccount = () => {
    const [confirmationModaldata,setConfirmationModal]=useState(null)
    const navigate=useNavigate();
    const dispatch=useDispatch()
    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile)
    return (
        <div>
            <div className='flex items-center justify-between rounded-md border-[1px] gap-x-4 opacity-50 border-pink-700 bg-pink-900  p-4 px-8 mt-8 '>
                <div className='text-lg bg-pink-300 rounded-full aspect-square p-4 '>
                    <FiTrash2 />
                </div>

                <div className='flex flex-col gap-4 items-start justify-items-start w-11/12 m-3'>
                    <h2>Delete Account</h2>
                    <div className='text-sm font-thin opacity-70'>
                        <p>Would you like to delete account?</p>
                        <p>This account may contain Paid Courses. Deleting your account is
                            permanent and will remove all the contain associated with it.</p>
                    </div>
                    <button className='text-pink-200 italic' onClick={()=>setConfirmationModal(
                        {
                        text1:"You are deleting your account",
                        text2:"Are you sure?",
                        btn1Text:"Delete",
                        btn2Text:"Cancel",
                        btn1Handler:()=>dispatch(deleteAccount(token,navigate)),
                        btn2Handler:()=>setConfirmationModal(null) 
                        }

                    )}>I want to delete my account</button>
                </div>
            </div>
           {confirmationModaldata && <ConfirmationModal modalData={confirmationModaldata}/>}
        </div>

    )
}

export default DeleteAccount