import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { uploadLecture } from "../../api/courseApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ManageCourses = () => {
	const [selectedCourse, setSelectedCourse] = useState("");
	const [lectureTitle, setLectureTitle] = useState("");
	const [lectureUrl, setLectureUrl] = useState("");
	const [loading, setLoading] = useState(false);

	const allCourses = useSelector((store) => store.course.courses);

	const handleSubmit = async () => {
		const data = {
			course: selectedCourse,
			lectureTitle,
			lectureUrl,
		};
		try {
			setLoading(true)
			const result = await uploadLecture(data); 
			if (result.success) {
				setLoading(false);
				toast.success(`${result.message} for ${result.course.courseName}`);
				setLectureTitle("");
				setLectureUrl("");
				setSelectedCourse("");
			}
		} catch (error) {
			setLoading(false);
			toast.error("Failed to upload a lecture!");
			console.error(error);
		}

	};

	return (
		<div className="bg-[#F2F3F8] md:h-full h-auto mt-0 md:pt-10 px-2 md:px-7 p-6">
			<h2 className="text-2xl font-semibold mb-4">Manage Courses</h2>

			{/* Add new course Button */}
			<Link to="/admin/add-new-course"><button className="w-full bg-amber-200 hover:bg-amber-300 hover:cursor-pointer hover:underline rounded-xl text-black transition-transform hover:scale-101 p-1 my-2 ease-in-out">
				<span className="">Add New Course</span>
			</button></Link>


			<div className=" p-3 md:p-6 max-w-5xl mx-auto bg-[#F8F8F8] rounded-md shadow-md">
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



				{/* Upload Lecture */}
				<div className="mb-6">
					<h3 className="text-lg md:text-xl font-bold mb-2">Upload Lecture</h3>
					<input
						type="text"
						placeholder="Lecture Title"
						className="input input-bordered w-full mb-2"
						value={lectureTitle}
						onChange={(e) => setLectureTitle(e.target.value)}
						required
					/>
					<input
						type="url"
						placeholder="Lecture Video URL"
						className="input input-bordered w-full mb-2"
						value={lectureUrl}
						onChange={(e) => setLectureUrl(e.target.value)}
						required
					/>
					{
						loading ? (
							<button className='btn bg-gray-300 cursor-not-allowed'><div className="flex items-center justify-center">Loading <Loader2 className='m-1 w-5 h-5 animate-spin' /></div></button>
						) : (
							<button
								onClick={() => handleSubmit()}
								className="btn btn-primary"
								disabled={!selectedCourse || !lectureTitle || !lectureUrl}
							>
								Upload Lecture
							</button>
						)
					}
				</div>

				<h2 className="font-semibold text-lg mt-8 underline">Other Activities:</h2>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
					<Link to="/admin/manage-courses/createassignment">
						<button className="btn w-full btn-accent text-white hover:scale-105 transition-transform">
							📄 Create Assignment
						</button>
					</Link>

					<Link to="/admin/manage-courses/createquiz">
						<button className="btn w-full btn-primary text-white hover:scale-105 transition-transform">
							📝 Create Quiz
						</button>
					</Link>

					<Link to="/admin/manage-courses/createannouncements">
						<button className="btn w-full btn-info text-white hover:scale-105 transition-transform">
							📢 Upload Announcement
						</button>
					</Link>
				</div>

			</div>
		</div>
	);
};

export default ManageCourses;
