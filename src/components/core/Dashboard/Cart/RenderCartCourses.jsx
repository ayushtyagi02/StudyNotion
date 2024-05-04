import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from 'react-stars'
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
import { removeFromCart } from '../../../../slices/cartSlice';
import { getAverageRatings } from '../../../../services/operations/profileAPI';
import { RiDeleteBin6Line } from 'react-icons/ri';
const RenderCartCourses = () => {
    const dispatch=useDispatch()
    const cart=useSelector((state)=>state.cart)
    async function getRatings(courseId){
        return await getAverageRatings(courseId)
    }
    function addRatings(){
        cart.map((course)=>(
            course.avgRating=getRatings(course._id)
        ))
    }
  return (
    <div>
        {
            cart.map((course,index)=>(
                <div>
                    <div>
                        <img src={course?.thumbnail}/>
                        <div>
                            <p>{course?.courseName}</p>
                            <p>{course?.category?.name}</p>
                            <div>
                                <span>{course.avgRating || 4.5}</span>
                                <ReactStars
                                count={5}
                                size={20}
                                edit={false}
                                activeColor='#ffd700'
                                emptyIcon={<MdOutlineStarBorder/>}
                                fullIcon={<MdOutlineStar/>}/>
                                <span>{course?.ratingAndReviews?.length}</span>
                            </div>
                        </div>

                    </div>
                    <div>
                        <button onClick={()=>dispatch(removeFromCart())}>
                            <RiDeleteBin6Line/>
                            <span>Remove</span>
                        </button>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default RenderCartCourses