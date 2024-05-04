import React, { useEffect, useState } from 'react'
import {MdClose} from 'react-icons/md'
const ChipInput = ({label,name,setValue,getValue,placeholder,register,errors}) => {
    const [tags,setTags]=useState([])
    const [tag,setTag]=useState("")
    function changeHandler(e){
        e.preventDefault()
        if(tag && !tags.includes(tag)){
            setTags([...tags,tag])
            setTag("")
            
        }        
    }
    function deleteHandler(idx){
            // Filter the chips array to remove the chip with the given index
    const newChips = tags.filter((_, index) => index !== idx)
    setTags(newChips)

    }
    useEffect(()=>{
        register(name,{
            required:true,
            validate:(value) => value.length > 0
        })
    })

    useEffect(()=>{
        setValue(name,tags)
        console.log(tags)
    },[tags])
  return (

    <div>
        <label>
            <span>{label}<sup className='text-pink-200'>*</sup></span>
            {
                 tags.length > 0 && (
                       <ul className='flex w-full flex-wrap gap-y-2'>
                        
                                {
                                    tags.map((t,index)=>(
                                  <li className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5'>
                                      <span className=''>{t}</span>
                                      <button className='ml-2 focus:outline-none' onClick={()=>deleteHandler(index)}><MdClose className='text-sm'/></button>
                                  </li>
                                ))
                                }
                        </ul>
                )   
            }
            <input
            className='form-style mt-3 w-full'
            placeholder={placeholder}
            type='text'
            name={name}
            value={tag}
            onChange={(e)=>{
                setTag("")
                setTag(e.target.value)}}
            onKeyDown={(e) => {
                if (e.keyCode === 13 ) {

                  changeHandler(e);
                }
              }}
            
            />{
                errors[name] && (
                    <span className='ml-2 text-xs tracking-wide text-pink-400'>Please enter tags to proceed</span>
                )
            }
        </label>
    </div>
  )
}

export default ChipInput