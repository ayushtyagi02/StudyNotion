import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import Course_Card from './Course_Card';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';


// import required modules
import { FreeMode, Pagination } from 'swiper/modules'
const CourseSlider = ({Courses}) => {
    console.log(Courses)
  return (
    <div>
        {
            Courses?.length > 0 && (
                <>
                  <Swiper
                   slidesPerView={3}
                   spaceBetween={30}
                   freeMode={true}
                   pagination={{
                     clickable: true,
                   }}
                   modules={[FreeMode, Pagination]}
                   className="mySwiper">
                  {
                    Courses.map((course,index)=>(
                   
                      <SwiperSlide key={index}>
                        <Course_Card course={course} Height={"h-[250px]"}/>
                      </SwiperSlide>
                    ))
                   }
                  </Swiper>
                   
                </>
            )
        }
    </div>
  )
}

export default CourseSlider