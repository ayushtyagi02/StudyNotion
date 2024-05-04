import React from 'react'
import HighLightText from "./HighLightText"
import CTAButton from "./Button"
import KnowYourProgress from "../../../assets/Images/Know_your_progress.png"
import CompareWithOthers from "../../../assets/Images/Compare_with_others.png"
import PlanYourLessons from "../../../assets/Images/Plan_your_lessons.png"
export const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] mb-32'>
        <div className='flex flex-col gap-5 items-center'>
            <div className='text-4xl font-semibold text-center'>
                Your Swiss Knife for <HighLightText text={"Learning any language"}/>
            </div>
            <div className='text-center text-richblack-600 mx-auto text-base mt-3 w-[70%] font-medium'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus itaque nobis rem praesentium ab quam porro vitae quibusdam fuga maxime.
            </div>
             <div className='flex flex-row items-center  justify-center mt-5 ml-4'>
                  <img src={KnowYourProgress} alt="KnowYourProgress" className='object-contain -mr-32'/>
                  <img src={CompareWithOthers} alt="CompareWithOthers" className='object-contain'/>
                  <img src={PlanYourLessons} alt="PlanYourLessons" className='object-contain -ml-36'/>
             </div>
             <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div>
                        Learn More
                    </div>
                </CTAButton>
             </div>
        </div>
    </div>
  )
}
