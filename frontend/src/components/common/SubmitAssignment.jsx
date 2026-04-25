import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MdOutlineArrowLeft } from 'react-icons/md'
import { Link, useNavigate, useParams } from 'react-router-dom'
import courseBG from "/courcebg.png"
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubmittedAssignments, submitAssignment } from '../../api/courseApi'
import { setSubmittedAssignments } from '../../redux/slices/courseSlice'

const SubmitAssignment = () => {

	const params = useParams();
	const id = params.id;

	const dispatch = useDispatch();

	const assignments = useSelector((store) => store.course.assignments);
	const submittedAssignmentsFromStore = useSelector((store) => store.course.submittedAssignments);
	const { user } = useSelector((store) => store.user);


	const fileRef = useRef(null);
	const navigate = useNavigate();

	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [submittedAssignments, setSubmittedAssignmentsState] = useState([]);

	const assignmentList = useMemo(() => {
		if (Array.isArray(assignments)) {
			return assignments;
		}

		if (Array.isArray(assignments?.assignments)) {
			return assignments.assignments;
		}

		return [];
	}, [assignments]);

	const currentAssignment = useMemo(
		() => assignmentList.find((assignment) => String(assignment?._id) === String(id)),
		[assignmentList, id]
	);

	const allSubmittedAssignments = [
		...(submittedAssignments || []),
		...(submittedAssignmentsFromStore || []),
	];

	const hasAlreadySubmitted = allSubmittedAssignments.some((assignment) =>
		String(assignment?.studentId) === String(user?._id)
		&& String(assignment?.assignmentId) === String(id)
		&& assignment?.submit !== false
	);

	useEffect(() => {
		const getSubmittedAssignments = async () => {
			try {
				const result = await fetchSubmittedAssignments();
				if (result?.success) {
					setSubmittedAssignmentsState(
						Array.isArray(result.submittedAssignments) ? result.submittedAssignments : []
					);
				}
			} catch (error) {
				console.error(error);
			}
		};

		getSubmittedAssignments();
	}, []);

	const fileChangeHandler = (e) => {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) {
			alert("Please select a word file");
			return;
		}
		setFile(selectedFile)
	}

	const handleFileSubmit = async (e) => {
		e.preventDefault();

		if (hasAlreadySubmitted) {
			alert("You have already submitted this assignment.");
			return;
		}

		if (!file) {
			alert("Please select a file first.");
			return;
		}

		try {
			setLoading(true);
			const result = await submitAssignment(file, id);
			if(result.success) {
				dispatch(setSubmittedAssignments(result.submission));
				setFile(null);
				if (fileRef.current) {
					fileRef.current.value = "";
				}
				navigate(-1);
			}
			setLoading(false);
			
		} catch (error) {
			console.error(error);
			setLoading(false)
		} 

	}


	return (

		<div className={`mt-18 bg-[#F2F3F8] py-4 px-3 md:px-7 h-full`}>
		
			<div className="flex items-center px-6 py-3 md:py-6">
				<h2 className='text-2xl mx-auto md:mx-0'>{currentAssignment?.selectedCourse || "Assignment"}</h2>
			</div>

			<div className='bg-white my-3 h-auto'>

				<div className="relative">
					<img className='h-20 w-full object-cover' src={courseBG} alt="courseBgImg" />
					<div className="absolute inset-0 flex ml-6 justify-between items-center mx-10">
						<h3 className="text-white text-base md:text-lg font-semibold">
							Submit Assignment
						</h3>
						<Link onClick={() => navigate(-1)} className='flex items-center'><MdOutlineArrowLeft className='h-5 w-5 text-white' /><span className='hover:underline text-white'>Back</span></Link>
					</div>
				</div>

				<div className="p-2 md:p-6 my-5 mx-4">
					<div className="overflow-x-auto shadow-lg">
						<form onSubmit={handleFileSubmit} className="space-y-4">
							{hasAlreadySubmitted && (
								<div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
									This assignment has already been submitted.
								</div>
							)}

							<input
								type="file"
								accept=".doc,.docx"
								ref={fileRef}
								onChange={fileChangeHandler}
								disabled={loading || hasAlreadySubmitted}
								className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>

							<button
								type="submit"
								disabled={loading || hasAlreadySubmitted}
								className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
									}`}
							>
								{loading ? "Submitting..." : hasAlreadySubmitted ? "Submitted" : "Submit"}
							</button>
						</form>
					</div>
				</div>
			</div>

		</div>
	)
}

export default SubmitAssignment
