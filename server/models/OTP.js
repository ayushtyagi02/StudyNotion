const mongoose = require('mongoose');
const mailSender = require('../utils/mailSEnder')
const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60*1000,
    }
});

//a function to send mails
async function sendVerifificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email, "Verification Mail from StudyNotion", otp);
        console.log('Email sent successfully', mailResponse)

    }
    catch(e){
        console.log('Error sending email',e);
        throw e;
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerifificationEmail(this.email,this.otp);
    next();
})
const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;