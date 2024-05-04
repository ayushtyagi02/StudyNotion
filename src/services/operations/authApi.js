import { apiConnector } from "../apiConnector";
import {toast} from 'react-hot-toast'
import { setLoading, setToken} from '../../slices/authSlice'
import { endpoints } from "../apis";
import { setUser } from "../../slices/profileSlice";
import { resetCart } from "../../slices/cartSlice";
const {RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  SENDOTP_API,SIGNUP_API,LOGIN_API}= endpoints;


export function sendOtp(email,navigate){
  return async (dispatch)=>{
     dispatch(setLoading(true));
    try{
       const response = await apiConnector('POST',SENDOTP_API,{email});
     if(!response.data.success) {
      toast.error(response.data.message)
      throw new Error(response.data.message);
    }
    toast.success("Otp sent successfully")
    navigate('/verify-otp')}
    catch(e){
      console.log(" Error", e);
      toast.error(e.response.data.message);
      navigate('/login')
    }
   dispatch( setLoading(false))
  }
}
export function signUpUser(navigate,
  firstName, lastName, email, password, 
  confirmPassword,accountType,otp){
  return async(dispatch)=>{
    dispatch(setLoading(true))
    try{
   
      const response = await apiConnector('POST',SIGNUP_API,{firstName,lastName,email,password,confirmPassword,accountType,otp})
      
      if(!response.data.success) {
        throw new Error(response.data.message);
      }
      navigate('/login')
      toast.success("Account Created Successfully");
    }
    catch(err){
      console.log("Signup Error", err);
      toast.error(err.response.data.message);
    }
    dispatch(setLoading(false))
  }
}
export function login(email,password,navigate){
  return async(dispatch)=>{
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST",LOGIN_API,{email,password})
      if(!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Login Succesfull");
      console.log(response)
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate('./dashboard-myprofile')
    }
    catch(error) {
      console.log("Login Error", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false))
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}
export function getResetPasswordToken(email,setemailsent){
    
    return async(dispatch) => {
        dispatch(setLoading(true));
        
        try{
          const response = await apiConnector("POST", RESETPASSTOKEN_API, {email,})
    
    
          if(!response.data.success) {
            throw new Error(response.data.message);
          }
    
          toast.success("Reset Email Sent");
          setemailsent(true);
        }
        catch(error) {
          console.log("RESET PASSWORD TOKEN Error", error);
          toast.error(error.response.data.message);
        }
        dispatch(setLoading(false));
      }


}
export function updatenewPassword(token, newPassword, confirmNewPassword,navigate) {
  // const dispatch =useDispatch()
 return async (dispatch) =>{
   dispatch(setLoading(true));
   try{
      const response = await apiConnector("POST", RESETPASSWORD_API, {newPassword, confirmNewPassword, token});



      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    navigate('/login')

 }   
}