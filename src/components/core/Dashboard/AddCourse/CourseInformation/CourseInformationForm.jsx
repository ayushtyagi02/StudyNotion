import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailAPI';
import ChipInput from './ChipInput';
import Upload from './Upload'
import { toast } from 'react-hot-toast'
import RequirementsField from './RequirementField';
import { setStep, setCourse } from '../../../../../slices/courseSlice'
import IconBtn from '../../../../common/IconBtn';
import { MdNavigateNext } from 'react-icons/md'
import {HiOutlineCurrencyRupee} from 'react-icons/hi'
import { IoIosArrowDropdown } from 'react-icons/io';
const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch();
  
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse,step } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])
  async function getCategories() {
    setLoading(true);
    const categories = await fetchCourseCategories()
    if (categories.length > 0) {
      setCourseCategories(categories)
    }
    setLoading(false)
  }
  useEffect(() => {
    if (editCourse) {
      setValue("courseName", course.courseName)
      setValue("courseDescription", course.courseDescription)
      setValue("price", course.price)
      setValue("tag", course.tag)
      setValue("whatYouWillLearn", course.whatYouWillLearn)
      setValue("category", course.category)
      setValue("instructions", course.instructions)
      setValue("thumbnail", course.thumbnail)
    }
    getCategories();
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseName !== course.courseName ||
      currentValues.courseDescription !== course.courseDescription ||
      currentValues.price !== course.price ||
      currentValues.tag.toString() !== course.tag.toString() ||
      currentValues.whatYouWillLearn !== course.whatYouWillLearn ||
      currentValues.category._id !== course.category._id ||
      currentValues.thumbnail !== course.thumbnail ||
      currentValues.instructions.toString() !== course.instructions.toString())
      return true
    else
      return false;
  }
  const onSubmit = async (data) => {
   console.log(editCourse,'is here')

    if (editCourse) {

      if (isFormUpdated()) {
        const currentValues = getValues()
        console.log(currentValues)
        const formData = new FormData()
        // console.log(data)
        formData.append("courseId", course._id)
        if (currentValues.courseName !== course.courseName) {
          formData.append("courseName", data.courseName)
        }
        if (currentValues.courseDescription !== course.courseDescription) {
          formData.append("courseDescription", data.courseDescription)
        }
        if (currentValues.price !== course.price) {
          formData.append("price", data.price)
        }
        if (currentValues.tag.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.tag))
        }
        if (currentValues.whatYouWillLearn !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.whatYouWillLearn)
        }
        if (currentValues.category._id !== course.category._id) {
          formData.append("category", data.category)
        }
        if (
          currentValues.instructions.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.instructions)
          )
        }
        if (currentValues.thumbnail !== course.thumbnail) {
          formData.append("thumbnail", data.thumbnail)
        }
        // console.log("Edit Form data: ", formData)
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        console.log(result,"result")
        if (result) {
          dispatch(setStep(2))
          console.log(step)
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }
    console.log(JSON.stringify(data.instructions), data.tag)
    const formData = new FormData()
    formData.append("courseName", data.courseName)
    formData.append("courseDescription", data.courseDescription)
    formData.append("price", data.price)
    formData.append("tag", JSON.stringify(data.tag))
    formData.append("whatYouWillLearn", data.whatYouWillLearn)
    formData.append("category", data.category)
    formData.append("status", "Draft")
    formData.append("instructions", JSON.stringify(data.instructions))
    formData.append("thumbnail", data.thumbnail)
    setLoading(true)
    console.log(formData)
    const result = await addCourseDetails(formData, token)
    console.log(result,'result')
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8'>
      <div>
        <label>
        <span>Course Name<sup className='text-pink-200'>*</sup></span>
          <input
            id='courseName'
            placeholder='Enter Course Title'
            {...register("courseName", { required: true })}
            className='w-full form-style mt-3' />
          {errors.courseName && (
            <span className='ml-2 text-xs tracking-wide text-pink-400'>Course Title is required</span>
          )}
        </label>
      </div>
      <div>
        <label>
          <span>Course Short Description<sup className='text-pink-200'>*</sup></span>
          <textarea
            id='courseDescription'
            placeholder='Enter Description..'
            {...register("courseDescription", { required: true })}
            className='min-h-[140px] w-full mt-3 form-style'
          />
          {errors.courseDescription && (
            <span className='ml-2 text-xs tracking-wide text-pink-400'>Course Description is required</span>
          )}
        </label>
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="price">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="price"
            placeholder="Enter Course Price"
            {...register("price", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.price && (
          <span className="ml-2 text-xs tracking-wide text-pink-400">
            Course Price is required
          </span>
        )}
      </div>
      <div className=''>
        <label className='relative' >
          <span>Course Category<sup className='text-pink-200'>*</sup></span>
          <select
           className='form-style w-full appearance-none mt-3'
           
            id='category'
            defaultValue={""}
            {...register('category', { required: true })}>
            <option value="" disabled> Choose a Category </option>
            {
              !loading && courseCategories.map((category, index) => (
                <option className='h-10' key={index} value={category?._id}>
                  <span className='p-4'>{category?.name}</span>
                </option>
              ))
            }
            
          </select>
          {errors.category && (
            <span className='ml-2 text-xs tracking-wide text-pink-400'>Please Select a Category to proceed</span>
          )}
        <IoIosArrowDropdown className='absolute right-4 top-12 text-richblack-400 text-xl'/>
        </label>
      </div>
      <div>
        <ChipInput
          label="Tags"
          name="tag"
          placeholder="Enter Tags and press Enter"
          register={register}
          errors={errors}
          setValue={setValue}
          getValues={getValues} />
      </div>
      <Upload
        register={register}
        errors={errors}
        setValue={setValue}
        label="Thumbnail"
        name="thumbnail"
      />
      <div>
        <label>
          <span>Benefits of the course <sup className='text-pink-400'>*</sup></span>
          <input
            name='whatYouWillLearn'
            placeholder='Enter Benefits of the Course'
            {...register("whatYouWillLearn", { required: true })}
            className='min-h-[100px] w-full form-style mt-3' />
            {errors.whatYouWillLearn && (
              <span className='ml-2 text-xs tracking-wide text-pink-400'>Enter benefits of the Course</span>
            )}
        </label>
      </div>
      <RequirementsField
        register={register}
        errors={errors}
        setValue={setValue}
        label="Requirements"
        name="instructions"
      />
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}

export default CourseInformationForm
