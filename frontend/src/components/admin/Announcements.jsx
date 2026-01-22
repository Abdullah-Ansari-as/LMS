import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadCourseAnnouncement } from '../../api/courseApi';
import { toast } from 'sonner';


const Announcements = () => {

	const navigate = useNavigate();
	const [title, setTitle] = useState("")
	const [announcement, setAnnouncement] = useState("")
	const [selectedCourse, setSelectedCourse] = useState("");

	const allCourses = useSelector((store) => store.course.courses);

	const handleSubmit = async () => {
		if (!selectedCourse || !announcement || !title) {
			alert("please select any one course and Post some title and annoucement");
			return;
		}

		const data = { selectedCourse, title, announcement };

		try {
			const result = await uploadCourseAnnouncement(data);
			if (result.success) {
				toast.success(result.message);
				setTitle("");
				setAnnouncement("");
				setSelectedCourse("");
			}
		} catch (error) {
			console.error(error)
		}

	}

	return (
		<div className='bg-[#F2F3F8] h-full mt-0 md:pt-10 px-3 md:PX-7 p-6'>
			<h2 className='font-semibold text-2xl'>Add Announcement</h2>
			<div className="my-6 bg-[#F8F8F8] p-3 md:p-6 rounded-2xl">

				{/* Select Course */}
				<div className="form-control mb-6">
					<label className="label font-medium pr-2">Select a Course</label>
					<select
						className="select select-bordered"
						value={selectedCourse}
						onChange={(e) => setSelectedCourse(e.target.value)}
					>
						<option value="">-- Choose Course --</option>
						{allCourses.map((course) => (
							<option key={course._id} value={course.courseName}>
								{course.courseName}
							</option>
						))}
					</select>
				</div>


				<h3 className="text-base md:text-lg font-bold mb-2">Title</h3>
				<input
					className="border border-gray-200 w-full p-2 rounded bg-white mb-2"
					placeholder="announcement title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<h3 className="text-base md:text-lg font-bold mb-2">Add Announcement</h3>
				<textarea
					className="textarea textarea-bordered w-full mb-2"
					placeholder="Write announcement..."
					value={announcement}
					onChange={(e) => setAnnouncement(e.target.value)}
				/>
				<button
					onClick={() => handleSubmit()}
					className="btn btn-info"
					disabled={announcement === ""}
				>
					Post Announcement
				</button>
				<button onClick={() => navigate(-1)} className='text-white p-2 rounded-md ml-2 bg-gray-400 hover:bg-gray-500 cursor-pointer'>Cancel</button>
			</div>
		</div>
	)
}

export default Announcements
