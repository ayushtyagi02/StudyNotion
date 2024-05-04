const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto')
const bcrypt = require('bcrypt')
exports.resetPasswordToken = async (req, res) => {
    try {//get email from req body
        const email = req.body.email;
        console.log(req.body)
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: 'User does not exists'
            })
        }
        //generate token 
        const token = crypto.randomBytes(20).toString('hex');
        //update user with token and expiration 
        const updatedDetails = await User.findOneAndUpdate({ email: email }, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000
        },
            { new: true });
        //create url
        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing the url
        const mailResponse = await mailSender(email, "Password reset Link", `You can reset your password here: ${url}`)
        return res.json({
            success: true,
            message: 'Password Change Email sent successfully'
        })
    }
    catch (e) {
        console.error(e,'Error at reset password token');
        return res.status(500).json({
           success:false,
           message:'Not able to send reset password mail'

        })
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmNewPassword } = req.body;

        console.log(token, newPassword, confirmNewPassword)
        if (!token || token == undefined) {
            return res.status(401).json({
                success: false,
                message: 'Token expired , Please regenerate'
            })
        }
        if (!newPassword || !confirmNewPassword) {
            return res.status(401).json({
                success: false,
                message: 'Please fill fields correctly'
            })
        }
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(403).json({
                message: 'Invalid Token'
            })
        }
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: 'Token Expired'
            })
        }
        //hash pwd
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //password update
        const response = await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    }
    catch (e) {
        console.error(e,"Something went wrong at Reset password");
        return res.status(500).json({
          success: false,
          message: 'Something went wrong at Reset password'
        })

    }

}