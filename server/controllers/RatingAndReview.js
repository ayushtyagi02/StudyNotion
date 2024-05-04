const RatingAndReview = require('../models/RatingAndReview')
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },

        })
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled'
            })
        }
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })
        if (alreadyReviewed) {
            return res.status(404).json({
                success: false,
                message: 'Student has already reviewed'
            })
        }
        const ratingReview = await RatingAndReview.create({
            rating: rating,
            review: review,
            user: userId,
            course: courseId
        })
        const updatedCourse = await Course.findByIdAndUpdate({ _id: courseId },
            { $push: { ratingAndReviews: ratingReview._id } },
            { new: true });
        return res.status(200).json({
            success: true,
            message: 'Rated and reviewed successfully'
        })
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

exports.getAverageRating = async(req,res)=>{
   try{
     const {courseId} = req.body

    const result = await RatingAndReview.aggregate([
        {
            $match:{
                course: new mongoose.Types.ObjectId(courseId)
            }
        },
        {
            $group:{
                _id:null,
                averageRating: {$avg:"$rating"}
            }
        }
    ])
    if(result.length > 0){
        return res.status(200).json({
            success: true,
            averageRating: result[0].averageRating
        })
    }
    return res.status(200).json({
        success: true,
        message: 'Average ratting is 0, no ratings given till',
        averageRating: 0
    })
}
    catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }

}
exports.getAllRating = async(req,res)=>{
    try{
         const allReviews = await RatingAndReview.find({}).
         sort({rating:"desc"})
         .populate({
            path:"user",
            select:"firstName lastName email image"
         }).
         populate({
            path:'course',
            select:'courseName'
         }).exec()
         return res.status(200).json({
            success: true,
            message: 'All reviews fetched successfully',
            data:allReviews
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message:e.message
        })
    }
}