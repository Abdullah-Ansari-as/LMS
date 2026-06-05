import CourseBG from "/courcebg.png"
import { BiBookReader } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import { TbClockQuestion } from "react-icons/tb";
import { FaArrowsRotate } from "react-icons/fa6";
import { GrAnnounce } from "react-icons/gr";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { getAllCourses, fetchSubmittedAssignments, fetchSubmittedQuizes } from '../api/courseApi';
import { setCourses } from '../redux/slices/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import { Loader2 } from "lucide-react";

const getPendingAssignmentCount = (course, submittedAssignments) => {
	const totalAssignments = course.assignments?.length || 0;
	if (totalAssignments === 0) return 0;

	const courseAssignmentIds = new Set(
		course.assignments.map((assignmentId) => String(assignmentId)),
	);

	const submittedIds = new Set(
		submittedAssignments
			.filter(
				(submission) =>
					submission.course === course.courseName &&
					submission.submit !== false &&
					courseAssignmentIds.has(String(submission.assignmentId)),
			)
			.map((submission) => String(submission.assignmentId)),
	);

	return totalAssignments - submittedIds.size;
};

const getPendingQuizCount = (course, submittedQuizzes) => {
	const totalQuizzes = course.quizzes?.length || 0;
	if (totalQuizzes === 0) return 0;

	const courseQuizIds = new Set(
		course.quizzes.map((quizId) => String(quizId)),
	);

	const submittedIds = new Set(
		submittedQuizzes
			.filter(
				(submission) =>
					submission.course === course.courseName &&
					submission.submit !== false &&
					courseQuizIds.has(String(submission.quizId)),
			)
			.map((submission) => String(submission.quizId)),
	);

	return totalQuizzes - submittedIds.size;
};

const Home = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [submittedAssignments, setSubmittedAssignments] = useState([]);
	const [submittedQuizzes, setSubmittedQuizzes] = useState([]);

	const courseData = useSelector((store) => store.course.courses);
	const submittedAssignmentsFromStore = useSelector(
		(store) => store.course.submittedAssignments,
	);
	const submittedQuizzesFromStore = useSelector(
		(store) => store.course.submittedQuizes,
	);

	const allSubmittedAssignments = useMemo(() => {
		const combined = [
			...submittedAssignments,
			...(submittedAssignmentsFromStore || []),
		];
		const seen = new Set();

		return combined.filter((submission) => {
			const key = `${submission.course}-${submission.assignmentId}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}, [submittedAssignments, submittedAssignmentsFromStore]);

	const allSubmittedQuizzes = useMemo(() => {
		const combined = [
			...submittedQuizzes,
			...(submittedQuizzesFromStore || []),
		];
		const seen = new Set();

		return combined.filter((submission) => {
			const key = `${submission.course}-${submission.quizId}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}, [submittedQuizzes, submittedQuizzesFromStore]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [coursesResult, submittedAssignmentsResult, submittedQuizzesResult] =
					await Promise.all([
						getAllCourses(),
						fetchSubmittedAssignments(),
						fetchSubmittedQuizes(),
					]);

				if (coursesResult.success) {
					dispatch(setCourses(coursesResult.allCourses));
				}

				if (submittedAssignmentsResult.success) {
					setSubmittedAssignments(
						submittedAssignmentsResult.submittedAssignments || [],
					);
				}

				if (submittedQuizzesResult.success) {
					setSubmittedQuizzes(submittedQuizzesResult.submittedQuizes || []);
				}
			} catch (error) {
				setLoading(false);
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [dispatch]);

	if(loading) {
		return <div className="flex-1 flex items-center justify-center bg-[#F2F3F8] h-full py-8 px-7">
			<div><Loader2 className="h-10 w-10 animate-spin"/></div>
		</div> 
	}

	return (
		<div className='flex-1 mt-14 md:mt-18 bg-[#F2F3F8] h-auto py-8 px-3 md:px-7'>
			<div className='flex items-center justify-center md:justify-start'>
				<span className='text-2xl'>My Courses&nbsp;</span> (&nbsp;<p className='text-blue-800 text-lg'>Spring 2026</p> &nbsp;)
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 md:mt-10'>
				{
					courseData && courseData.map((data) => {
						const pendingAssignments = getPendingAssignmentCount(
							data,
							allSubmittedAssignments,
						);
						const pendingQuizzes = getPendingQuizCount(
							data,
							allSubmittedQuizzes,
						);

						return (
							<div key={data._id} className='h-86 bg-white shadow-gray-500 shadow-[5px_5px_16px_-1px_rgba(0,0,0,0.2)]'>

								<div onClick={() => navigate(`/course/${data._id}/viewcourse`)} className='relative group hover:cursor-pointer w-full overflow-hidden'>
									<img className='h-24 w-full object-cover ' src={CourseBG} alt="courseBgImg" />
									{/* Hover Overlay */}
									<div className="absolute inset-0 bg-black/8 opacity-0 group-hover:opacity-100 transition " />

									<div className="absolute inset-0 flex ml-3 md:ml-6 justify-center flex-col ">
										<h3 className="text-white text-lg font-semibold">
											{data.courseName}
										</h3>
										<p className='text-gray-300 text-sm mb-0.5'>{data.description.length < 63 ? data.description : data.description.slice(0, 65)+"..."}</p>
										<p className='text-gray-300 text-sm'>{data.creditHours} Credit Hour(s)</p>
									</div>
								</div>

								<div onClick={() => navigate(`/course/${data._id}/viewcourse`)} className='flex cursor-pointer'>
									<div className='p-6 mr-3'>
										<img className='h-[124px] object-cover w-26 rounded-lg border p-1 border-gray-400' src={data.instructor.profilePicture} alt="" />
									</div>
									<div className='flex py-7 flex-col gap-1'>
										<span className='text-sm font-semibold text-black'>{data.instructor.name}</span>
										<span className='text-xs text-black'>{data.instructor.degree}</span>
										<span className='text-xs text-black'>{data.instructor.university}</span>
									</div>
								</div>

								<div className='border-b border-gray-500 mx-3 opacity-50'></div>

								<div className='flex items-center justify-around h-18'>

									<div className='flex flex-col items-center justify-center relative'>
										<Link to={`/course/${data._id}/assignment`} className='relative'>
											<BiBookReader className='w-9 h-9 hover:text-gray-400 duration-400 transition-transform hover:scale-120 cursor-pointer' />
											{pendingAssignments > 0 && (
												<span
													className='absolute -top-1 -right-3 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center'
													title={`${pendingAssignments} assignment${pendingAssignments > 1 ? "s" : ""} pending`}
												>
													{pendingAssignments}
												</span>
											)}
										</Link>
										<p className='text-[11px] text-black mt-1'>Assignments</p>
									</div>

									<div className='hidden md:flex flex-col items-center justify-center relative'>
										<MdGroups className='w-9 h-9 text-gray-400 ' />
										<p className='text-[11px] text-black mt-[2px]'>GDB</p>
									</div>

									<div className='flex flex-col items-center justify-center relative'>
										<Link to={`/course/${data._id}/quiz`} className="relative">
											<TbClockQuestion className='w-9 h-9 hover:text-gray-400 duration-400 transition-transform hover:scale-120 cursor-pointer' />
											{pendingQuizzes > 0 && (
												<span
													className='absolute -top-1 -right-3 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center'
													title={`${pendingQuizzes} quiz${pendingQuizzes > 1 ? "zes" : ""} pending`}
												>
													{pendingQuizzes}
												</span>
											)}
										</Link>
										<p className='text-[11px] text-black mt-1'>Quiz</p>
									</div>

									<div className='hidden md:flex flex-col items-center justify-center relative'>
										<FaArrowsRotate className='w-8.5 h-8.5 text-gray-400 ' />
										<p className='text-[11px] text-black mt-1'>Activity</p>
									</div>

									<div className='flex flex-col items-center justify-center relative'>
										<Link to={`/course/${data._id}/announcement`} className="relative">
											<GrAnnounce className='w-9 h-9 hover:text-gray-400 duration-400 transition-transform hover:scale-120 cursor-pointer' />
											{data.announcements.length > 0 && <span className='absolute -top-1 -right-3 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center'>{data.announcements.length}</span>}
										</Link>
										<p className='text-[11px] text-black mt-1'>Announcements</p>
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

export default Home
