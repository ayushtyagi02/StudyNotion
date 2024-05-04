import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import IconBtn from "../../../common/IconBtn"
import { updatePassword } from '../../../../services/operations/SettingsAPI'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
const UpdatePassword = () => {
    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile)
    const navigate = useNavigate()
  const dispatch = useDispatch()
  const {loading}=useSelector((state)=>state.profile)
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm()
      const [passwordChanged,setPasswordChanged]=useState(false)
      
      const submitPasswordform = async (data) => {
        // console.log("Form Data - ", data)
        try {
          dispatch(updatePassword(token,data,user.email))
          setPasswordChanged(true)
          data=null;
        } catch (error) {
          console.log("ERROR MESSAGE - ", error.message)
        }
      }

      
  return (
    <>
    <form 
    onSubmit={handleSubmit(submitPasswordform)}
    >
      {/* Profile Information */}
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">
          Password
        </h2>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="oldPassword" className="lable-style">
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter current Password"
              className="form-style"
              {...register("oldPassword", { required: true })}
              defaultValue={null}
            />
            {errors.oldPassword && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter current password
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="newPassword" className="lable-style">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter new password"
              className="form-style"
              {...register("newPassword", { required: true })}
              defaultValue={null}
            />
            {errors.newPassword && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter new password.
              </span>
            )}
          </div>
        </div>

        

        
      </div>

      <div className="flex justify-end gap-2">
       
        <IconBtn type="submit" text="Update" />
      </div>
    </form>
  </>
  )
}

export default UpdatePassword