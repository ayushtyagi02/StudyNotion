import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { sendOtp, signUpUser } from '../services/operations/authApi';
import OtpInput from 'react-otp-input';
export const VerifyEmail = () => {
    const {signupData,loading}= useSelector((state)=>state.auth);
    const [otp, setOtp] = useState('');
    const dispatch= useDispatch();
    const navigate = useNavigate();
   
    useEffect(()=>{
      if(!signupData){
        navigate('/signup')
      }
    },[])
    const {firstName,lastName,email,password,confirmPassword,accountType}=signupData
    function formHandler(e){
      
      e.preventDefault();
      dispatch(signUpUser(navigate,firstName,lastName,email,password,confirmPassword,accountType,otp))

    }
  return (
    <div className='  mx-auto place-items-center '>
    {
      loading ? (<div className=' spinner mx-auto mt-[20rem]'></div>) :

       ( <div className='w-11/12 flex flex-col items-center justify-center mt-[10rem] gap-2  mx-auto'>
            <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the code below
          </p>
          <form className='flex flex-col items-center gap-4 mt-4' onSubmit={formHandler}>
          <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  inputNum
                  type='password'
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
                <button type='submit' className='mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900 w-[50%]'>Verify Email</button>
          </form>
          <div className="mt-6 flex items-center justify-between w-1/2">
            <Link to="/signup">
              <p className="text-richblack-5 flex items-center gap-x-2">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            <button
              className="flex items-center text-blue-100 gap-x-2"
              onClick={() => dispatch(sendOtp(signupData.email))}
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
          
    </div>
  )
}
