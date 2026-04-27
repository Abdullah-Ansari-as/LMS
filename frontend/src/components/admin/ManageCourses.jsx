import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteCourseLecture, getAllCourses, uploadLecture } from "../../api/courseApi";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { setCourses } from "../../redux/slices/courseSlice";

const ManageCourses = () => {
	const [selectedCourse, setSelectedCourse] = useState("");
	const [lectureTitle, setLectureTitle] = useState("");
	const [lectureUrl, setLectureUrl] = useState("");
	const [handoutFile, setHandoutFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [deletingLectureId, setDeletingLectureId] = useState(null);

	const dispatch = useDispatch();
	const allCourses = useSelector((store) => store.course.courses);
	const selectedCourseData = allCourses.find((course) => course.courseName === selectedCourse);
	const selectedCourseLectures = selectedCourseData?.lectures || [];

	const refreshCourses = async () => {
		const result = await getAllCourses();
		if (result?.success) {
			dispatch(setCourses(result.allCourses || []));
		}
	};

	const handleSubmit = async () => {
		try {
			const formData = new FormData();
			formData.append("course", selectedCourse);
			formData.append("lectureTitle", lectureTitle);
			formData.append("lectureUrl", lectureUrl);

			if (handoutFile) {
				formData.append("handoutFile", handoutFile);
			}

			setLoading(true)
			const result = await uploadLecture(formData); 
			if (result.success) {
				setLoading(false);
				toast.success(`${result.message} for ${result.course.courseName}`);
				await refreshCourses();
				setLectureTitle("");
				setLectureUrl("");
				setHandoutFile(null);
				setSelectedCourse("");
			}
		} catch (error) {
			setLoading(false);
			toast.error("Failed to upload a lecture!");
			console.error(error);
		}

	};

	const handleDeleteLecture = async (lectureId) => {
		if (!selectedCourseData?._id || !lectureId) return;

		try {
			setDeletingLectureId(lectureId);
			const result = await deleteCourseLecture(selectedCourseData._id, lectureId);
			if (result?.success) {
				toast.success(result.message || "Lecture deleted successfully");
				await refreshCourses();
			}
		} catch (error) {
			console.error(error);
			toast.error(error?.response?.data?.message || "Failed to delete lecture");
		} finally {
			setDeletingLectureId(null);
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
					<input
						type="file"
						className="file-input file-input-bordered w-full mb-2"
						onChange={(e) => setHandoutFile(e.target.files?.[0] || null)}
					/>
					<p className="text-xs text-gray-500 mb-3">
						Optional handout file. You can upload documents like `.pdf`, `.doc`, `.docx`, `.txt`, or other lecture files.
					</p>
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

				<div className="mt-8">
					<h3 className="text-lg md:text-xl font-bold mb-3">Manage Uploaded Lectures</h3>
					{selectedCourse ? (
						selectedCourseLectures.length > 0 ? (
							<div className="space-y-3">
								{selectedCourseLectures.map((lecture, index) => (
									<div
										key={lecture._id}
										className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
									>
										<div className="min-w-0">
											<p className="font-medium text-gray-900">
												{index + 1}. {lecture.lectureTitle}
											</p>
											<p className="truncate text-sm text-gray-500">
												{lecture.lectureUrl}
											</p>
											<p className="mt-1 text-xs text-gray-500">
												Handout: {lecture?.handout?.fileName || "No handout uploaded"}
											</p>
										</div>
										<button
											type="button"
											onClick={() => handleDeleteLecture(lecture._id)}
											disabled={deletingLectureId === lecture._id}
											className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
										>
											{deletingLectureId === lecture._id ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<Trash2 className="h-4 w-4" />
											)}
											Delete Lecture
										</button>
									</div>
								))}
							</div>
						) : (
							<div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
								No lectures uploaded for the selected course yet.
							</div>
						)
					) : (
						<div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
							Select a course to manage its lectures.
						</div>
					)}
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
