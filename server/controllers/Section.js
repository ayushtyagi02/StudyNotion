const Section = require('../models/Section')
const Course = require('../models/Course')
const mongoose = require('mongoose')
//create 
exports.createSection = async (req, res) => {
    //data fetch 
    try {
        const { sectionName, courseId } = req.body;
        if (!sectionName || !courseId) {
            return res.status(401).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const newSection = await Section.create({
            sectionName
        })
        // console.log(newSection)
        const updatedCourse = await Course.findByIdAndUpdate( courseId , { $push: { courseContent: newSection._id } }, { new: true })
        .populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

        return res.status(200).json({
            success: true,
            message: 'Section created successfully',
            updatedCourse
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Unable to create section',
            error: err.message

        })
    }
}

//update
exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId, courseId } = req.body;
        if (!sectionName || !sectionId) {
            return res.status(401).json({
                success: false,
                message: 'All fields are required'
            })
        }
       
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId}, { sectionName }, { new: true })
        // console.log(updatedSection);
        const updatedCourse = await Course.findById( courseId ).populate({path:"courseContent",populate:{path:"subSection"}})
        .populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();
        if(!updatedSection){
            return res.status(401).json({
                success: false,
                message: `No section found with this id ${sectionId}`
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Updated section successfully',
            updatedCourse
        })
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: 'Error updating section',
            error: e.message
        })
    }
}
//delete
exports.deleteSection = async (req, res) => {
    try {
        // console.log(req.params)
        console.log('req recieved')
        const  {sectionId}  = req.body;
        const { courseId } = req.body
        console.log(sectionId,courseId)
        if (!sectionId || !courseId) {
            return res.status(401).json({
                success: false,
                message: 'All fields are required'
            })
        }
       
        const deletedSection = await Section.findByIdAndDelete({_id: sectionId })
        const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();
        

        return res.status(200).json({
            success: true,
            message: 'Section Deleted successfully',
            data:course
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Unable to create section',
            error: err.message

        })
    }
}
// sections