import React from 'react'
import { HomePageExplore } from '../../../data/homepage-explore'
import { useState } from 'react'
import {CourseCard} from './CourseCard'
import HighLightText from './HighLightText'
const tabName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]
export const ExploreMore = () => {
    const [currentTab, setcurrentTab] = useState(tabName[0]);
    const [courses, setcourses] = useState(HomePageExplore[0].courses);
    const [currCard, setcurrCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyTab = (value) => {
        setcurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag == value);
        setcourses(result[0].courses);
        setcurrCard(result[0].courses[0].heading)
        // console.log(currCard);
    }
    return (
        <div>
            <div className='font-semibold text-4xl text-center '>
                Unlock the <HighLightText text={"Power of Code"} />
            </div>
            <p className='text-richblack-300 text-center text-sm mt-3'>
                Learn to build anything you can imagine
            </p>
            <div className='flex flex-row  rounded-full bg-richblack-800 mb-5 border-richblack-100 mt-5 px-1 py-1 '>
                {
                  tabName.map((element, index) => {
                    return(
                        <div 
                        className={`text-[16px] flex flex-row items-center gap-3 ${element === currentTab ? "bg-richblack-900 text-richblack-5 font-medium" : " text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                        key={index}
                        onClick={()=>setMyTab(element)}>
                            {element}
                        </div>
                    )
                })}
            </div>
            <div className='lg: h-[150px] '></div>

            {/* //course card group */}
            <div className=' lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3'>
                {
                    courses.map((element,index)=>{
                        return(
                            <CourseCard
                            key={index}
                            cardData={element}
                            currCard={currCard}
                            setcurrCard={setcurrCard}/>
                        )
                    })
                }
            </div>
        </div>
    )
}  
