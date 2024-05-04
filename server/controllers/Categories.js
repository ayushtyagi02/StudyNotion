const Categories = require('../models/Categories');

exports.createCategories= async (req,res) =>{
    try{const {name, description}= req.body;
    if(!name){
        return res.status(401).json({
            success: false,
            message:'Fill all fields carefully',
        })
    }
    const categories= await Categories.create({
        name: name,
        description: description
    })

    return res.status(200).json({
        success: true,
        message:"Category created successfully"
    })}
    catch(e){
        console.error(e);
        return res.status(500).json({
            success: false,
            message:'Something went wrong while creating Category',
        })

    }
};

exports.getAllCategories = async (req,res)=>{
    try{
        const categories = await Categories.find({},{name:true, description:true});
        return res.status(200).json({
            message:"Categories fetched successfully",
            success:true,
            categories

        })

    }
    catch(e){
        return res.status(500).json({
            message:"Something went wrong",
            success:false
        })

    }
}
exports.categoryPageDetails = async (req,res)=>{
    try{
        const {categoryId}= req.body;
        const selectedCategory = await Categories.findById(categoryId).populate("course").exec();
       
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:'Category not found'
            })
        }
        if(selectedCategory.length===0){
            return res.status(404).json({
                success:true,
                message:'No courses fund for selected category'
            })

        }
        const selectedCourses = selectedCategory.course;

        const categoriesExceptSelected = await Categories.find({
            _id:{ $ne: categoryId},
        }).populate("course").exec();
        let differentCourses = [];
        for( const category of categoriesExceptSelected){
            differentCourses.push(...category.course);
            
        }
        const allCategories = await Categories.find().populate({
            path: "course",
            populate: {
              path: "instructor",
            },
          })
        const allCourses = allCategories.flatMap((category)=> category.course); 
        const mostSellingCourses = allCourses.sort((a,b) => b.sold - a.sold).slice(0,10);
       
        return res.status(200).json({
            selectedCategory,
            selectedCourses: selectedCourses,
            differentCourses: differentCourses,
            mostSellingCourses: mostSellingCourses 
        })
}     
catch(e){
    return res.status(500).json({
        message:e.message,
        success:false
    }) 

}
}