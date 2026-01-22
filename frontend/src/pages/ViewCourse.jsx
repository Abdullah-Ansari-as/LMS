import { MdOutlineArrowLeft } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import courseBG from "/courcebg.png"
import { GiWhiteBook } from "react-icons/gi";
import { MdCameraRoll } from "react-icons/md";
import { FaComments } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { useSelector } from "react-redux";


const ViewCourse = () => {

	const params = useParams();
	const paramId = params.courseId; 

	const allCourses = useSelector((store) => store.course.courses);
 
	const course = allCourses?.find((course) => course._id === paramId);

	const LectureData = course?.lectures;

	return (
		<div className="min-h-screen bg-[#F2F3F8] py-8 px-2 md:px-8 mt-18">
			{/* Header */}
			<div className='flex items-center'>
				<span className='text-2xl mx-auto md:mx-0'>{course?.courseName}</span>
			</div>

			{/* Layout: Sidebar + Main Content */}
			<div className="flex flex-col lg:flex-row gap-6 my-6">
				{/* Sidebar */}
				<div className="w-full lg:w-1/4 bg-white rounded-lg shadow-md p-4 space-y-3">
					<div className="flex flex-col items-center justify-center mt-6">
						<img className="h-34 w-30 rounded-4xl border border-gray-200 p-1" src={course?.instructor?.profilePicture} alt="" />
						<div className="flex flex-col items-center justify-center">
							<p className="text-lg font-semibold my-1">{course?.instructor.name}</p>
							<p className="text-sm text-gray-600">{course?.instructor.degree}</p>
							<p className="text-sm text-gray-600">{course?.instructor.university}</p>
						</div>
					</div>
					<div className="border-b border-gray-300"></div>
					<ul className="text-sm text-gray-700 space-y-4">
						<Link to={`/course/${paramId}/assignment`}><li className="hover:text-blue-600 cursor-pointer hover:underline pt-3">📝 Assignments</li></Link>
						<Link to={`/course/${paramId}/quiz`}><li className="hover:text-blue-600 cursor-pointer hover:underline pt-3">🧠 Quizzes</li></Link>
						<Link to={`/course/${paramId}/announcement`}><li className="hover:text-blue-600 cursor-pointer hover:underline pt-3">📢 Announcements</li></Link>
						<Link to={`/notes`}><li className="hover:text-blue-600 cursor-pointer hover:underline mt-3">📁 Lecture Notes</li></Link>
					</ul>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 bg-white rounded-lg shadow-md">

					<div className="relative">
						<img className='h-20 w-full object-cover' src={courseBG} alt="courseBgImg" />
						<div className="absolute inset-0 flex ml-6 justify-between items-center mx-10">
							<h3 className="text-white text-md font-semibold">
								Index / Lesson
							</h3>
							<Link to="/" className='flex items-center'><MdOutlineArrowLeft className='h-5 w-5 text-white' /><span className='hover:underline text-white text-sm'>Back</span></Link>
						</div>
					</div>

					<div className="p-3 md:p-10">
						{
							LectureData.length > 0 ? (
								LectureData.map((lecture, index) => (
									<div key={index} className="border border-gray-200 p-3">
										<div className="flex gap-1 text-sm">
											<span>{index + 1} -&nbsp;&nbsp;</span><a href={lecture.lectureUrl} className="text-[#5867DD] hover:underline cursor-pointer">{lecture.lectureTitle}</a>
										</div>
										<div className="flex justify-between pr-2 md:pr-50">
											<div className="flex gap-1 mt-2">
												<GiWhiteBook className="text-[#5867DD]" />
												<MdCameraRoll className="text-red-400" />
											</div>
											<span className="flex text-green-500 items-center"><FaComments className="h-4 w-4 mr-1 text-sm text-green-500"/>Open</span>
											<span className="flex items-center text-sm text-gray-600"><IoMdTime className="h-4 w-4 mr-1"/> N/A</span>
										</div>
									</div>
								))
							) : (<p className="flex items-center justify-center p-5">No Lectures uploaded!</p>)
						}
					</div>

				</div>
			</div>
		</div>
	);
};

export default ViewCourse;
