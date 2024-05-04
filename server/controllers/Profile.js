const Profile = require('../models/Profile');
const CourseProgress= require('../models/CourseProgress')
const User = require('../models/User');
const { imageUpload } = require('../utils/imageUploader');
const {convertSecondsToDuration} = require('../utils/secToDuration');
const Course = require('../models/Course');
exports.updateProfile = async (req, res) => {
    try {
        const { gender, dateOfBirth = "", contactNumber, about = "" } = req.body;
        const userId = req.user.id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User Id not found'
            })
        }
        if (!gender || !contactNumber) {
            return res.status(401).json({
                success: false,
                message: 'fill all field properly'
            })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found with id'
            })
        }
        const profile = user.additionalDetails;
        // console.log(typeof(profile))
        const profileDetails = await Profile.findByIdAndUpdate({ _id: profile._id }, {
            gender: gender,
            dateOfBirth: dateOfBirth,
            contactNumber: contactNumber,
            about: about
        })
        const updatedUserDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec()
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            updatedUserDetails
        })


    }
    catch (e) {
        console.error('Error at update profile')
        return res.status(500).json({
            success: false,
            message: e.message
        })

    }
}
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not found with id'
            })
        }
        const user = await User.findById(userId);
        const profile = user.additionalDetails;
        await Profile.findByIdAndDelete({ _id: profile });
        //remove the user from enrolled students array
        //prototype(as given in hw):-
        const enrolledCourses = user.enrolledCourses
        if (enrolledCourses) {
            let i = 0;
            while (enrolledCourses.length > i) {
                let courseDetail = enrolledCourses[i];
                await Course.findByIdAndUpdate(courseDetail, {
                    $pull: { studentsEnrolled: userId }
                }, { new: true }
                )
                i++;
            }
        }

        //Delete User
        await User.findByIdAndDelete({ _id: userId });
        return res.status(200).json({
            success: true,
            message: 'User Deleted Successfully'
        })
    }
    catch (e) {
        console.error(e,'error at delete profile')
        return res.status(500).json({
            success: false,
            message: 'User deletion failed'
        })
    }
}


exports.getAllProfiles = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not found with id'
            })
        }
        const profileData = await User.findById(userId).populate("additionalDetails").exec()

        return res.status(200).json({
            success: true,
            message: 'User found',
            profileData
        })
    }
    catch (e) {
        console.error('Error at getAllProfiles')
        return res.status(500).json({
            success: true,
            message: e.message,
        })
    }
}
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await imageUpload(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      console.log(userDetails.courses[0].courseContent[0].subSection[0],"User Details hereeee")
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id })
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: error.message })
    }
  }