import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import courseBG from "/courcebg.png"
import { MdOutlineArrowLeft } from "react-icons/md";
import { GoFileSubmodule } from "react-icons/go";
import { fetchAssignmentsById, fetchSubmittedAssignments } from '../../api/courseApi';
import { useDispatch, useSelector } from 'react-redux';
import { setAssignments } from '../../redux/slices/courseSlice';
import { Loader2 } from 'lucide-react';
import { getAssignmentsGrades } from '../../api/gradesApi';

const Assignment = () => {
	const params = useParams();
	const paramId = params.courseId;

	const [assignmentsResults, setAssignmentsResults] = useState([]);

	// console.log(assignmentsGrades);

	const { user } = useSelector((store) => store.user)


	const allCourses = useSelector((store) => store.course.courses);
	const singleCourse = allCourses?.find((course) => course._id === paramId);


	const dispatch = useDispatch();
	const navigate = useNavigate();

	const assignments = useSelector((store) => store.course.assignments);
	const submittedAssignmentsFromStore = useSelector((store) => store.course.submittedAssignments);

	const [loading, setLoading] = useState(false);
	const [totalSubmittedAssignments, setTotalSubmittedAssignments] = useState([])

	const assignmentData = useMemo(() => {
		if (Array.isArray(assignments)) {
			return assignments;
		}

		if (Array.isArray(assignments?.assignments)) {
			return assignments.assignments;
		}

		return [];
	}, [assignments]);


	const mergedAssignments = assignmentData.map((assignment, index) => {
		const title = `Assignment No ${index + 1}`;

		const result = assignmentsResults.find((res) => res.title === title);

		return {
			...assignment,
			result: result ? `${result.assignmentGrade} / 20` : "Not Graded",
		};
	});

	const isSubmittedByCurrentUser = (submittedAssignment, assignmentId) => {
		return String(submittedAssignment?.studentId) === String(user?._id)
			&& String(submittedAssignment?.assignmentId) === String(assignmentId)
			&& submittedAssignment?.submit !== false;
	};


	useEffect(() => {
		const getAllSubmittedAssignments = async () => {
			try {
				const res = await fetchSubmittedAssignments();
				if (res.success) {
					setTotalSubmittedAssignments(Array.isArray(res.submittedAssignments) ? res.submittedAssignments : [])
				}
			} catch (error) {
				console.error(error);
			}
		}
		getAllSubmittedAssignments();
	}, [])

	// If a submission just happened, store updates immediately—reflect it in UI
	const allSubmittedAssignments = [
		...(totalSubmittedAssignments || []),
		...(submittedAssignmentsFromStore || []),
	];


	useEffect(() => {
		const fetchAssignments = async () => {
			setLoading(true);

			try {
				const result = await fetchAssignmentsById(paramId);
				const normalizedAssignments = Array.isArray(result?.assignments?.assignments)
					? result.assignments.assignments
					: Array.isArray(result?.assignments)
						? result.assignments
						: [];

				if (result?.success) {
					dispatch(setAssignments(normalizedAssignments));
				}
			} catch (error) {
				console.error(error);
				dispatch(setAssignments([]));
			} finally {
				setLoading(false);
			}
		}

		if (paramId) {
			fetchAssignments();
		}
	}, [dispatch, paramId]);

	useEffect(() => {
		const assignmentsGrades = async () => {
			try {
				const result = await getAssignmentsGrades(singleCourse?.courseName);
				if (result.success) {
					setAssignmentsResults(Array.isArray(result.assignmentResults) ? result.assignmentResults : [])
				}
			} catch (error) {
				console.error(error);
			}
		}
		if (singleCourse?.courseName) {
			assignmentsGrades();
		}
	}, [singleCourse?.courseName])


	return (
		<div className={`mt-18 bg-[#F2F3F8] py-4 px-2 md:px-7 h-auto md:h-full ${mergedAssignments?.length <= 0 || loading ? "h-full" : ""}`}>
			<div className="flex items-center px-6 py-3 md:py-6">
				<h2 className='text-2xl mx-auto md:mx-0'>{singleCourse?.courseName}</h2>
			</div>

			<div className='bg-white my-3 h-auto'>

				<div className="relative">
					<img className='h-20 w-full object-cover' src={courseBG} alt="courseBgImg" />
					<div className="absolute inset-0 flex ml-6 justify-between items-center mx-10">
						<h3 className="text-white text-lg font-semibold">
							Assignment
						</h3>
						<Link to="/" className='flex items-center'><MdOutlineArrowLeft className='h-5 w-5 text-white' /><span className='hover:underline text-white'>Back</span></Link>
					</div>
				</div>



				<div className="p-1 md:p-4 my-5 mx-2 md:mx-4">
					{loading ? (
						<div className='flex h-auto justify-center items-center text-center p-5'>
							<Loader2 className='h-8 w-8 animate-spin' />
						</div>
					) : mergedAssignments?.length > 0 ? (
						<>
							{/* Mobile View (below md) */}
							<div className="md:hidden space-y-4">
								{mergedAssignments.map((assignment, index) => (
									<div key={assignment._id} className="border border-gray-200 rounded-lg shadow-sm p-4">
										<div className="grid grid-cols-2 gap-2 text-sm">
											<div className="font-medium text-gray-500">Sr. No.</div>
											<div>{index + 1}</div>

											<div className="font-medium text-gray-500">Title</div>
											<div>Assignment No {index + 1}</div>

											<div className="font-medium text-gray-500">Assignment</div>
											<div className="text-blue-400">
												<a
													href={`${import.meta.env.VITE_BACKEND_URL}/api/courses/download?url=${encodeURIComponent(assignment.assignmentFile)}&name=${encodeURIComponent(`Assignment_${index + 1}.docx`)}`}
													download
													className="hover:underline"
													title='click for download file'
												>
													Assignment File
												</a>
											</div>

											<div className="font-medium text-gray-500">Due Date</div>
											<div className="text-red-500">{assignment.dueDate || "N/A"}</div>

											<div className="font-medium text-gray-500">Total Marks</div>
											<div className="text-[#9865A1]">{Number(assignment.totalMarks || 0).toFixed(2)}</div>

											<div className="font-medium text-gray-500">Submit</div>
											<div>
												{allSubmittedAssignments?.some((s) => isSubmittedByCurrentUser(s, assignment._id)) ? (
													<span className="text-green-600 font-semibold">Submitted</span>
												) : (
													<GoFileSubmodule
														onClick={() => navigate(`/course/submit/assignment/${assignment._id}`)}
														className='w-6 h-6 cursor-pointer text-blue-900'
													/>
												)}
											</div>

											<div className="font-medium text-gray-500">Result</div>
											<div className="text-green-600">{assignment.result}</div>
										</div>
									</div>
								))}
							</div>

							{/* Desktop Table (md and up) */}
							<div className="hidden md:block p-2">
								<div className="overflow-x-auto shadow-lg">
									<table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
										<thead className="bg-[#716ACA] text-white text-sm">
											<tr>
												<th className="py-4 px-4 border-r border-gray-300">Sr. No.</th>
												<th className="py-4 px-4 border-r border-gray-300">Title</th>
												<th className="py-4 px-4 border-r border-gray-300">Assignment</th>
												<th className="py-4 px-4 border-r border-gray-300">Start Date</th>
												<th className="py-4 px-4 border-r border-gray-300">Total Marks</th>
												<th className="py-4 px-4 border-r border-gray-300">Submit</th>
												<th className="py-4 px-4">Result</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{mergedAssignments.map((assignment, index) => (
												<tr key={assignment._id} className="transition duration-150 ease-in-out">
													<td className="py-3 px-4 border-r border-gray-200">{index + 1}</td>
													<td className="py-3 px-4 border-r border-gray-200">Assignment No {index + 1}</td>
													<td className="py-3 px-4 border-r text-blue-400 border-gray-200 duration-200 ease-in-out transition">
														<a
															href={`${import.meta.env.VITE_BACKEND_URL}/api/courses/download?url=${encodeURIComponent(assignment.assignmentFile)}&name=${encodeURIComponent(`Assignment_${index + 1}.docx`)}`}
															download
															className="hover:underline"
															title='click for download file'
														>
															Assignment File
														</a>
													</td>
													<td className="py-3 px-4 border-r text-red-500 border-gray-200">
														{assignment.dueDate || "N/A"}
													</td>
													<td className="py-3 px-4 border-r text-[#9865A1] border-gray-200">
														{Number(assignment.totalMarks || 0).toFixed(2)}
													</td>
													<td className="py-3 px-4 border-r text-blue-900 border-gray-200">
														{allSubmittedAssignments?.some((s) => isSubmittedByCurrentUser(s, assignment._id)) ? (
															<span className="text-green-600 font-semibold">Submitted</span>
														) : (
															<GoFileSubmodule
																onClick={() => navigate(`/course/submit/assignment/${assignment._id}`)}
																className='w-7 h-7 cursor-pointer'
																title='submit'
															/>
														)}
													</td>
													<td className="py-3 text-green-600 px-4">{assignment.result}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</>
					) : (
						<div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
							No Assignments Found!
						</div>
					)}
				</div>


			</div>

		</div>
	)

}

export default Assignment
