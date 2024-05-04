const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const mailSender = require('../utils/mailSender')
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
const jwt = require('jsonwebtoken')
// const Profile = require('../models/Profile')
//sendOTP
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        //check if user already exists
        const checkUserPresent = await User.findOne({ email: email })

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already exists'
            })
        }
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        console.log("OTP generated successfully: ", otp);

        //check if it is unique or not 
        const result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
             result=await OTP.findOne({ otp: otp });
        }
        //create an entry for OTP
        const otpPayload = { email, otp }
        const otpBody = await OTP.create(otpPayload)
     //return response 
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otpBody
        })
    }
    catch (e) {
        console.log(e),
            res.status(500).json({
                success: true,
                message: 'User cannot be registered.'
            })
    }
}
//signup
exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
        //validate
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password doesn't match"
            });
        }

        //check user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
         console.log(recentOtp[0].otp)
        //validate otp
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });

        }
        else if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //CREATE  entry in db
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            approved:true,  
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,

        })
        return res.status(200).json({
            success: true,
            message: 'User is registered successfully',
            user,
        })
    }
    catch (e) {
        console.log(e),
            res.status(500).json({
                success: false,
                message: 'User cannot be registered.'
            })
    }

}
//login
exports.login = async (req, res) => {
   try{ 
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(403).json({
            success: false,
            message: 'Please fill all fields carefully'
        })
    }
    //check if user exists
    const user = await User.findOne({ email }).populate('additionalDetails').exec();
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User doesnt exist'
        })
    }
   
    //generate JWT after password matching
    if(await bcrypt.compare(password, user.password)){
        const payload= {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        }
        console.log(user)
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h"
        });
        
        user.token = token;
        user.password = undefined;
        //create cookie 
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly: true,
        }
        res.cookie("token",token,options).status(200).json({
            success: true,
            token,
            user,
            message: "Logged in Successfully"
        })
    }
    else{
        return res.status(401).json({
            success: false,
            message:"Password Incorrect"
        })
    }
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message:"Login Failure Please try again"
        })
    }
}
//changePassword
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      console.log("in change password")
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }