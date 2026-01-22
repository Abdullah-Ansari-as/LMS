import React from 'react'
import courseBG from "/courcebg.png"
import {useSelector} from "react-redux"


const MyStudiedCourses = () => {

	const courseData = useSelector((store) => store.course.courses);
	
	return (
		<div className='flex-1 mt-14 md:mt-18 bg-[#F2F3F8] h-auto py-8 px-3 md:px-7'>
			<div className='flex items-center mb-10'>
				<span className='text-2xl'>My Studied Courses</span>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-10'>
				{
					courseData?.map((data) => {
						return (
							<div key={data._id} className='h-70 bg-white shadow-gray-500 shadow-[5px_5px_16px_-1px_rgba(0,0,0,0.2)]'>

								<div className='relative group  w-full overflow-hidden'>
									<img className='h-24 w-full object-cover ' src={courseBG} alt="courseBgImg" />
									{/* Hover Overlay */}
									<div className="absolute inset-0 bg-black/8 opacity-0 group-hover:opacity-100 transition " />

									<div className="absolute inset-0 flex ml-6 justify-center flex-col ">
										<h3 className="text-white text-lg font-semibold">
											{data.courseName}
										</h3>
										<p className='text-gray-300 text-sm mb-0.5'>{data.description.length < 63 ? data.description : data.description.slice(0, 65)+"..."}</p>
										<p className='text-gray-300 text-sm'>{data.creditHours} Credit Hour(s)</p>
									</div>
								</div>

								<div className='flex'>
									<div className='p-6 mr-3'>
										<img className='h-[124px] w-26 rounded-lg border p-1 border-gray-400' src={data.instructor.profilePicture} alt="" />
									</div>
									<div className='flex py-7 flex-col gap-1'>
										<span className='text-sm font-semibold text-black'>{data.instructor.name}</span>
										<span className='text-xs text-black'>{data.instructor.degree}</span>
										<span className='text-xs text-black'>{data.instructor.university}</span>
									</div>
								</div>
  
							</div>
						)
					})
				}
			</div>

		</div>
	)
}

export default MyStudiedCourses
