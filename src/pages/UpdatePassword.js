import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { updatenewPassword } from '../services/operations/authApi'
export const UpdatePassword = () => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth)
  const { token } = useParams();
  const [showPassword, setshowPassword] = useState(false)
  const [showConfirmPassword, setshowConfirmPassword] = useState(false)
  const [formData, setformData] = useState({ newPassword: "", confirmNewPassword: "" })
  const navigate= useNavigate();
  function formHandler(e) {
    e.preventDefault();
    setformData((prev) => (
      {
        ...prev, [e.target.name]: e.target.value
      }
    ))
    console.log(formData)

  }
  const { newPassword, confirmNewPassword } = formData;
  function UpdatePassword(e) {
    e.preventDefault();
    console.log("In update function after sumit")
    dispatch(updatenewPassword(token, newPassword, confirmNewPassword,navigate))
  }
  console.log(token)
  return (
    <div className=''>
      {loading ? (<div className="spinner mx-auto translate-y-[20rem]"></div>) :
        (
          <div className='w-11/12 '>
            <div className='w-1/2 mt-16  flex flex-col justify-center items-center gap-7 text-white mx-auto translate-x-6 translate-y-4 '>
          <h1 className='font-semibold leading-[2.375rem] text-richblack-5 text-[1.875rem]'>Choose new password</h1>
          <p className='my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100'> Almost done. Enter your new password and you're all set.</p>
          <form onSubmit={UpdatePassword} className='flex flex-col gap-6 w-[70%]'>
            <label className="relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={formHandler}
                placeholder="Enter Password"
                className="w-full text-richblack-800 px-3 py-3 rounded-md"
              />
              <span
                onClick={() => setshowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>
            <label className="relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                className='w-full  text-richblack-800 px-3 py-3 rounded-md'
                name='confirmNewPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmNewPassword}
                placeholder='confirm your password here..'
                onChange={formHandler}
              />
              <span
                onClick={() => setshowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-10 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>
            <button type='submit ' className='bg-yellow-50 text-richblack-800 text-xl h-12 rounded-md mt-5'>Reset Password</button>
          </form>

        </div></div>
        )

      }
    </div>
  )
}
