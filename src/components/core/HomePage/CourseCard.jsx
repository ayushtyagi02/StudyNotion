import React from "react";

// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

export const CourseCard = ({cardData, currCard, setcurrCard}) => {
  console.log()
  return (
    <div
      className={`w-[360px] lg:w-[30%] ${
        currCard === cardData.heading
          ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
          : "bg-richblack-800"
      }  text-richblack- h-[300px] box-border cursor-pointer   transition-all duration-200`}
      onClick={() => setcurrCard(cardData.heading)}
    >
      <div className="flex flex-col px-5 py-8 justify-between  gap-10">
        <div
          className={` ${
            currCard === cardData.heading && "text-richblack-800"
          } font-semibold text-[20px]`}
        >
          {cardData.heading}
        </div>

        <div className="text-richblack-400">{cardData.description}</div>
      </div>

      <div
        className={`flex justify-between ${
          currCard === cardData.heading ? "text-blue-300" : "text-richblack-300"
        } px-6 py-3 font-medium`}
      >
        {/* Level */}
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData.level}</p>
        </div>

        {/* Flow Chart */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{cardData.lessionNumber} Lession</p>
        </div>
      </div>
    </div>
  );
};
