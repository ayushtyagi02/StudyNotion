const SubSection = require('../models/SubSection')
const Section = require('../models/Section')
const {imageUpload} = require('../utils/imageUploader')
const Course = require('../models/Course')
require('dotenv').config()
exports.createSubSection = async(req,res)=>{
    try{
        const { title,timeDuration, description, sectionId, courseId } = req.body
        const video = req.files.video;
        console.log(title,timeDuration, description, sectionId , video)
        if(!sectionId || !title  || !description || !video ){
           return res.status(401).json({
               message:'Please enter all fields',
               success:false
           })
        }
        console.log(video)
        const courseVideo = await imageUpload(video,process.env.FOLDER_NAME);
        console.log(courseVideo)
        const newSubSection = await SubSection.create({
           title,
           timeDuration: `${courseVideo.duration}`,
           description,
           videoUrl: courseVideo.secure_url

        })

        //add the new SubSection to Section 
        const updatedSection =await Section.findByIdAndUpdate({_id:sectionId},{$push:{subSection:newSubSection._id}},{new:true})
        const updatedCourse = await Course.findById(courseId).populate({path:"courseContent",populate:{path:"subSection"}}).exec()
        return res.status(200).json({
           message:'SubSection Created Succcessfully',
           success:true,
           data:updatedCourse
       })
   }
   catch(e){
    console.error(e, "error creating section")
       return res.status(500).json({
           message:'Something went wrong',
           success:false
       })

   }
};

//TODO:-
//Update SubSection
//Delete SubSection
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.videoFile !== undefined) {
        const video = req.files.videoFile
        console.log("this is a video",video)
        const uploadDetails = await imageUpload(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
      console.log("updated section", updatedSection)
  
      return res.json({
        success: true,
        message: "Section updated successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }
  
  exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }