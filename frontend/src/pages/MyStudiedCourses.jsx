import React from 'react'
import CourseBG from "/courcebg.png"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Library, GraduationCap, Clock, BookOpen, ChevronRight } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const MyStudiedCourses = () => {
	const courseData = useSelector((store) => store.course.courses);
	const navigate = useNavigate();
	
	return (
		<div className='flex-1 mt-20 bg-[#f8fafc] min-h-screen py-10 px-4 md:px-8 lg:px-12'>
			{/* Header Section */}
			<motion.div 
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className='flex items-center gap-3 mb-10'
			>
				<div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
					<Library className="w-6 h-6 text-white" />
				</div>
				<div>
					<h2 className='text-3xl font-black text-slate-900 tracking-tight'>My Studied Courses</h2>
					<p className="text-slate-500 text-sm font-medium mt-1">Review your academic history and completed modules</p>
				</div>
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8'>
				{courseData?.map((data, index) => {
					return (
						<motion.div 
							key={data._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className='group bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-fit'
						>
							{/* Card Header/Banner */}
							<div className='relative h-28 overflow-hidden'>
								<img className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110' src={CourseBG} alt="Course" />
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
								
								<div className="absolute bottom-4 left-6 right-6">
									<div className="flex items-center gap-2 mb-1">
										<span className="text-white/80 text-[11px] font-bold flex items-center gap-1">
											<Clock className="w-3 h-3" />
											{data.creditHours} Credits
										</span>
									</div>
									<h3 className="text-white text-lg font-black tracking-tight leading-tight line-clamp-1">
										{data.courseName}
									</h3>
								</div>
							</div>

							{/* Instructor Info */}
							<div className='p-6 flex items-start gap-4'>
								<div className="relative shrink-0">
									<img 
										className='h-14 w-14 rounded-2xl object-cover ring-4 ring-slate-50 shadow-md group-hover:ring-indigo-50 transition-all' 
										src={data.instructor.profilePicture} 
										alt="Instructor" 
									/>
								</div>
								<div className='flex flex-col'>
									<span className='text-sm font-black text-slate-900 leading-tight'>{data.instructor.name}</span>
									<span className='text-[10px] font-bold text-indigo-600 mt-1 uppercase tracking-wider'>{data.instructor.degree}</span>
									<p className='text-[11px] font-medium text-slate-400 mt-2 line-clamp-2 leading-relaxed'>
										{data.description}
									</p>
								</div>
							</div>

							{/* Footer Action */}
							<div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<BookOpen className="w-4 h-4 text-slate-400" />
									<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</span>
								</div>
								<motion.button 
									whileHover={{ x: 3 }}
									onClick={() => navigate(`/course/${data._id}/viewcourse`)}
									className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest hover:text-indigo-700 transition-colors"
								>
									View Course
									<ChevronRight className="w-4 h-4" />
								</motion.button>
							</div>
						</motion.div>
					)
				})}
			</div>

			{(!courseData || courseData.length === 0) && (
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="py-20 flex flex-col items-center justify-center bg-white rounded-[40px] border-2 border-dashed border-slate-200"
				>
					<BookOpen className="w-16 h-16 text-slate-100 mb-4" />
					<p className="text-slate-400 font-black text-lg uppercase tracking-widest">No History Found</p>
					<p className="text-slate-300 text-sm mt-1">Enroll in courses to build your academic history.</p>
				</motion.div>
			)}
		</div>
	)
}

export default MyStudiedCourses
