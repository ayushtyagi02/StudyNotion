import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { resetCourseState, setStep } from '../../../../../slices/courseSlice'
import IconBtn from '../../../../common/IconBtn'

import { editCourseDetails } from '../../../../../services/operations/courseDetailAPI'
import { useNavigate } from 'react-router-dom'


const PublishCourseForm = () => {
   const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
      } = useForm()
      useEffect(()=>{
        if(course.status === 'Published'){
          setValue("public",true)
        }
      },[])
      const { course } = useSelector((state) => state.course)
      const { token } = useSelector((state) => state.auth)
      const [loading, setLoading] = useState(false)
      const dispatch = useDispatch()
      const onSubmit = async ()=>{
        if ( course.status === 'Published' && getValues("public")===true || ( course.status === 'Draft' && getValues("public")===false)){
          dispatch(resetCourseState())
          console.log('in if')
          //navigate to my courses
          return
        }
        const formData = new FormData()
        formData.append("courseId", course._id)
        const status = getValues("public") ? 'Published' : 'Draft'
        formData.append("status", status)
        setLoading(true)
        const result = await editCourseDetails(formData,token)
        if(result){
          navigate("/dashboard/my-courses")
          dispatch(resetCourseState())
        }
        setLoading(false)
      }
  return (
    
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this course as public
            </span>
          </label>
        </div>

        {/* Next Prev Button */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={()=>dispatch(setStep(2))}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          <IconBtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  )
}

export default PublishCourseForm