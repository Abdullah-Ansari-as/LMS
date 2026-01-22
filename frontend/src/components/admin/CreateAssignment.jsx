import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadAssignmentByAdmin } from '../../api/courseApi';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const CreateAssignment = () => { 
	const [assignmentFile, setAssignmentFile] = useState(null);
	const [dueDate, setDueDate] = useState("");
	const [totalMarks, setTotalMarks] = useState(20); 
	const [selectedCourse, setSelectedCourse] = useState("");
 

	const allCourses = useSelector((store) => store.course.courses);

	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (!assignmentFile || !dueDate || !totalMarks || !selectedCourse) {
			alert("Please fill in all required fields.");
			return;
		}

		const formData = new FormData();  
		formData.append("assignmentFile", assignmentFile);
		formData.append("dueDate", dueDate);
		formData.append("totalMarks", totalMarks); 
		formData.append("selectedCourse", selectedCourse);

		try { 
			const result = await uploadAssignmentByAdmin(formData); 
			if(result.success){
				toast.success(`${result.message} for ${result.assignment.selectedCourse}`);
				setAssignmentFile(null);
				setDueDate("");
				setSelectedCourse("");
				navigate(-1);
			}
		} catch (error) {
			console.error("Error uploading assignment:", error); 
		}

	};

	return (
		<div className="bg-[#F2F3F8] h-full mt-0 md:pt-10 px-3 md:px-7 p-6">
			<h2 className='font-semibold text-2xl mb-4'>Add Assignment</h2>

			<div className="mb-6 bg-[#F8F8F8] p-3">
				{/* Course Dropdown */}
				<div className="form-control mb-4">
					<label className="label font-medium pr-2">Select a Course</label>
					<select
						className="select select-bordered"
						value={selectedCourse}
						onChange={(e) => setSelectedCourse(e.target.value)}
					>
						<option value="">-- Choose Course --</option>
						{allCourses.map((course) => (
							<option key={course._id} value={course.courseName}>{course.courseName}</option>
						))}
					</select>
				</div>

				{/* File Upload */}
				<input
					type="file"
					accept=".doc,.docx"
					className="file-input file-input-bordered w-full mb-2"
					onChange={(e) => setAssignmentFile(e.target.files[0])}
				/>

				{/* Due Date */}
				<input
					type="date"
					className="input input-bordered w-full mb-2"
					value={dueDate}
					onChange={(e) => setDueDate(e.target.value)}
				/>

				{/* Total Marks */}
				<input
					type="number"
					className="input input-bordered w-full mb-2"
					placeholder="Total Marks"
					value={totalMarks}
					onChange={(e) => setTotalMarks(e.target.value)}
				/>

				<button
					onClick={handleSubmit}
					className="btn btn-accent"
					disabled={!selectedCourse || !assignmentFile || !dueDate || !totalMarks}
				>
					Add Assignment
				</button>

				<button
					onClick={() => navigate(-1)}
					className='text-white p-2 rounded-md ml-2 bg-gray-400 hover:bg-gray-500 cursor-pointer'
				>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default CreateAssignment;
