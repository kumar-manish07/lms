import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Youtube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'

const Player = () => {

  const {enrolledCourses, calculateChapterTime} = useContext(AppContext)
  const {courseId} = useParams()
  const [courseData,setCourseData] = useState(null)
  const [openSections,setOpenSections] = useState({})
  const [playerData,setPlayerData] = useState(null)

  const getCourseData = ()=>{
    enrolledCourses.map((course)=>{
      if(course._id === courseId){
        setCourseData(course)
      }
    })
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  useEffect(()=>{
    getCourseData()
  }, [enrolledCourses])

  return (
     <>
     <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
       
       {/* left column */}
       <div className='text-gray-800'>
        <h2 className='text-xl font-semibold'>Course Structure</h2>

        <div className='pt-5'>
                    { courseData && courseData.courseContent.map((chapter, index) => (
                      <div key={index} className='border border-gray-300 bg-white mb-3 rounded overflow-hidden'>
                        {/* Chapter Header */}
                        <div
                          className='flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-gray-50 hover:bg-gray-100'
                          onClick={() => toggleSection(index)}
                        >
                          <div className='flex items-center gap-2'>
                            <img
                              className={`transition-transform duration-200 w-4 ${
                                openSections[index] ? 'rotate-180' : ''
                              }`}
                              src={assets.down_arrow_icon}
                              alt='arrow icon'
                            />
                            <p className='font-medium text-sm md:text-base'>{chapter.chapterTitle}</p>
                          </div>
                          <p className='text-sm text-gray-600'>
                            {chapter.chapterContent.length} lectures – {calculateChapterTime(chapter)}
                          </p>
                        </div>
        
                        {/* Lecture List */}
                        <div
                          className={`transition-all duration-300 ${
                            openSections[index] ? 'max-h-[1000px] py-2' : 'max-h-0'
                          } overflow-hidden border-t border-gray-200`}
                        >
                          {chapter.chapterContent.map((lecture, i) => (
                            <div
                              key={i}
                              className='flex items-center justify-between px-6 py-2 text-sm text-gray-700'
                            >
                              <div className='flex items-center gap-2 py-1'>
                                <img src={false ? assets.blue_tick_icon : assets.play_icon} alt='play icon' className='w-4 h-4 mt-1' />
                                <p>{lecture.lectureTitle}</p>
                              </div>
        
                              <div className='flex gap-3 items-center text-xs'>
                                {lecture.lectureUrl && (
                                  <span onClick={()=> setPlayerData({
                                    ...lecture, chapter: index + 1, lecture: i + 1
                                  })} className='text-blue-600 font-medium cursor-pointer'
                                  > Watch</span>
                                )}
                                <span className='text-gray-500'>
                                  {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                    units: ['h', 'm']
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
        </div>

        <div className='flex items-center gap-2 py-3 mt-10'>
          <h1 className='text-xl font-bold'>Rate this Course:</h1>
          <Rating initialRating={0}/>
        </div>

       </div>

       {/* right column */}
       <div className='md:mt-10'>
        {
          playerData ? (
            <div>
              <Youtube videoId={playerData.lectureUrl.split('/').pop()} iframeClassName='w-full aspect-video'/>
              <div className='flex justify-between items-center mt-1'>
                <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                <button className='text-blue-600'>{false ? 'Completed' : 'Mark Complete'}</button>
              </div>
            </div>
          )
          :
          <img src={courseData ? courseData.courseThumbnail : ''} alt=''/>
        }
       </div>

     </div>

     <Footer />

     </>
  )
}

export default Player
