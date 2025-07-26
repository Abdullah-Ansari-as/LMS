import React, { useRef, useState } from 'react'
import { MdOutlineArrowLeft } from 'react-icons/md'
import { Link, useNavigate, useParams } from 'react-router-dom'
import courseBG from "/courcebg.png"
import { useDispatch, useSelector } from 'react-redux'
import { submitAssignment } from '../../api/courseApi'
import { setSubmittedAssignments } from '../../redux/slices/courseSlice'

const SubmitAssignment = () => {

	const params = useParams();
	const id = params.id;

	const dispatch = useDispatch();

	const { assignments } = useSelector((store) => store.course.assignments);


	const fileRef = useRef(null);
	const navigate = useNavigate();

	const [file, setFile] = useState(""); 
	const [loading, setLoading] = useState(false);

	const fileChangeHandler = (e) => {
		const selectedFile = e.target.files[0];
		if (!selectedFile) {
			alert("Please select a word file");
			return;
		}
		setFile(selectedFile)
	}

	const handleFileSubmit = async (e) => {
		e.preventDefault();
		if (!file) {
			alert("Please select a file first.");
			return;
		}

		try {
			setLoading(true);
			const result = await submitAssignment(file, id);
			if(result.success) {
				dispatch(setSubmittedAssignments(result.submission));
				setFile("");
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
				<h2 className='text-2xl mx-auto md:mx-0'>{assignments[0]?.selectedCourse}</h2>
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
							<input
								type="file"
								accept=".doc,.docx"
								ref={fileRef}
								onChange={fileChangeHandler}
								className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>

							<button
								type="submit"
								className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
									}`}
							>
								{loading ? "Submiting..." : "Submit"}
							</button>
						</form>
					</div>
				</div>
			</div>

		</div>
	)
}

export default SubmitAssignment
