import CourseBG from "/courcebg.png"
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllCourses, fetchSubmittedAssignments, fetchSubmittedQuizes } from '../api/courseApi';
import { setCourses } from '../redux/slices/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  BookOpen, 
  Users, 
  HelpCircle, 
  History, 
  Bell, 
  GraduationCap, 
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight
} from "lucide-react";

const Home = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const courseData = useSelector((store) => store.course.courses);
	const [submittedAssignments, setSubmittedAssignments] = useState([]);
	const [submittedQuizzes, setSubmittedQuizzes] = useState([]);
	const [seenAnnouncements, setSeenAnnouncements] = useState(() => {
		const saved = localStorage.getItem('seenAnnouncements');
		return saved ? JSON.parse(saved) : {};
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [courseRes, assigRes, quizRes] = await Promise.all([
					getAllCourses(),
					fetchSubmittedAssignments(),
					fetchSubmittedQuizes()
				]);

				if (courseRes.success) {
					dispatch(setCourses(courseRes.allCourses));
				}
				if (assigRes.success) {
					setSubmittedAssignments(assigRes.submittedAssignments);
				}
				if (quizRes.success) {
					setSubmittedQuizzes(quizRes.submittedQuizes);
				}
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.error(error);
			}
		};
		fetchData();
	}, [dispatch]);

	const markAnnouncementsAsSeen = (courseId, announcementIds) => {
		const updated = { ...seenAnnouncements, [courseId]: announcementIds };
		setSeenAnnouncements(updated);
		localStorage.setItem('seenAnnouncements', JSON.stringify(updated));
	};

	if(loading) {
		return (
			<div className="flex-1 flex items-center justify-center bg-[#f8fafc] h-full min-h-[80vh]">
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex flex-col items-center gap-4"
				>
					<Loader2 className="h-10 w-10 animate-spin text-indigo-600"/>
					<span className="text-slate-500 font-medium animate-pulse">Loading your courses...</span>
				</motion.div>
			</div> 
		)
	}

	return (
		<div className='flex-1 mt-20 bg-[#f8fafc] min-h-screen py-10 px-4 md:px-8 lg:px-12'>
			{/* Welcome Header */}
			<motion.div 
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				className='flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4'
			>
				<div>
					<h2 className='text-3xl font-black text-slate-900 tracking-tight'>My Dashboard</h2>
					<div className='flex items-center gap-2 mt-2'>
						<div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100 flex items-center gap-1.5">
							<Calendar className="w-3.5 h-3.5" />
							Spring 2025 Semester
						</div>
						<div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">
							Active Academic Year
						</div>
					</div>
				</div>
				
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-slate-500">Quick Stats:</span>
					<div className="flex -space-x-2">
						{[1,2,3].map(i => (
							<div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
						))}
						<div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
							+{courseData?.length || 0}
						</div>
					</div>
				</div>
			</motion.div>

			{/* Course Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8'>
				<AnimatePresence>
					{courseData && courseData.map((data, index) => { 
						const unsubmittedAssignments = data.assignments.filter(
							(a) => !submittedAssignments.some((s) => s.assignmentId === a || s.assignmentId?._id === a)
						).length;
						
						const unsubmittedQuizzes = data.quizzes.filter(
							(q) => !submittedQuizzes.some((s) => s.quizId === q || s.quizId?._id === q)
						).length;

						const seenIds = seenAnnouncements[data._id] || [];
						const newAnnouncementsCount = data.announcements.filter(id => !seenIds.includes(id)).length;

						return (
							<motion.div 
								key={data._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className='group bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-full'
							>
								{/* Card Header/Banner */}
								<div 
									onClick={() => navigate(`/course/${data._id}/viewcourse`)} 
									className='relative h-32 overflow-hidden cursor-pointer'
								>
									<img className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110' src={CourseBG} alt="Course" />
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
									
									<div className="absolute bottom-4 left-6 right-6">
										<div className="flex items-center gap-2 mb-1">
											<span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-black uppercase rounded shadow-sm">
												Core Course
											</span>
											<span className="text-white/80 text-[11px] font-bold flex items-center gap-1">
												<Clock className="w-3 h-3" />
												{data.creditHours} Credits
											</span>
										</div>
										<h3 className="text-white text-xl font-black tracking-tight leading-tight line-clamp-1 group-hover:text-indigo-300 transition-colors">
											{data.courseName}
										</h3>
									</div>
								</div>

								{/* Instructor Info */}
								<div 
									onClick={() => navigate(`/course/${data._id}/viewcourse`)} 
									className='p-6 flex items-start gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors flex-1'
								>
									<div className="relative shrink-0">
										<img 
											className='h-16 w-16 rounded-2xl object-cover ring-4 ring-slate-50 shadow-md group-hover:ring-indigo-50 transition-all' 
											src={data.instructor.profilePicture} 
											alt="Instructor" 
										/>
										<div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-lg shadow-sm border border-slate-100">
											<GraduationCap className="w-3 h-3 text-indigo-600" />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='text-sm font-black text-slate-900 leading-tight'>{data.instructor.name}</span>
										<span className='text-xs font-bold text-indigo-600 mt-1'>{data.instructor.degree}</span>
										<p className='text-[11px] font-medium text-slate-400 mt-2 line-clamp-2 leading-relaxed'>
											{data.description}
										</p>
									</div>
								</div>

								{/* Action Buttons */}
								<div className='px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between'>
									<div className="flex items-center gap-4">
										<Link 
											to={`/course/${data._id}/assignment`} 
											className='flex flex-col items-center gap-1 group/item relative'
											title="Assignments"
										>
											<div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover/item:border-indigo-500 group-hover/item:text-indigo-600 transition-all">
												<BookOpen className='w-5 h-5' />
												{unsubmittedAssignments > 0 && (
													<span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white'>
														{unsubmittedAssignments}
													</span>
												)}
											</div>
											<span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Work</span>
										</Link>

										<Link 
											to={`/course/${data._id}/quiz`} 
											className='flex flex-col items-center gap-1 group/item relative'
											title="Quizzes"
										>
											<div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover/item:border-indigo-500 group-hover/item:text-indigo-600 transition-all">
												<HelpCircle className='w-5 h-5' />
												{unsubmittedQuizzes > 0 && (
													<span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white'>
														{unsubmittedQuizzes}
													</span>
												)}
											</div>
											<span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Quiz</span>
										</Link>

										<Link 
											to={`/course/${data._id}/announcement`} 
											className='flex flex-col items-center gap-1 group/item relative'
											onClick={() => markAnnouncementsAsSeen(data._id, data.announcements)}
											title="Announcements"
										>
											<div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 group-hover/item:border-indigo-500 group-hover/item:text-indigo-600 transition-all">
												<Bell className='w-5 h-5' />
												{newAnnouncementsCount > 0 && (
													<span className='absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white'>
														{newAnnouncementsCount}
													</span>
												)}
											</div>
											<span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">News</span>
										</Link>
									</div>

									<button 
										onClick={() => navigate(`/course/${data._id}/viewcourse`)}
										className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
									>
										<ChevronRight className="w-5 h-5" />
									</button>
								</div>
							</motion.div>
						)
					})}
				</AnimatePresence>
			</div>
		</div>
	)
}

export default Home
