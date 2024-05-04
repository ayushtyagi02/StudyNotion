const jwt = require('jsonwebtoken')

require('dotenv').config();
const User= require('../models/User');

//auth
exports.auth=async (req,res,next)=>{
    try{
        // console.log('token-', req.header("Authorization"));
        const authHeader = req.header("Authorization");
       
        
        const token =req.cookies.token || req.body.token ||  authHeader.replace("Bearer ", "");
        
      if(!token || token == undefined){
        return res.status(401).json({
            success: false,
            message: 'Token Missing'
        })
      }
      try{
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decode;
        console.log("decode",decode)
      }catch(err){
        console.error(err,'Error occured at verifying auth token')
        return res.status(401).json({
            success:false,
            message:'Token Invalid'
        })
      }
      next();
    }
    catch(err){
        console.log('error at auth checkin')
        return res.status(401).json({
            success:false,
            message:err.message
        })

    }
};

exports.isStudent = async (req,res,next)=>{
    try{
        console.log(req.user)
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: true,
                message: 'This is  a protected route for students'
            })
        }
        next();
    }
    catch(err){
        console.log(err,'Error at Verifying student')
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching'
        })

    }
}

exports.isAdmin = async (req,res,next)=>{
    try{
        console.log(req.user)
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: true,
                message: 'This is  a protected route for Admin'
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching'
        })

    }
};
exports.isInstructor = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: true,
                message: 'This is  a protected route for Instructor'
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching'
        })

    }
};