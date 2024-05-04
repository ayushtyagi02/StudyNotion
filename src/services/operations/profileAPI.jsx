import {toast} from 'react-hot-toast'
import {profileEndpoints} from '../apis'
import { apiConnector } from '../apiConnector';

const {GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API,
    GET_AVERAGE_COURSE_RATING_}=profileEndpoints;
export async function getUserEnrolledCourses(token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
      console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
      const response = await apiConnector(
        "GET",
        GET_USER_ENROLLED_COURSES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
      // console.log(
      //   "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
      //   response
      // )
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      result = response.data.data
    } catch (error) {
      console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
      toast.error("Could Not Get Enrolled Courses")
    }
    toast.dismiss(toastId)
    return result
  }
  export async function getAverageRatings(courseId){
    const toastId = toast.loading("Loading...")
    let result=null
    try{
        const response= await apiConnector('GET',GET_AVERAGE_COURSE_RATING_,{courseId})
        if (!response.data.success) {
            throw new Error(response.data.message)
          }
        result = response.data.averageRating

    }
    catch (error) {
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
        toast.error("Could Not Get Enrolled Courses")
      }
      toast.dismiss(toastId)
      return result
  }
  export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...");
    let result = [];
    try{
      const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, 
      {
        Authorization: `Bearer ${token}`,
      })
  
      console.log("GET_INSTRUCTOR_API_RESPONSE", response);
      result = response?.data?.courses
  
    }
    catch(error) {
      console.log("GET_INSTRUCTOR_API ERROR", error);
      toast.error("Could not Get Instructor Data")
    }
    toast.dismiss(toastId);
    return result;
  }