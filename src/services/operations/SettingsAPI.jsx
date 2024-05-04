import { toast } from "react-hot-toast"

import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authApi"
import { setProfileLoading } from "../../slices/profileSlice"
import { useSelector } from "react-redux"
import { setToken } from "../../slices/authSlice"
const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
  } = settingsEndpoints
  export function updateProfile(token, formData) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {
        const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
          Authorization: `Bearer ${token}`,
        })
        console.log("UPDATE_PROFILE_API API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        const userImage = response.data.updatedUserDetails.image
          ? response.data.updatedUserDetails.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
        dispatch(
          setUser({ ...response.data.updatedUserDetails, image: userImage })
        )
        toast.success("Profile Updated Successfully")
      } catch (error) {
        console.log("UPDATE_PROFILE_API API ERROR............", error)
        toast.error("Could Not Update Profile")
      }
      toast.dismiss(toastId)
    }
  }
  
  export function updatePassword(token,{oldPassword,newPassword},email){
    return async(dispatch)=>{
        dispatch(setProfileLoading(true))
        const toastId = toast.loading("Updating Password...")
        try{
            const confirmNewPassword=newPassword;
            const response=await apiConnector('POST',CHANGE_PASSWORD_API,{oldPassword,newPassword,confirmNewPassword,email}, {
                Authorization: `Bearer ${token}`,
              })

            if (!response.data.success) {
                throw new Error(response.data.message)
              }
            toast.success("Password updated successfully")
        }
        catch(e){
            console.error(e)
            toast.error(e.response.data.message)
        }
        toast.dismiss(toastId)
        dispatch(setProfileLoading(false))
        
    }
  }
  export function updateDisplayPicture(token,formData){
    return async(dispatch)=>{
     try{
       const response =await apiConnector('PUT',UPDATE_DISPLAY_PICTURE_API,formData,{
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      })
      
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      console.log(response.data.data.image)
      // const userImage = response.data.data.image
      
      dispatch(
        setUser(response.data.data)
      )
      toast.success("Profile photo updated successfully")
    }
      catch(e){
        console.error(e)
        toast.error(e.response.data.message)
      }
    }
  }
  export function deleteAccount(token, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {
        const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
          Authorization: `Bearer ${token}`,
        })
        console.log("DELETE_PROFILE_API API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Profile Deleted Successfully")
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        dispatch(setUser(null))
        dispatch(setToken(null))
        navigate('/login')
      } catch (error) {
        console.log("DELETE_PROFILE_API API ERROR............", error)
        toast.error("Could Not Delete Profile")
      }
      toast.dismiss(toastId)
    }
  }