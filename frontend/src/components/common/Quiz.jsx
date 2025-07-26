import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import courseBG from "/courcebg.png"
import { MdOutlineArrowLeft } from "react-icons/md";
import { fetchQuizesById } from '../../api/courseApi';
import { useDispatch, useSelector } from 'react-redux';
import { setQuizes } from '../../redux/slices/courseSlice';
import { Loader2 } from 'lucide-react';
import { getQuizesGrades } from '../../api/gradesApi';


const Quiz = () => {
	const params = useParams();
	const paramId = params.courseId;

	const dispatch = useDispatch();
	const { quizes } = useSelector((store) => store.course);
	const { user } = useSelector((store) => store.user)
	const { submittedQuizes } = useSelector((store) => store.course);

	const allCourses = useSelector((store) => store.course.courses);
	const singleCourse = allCourses?.find((course) => course._id === paramId);

	const navigate = useNavigate();

	const [quizesResults, setQuizesResults] = useState([])
	const [loading, setLoading] = useState(false);

	const handleQuiz = (id) => {
		navigate(`/course/attempt-quiz/${id}`)
	}

	const mergedQuizes = quizes.map((quiz, index) => {
		const title = `Quiz No ${index + 1}`;

		const result = quizesResults.find((res) => res.title === title);

		return {
			...quiz,
			result: result ? `${result.quizGrade} / 5` : "Not Graded"
		}
	});


	useEffect(() => {
		try {
			const fetchQuizes = async () => {
				setLoading(true)
				const result = await fetchQuizesById(paramId);
				if (result.success) {
					dispatch(setQuizes(result.quizzes.quizzes));
					setLoading(false)
				}
			}
			fetchQuizes()
		} catch (error) {
			setLoading(false);
			console.error(error);
		}
	}, []);

	useEffect(() => {
		try {
			const quizesGrades = async () => {
				const result = await getQuizesGrades(singleCourse?.courseName);
				if (result.success) {
					setQuizesResults(result.quizResults)
				}
			}
			quizesGrades();
		} catch (error) {
			console.error(error);
		}
	}, []);

	return (
		<div className={`mt-18 bg-[#F2F3F8] py-4 px-2 md:px-7 h-auto md:h-full ${mergedQuizes?.length <= 0 || loading ? "h-full" : ""}`}>
			<div className="flex items-center px-6 py-3 md:py-6">
				<h2 className='text-2xl mx-auto md:mx-0'>{singleCourse?.courseName}</h2>
			</div>

			<div className='bg-white my-3 h-auto'>

				<div className="relative">
					<img className='h-20 w-full object-cover' src={courseBG} alt="courseBgImg" />
					<div className="absolute inset-0 flex ml-6 justify-between items-center mx-10">
						<h3 className="text-white text-lg font-semibold">
							Quiz
						</h3>
						<Link to="/" className='flex items-center'><MdOutlineArrowLeft className='h-5 w-5 text-white' /><span className='hover:underline text-white'>Back</span></Link>
					</div>
				</div>


				<div className="p-1 md:p-6 my-5 mx-2 md:mx-4">
					{loading ? (
						<div className="flex justify-center items-center text-center p-5">
							<Loader2 className="h-8 w-8 animate-spin" />
						</div>
					) : mergedQuizes.length > 0 ? (
						<>
							{/* Table view for medium and larger screens */}
							<div className="overflow-x-auto shadow-lg hidden md:block">
								<table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
									<thead className="bg-[#716ACA] text-white text-sm">
										<tr>
											<th className="py-4 px-4 border-r border-gray-300">#</th>
											<th className="py-4 px-4 border-r border-gray-300">Quiz Title</th>
											<th className="py-4 px-4 border-r border-gray-300">Start Date</th>
											<th className="py-4 px-4 border-r border-gray-300">Total Marks</th>
											<th className="py-4 px-4 border-r border-gray-300">Submit</th>
											<th className="py-4 px-4">Result</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{mergedQuizes.map((quiz, index) => (
											<tr key={quiz._id} className="transition duration-150 ease-in-out">
												<td className="py-3 px-4 border-r border-gray-200">{index + 1}</td>
												<td className="py-3 px-4 border-r border-gray-200">Quiz No {index + 1}</td>
												<td className="py-3 px-4 border-r text-red-500 border-gray-200">
													{new Date(quiz.dueDate).toLocaleDateString()}
												</td>
												<td className="py-3 px-4 border-r text-[#9865A1] border-gray-200">{quiz.totalMarks}</td>
												<td className="py-3 px-4 border-r border-gray-200">
													{submittedQuizes?.some((s) => s.studentId === user._id && s.quizId === quiz._id) ? (
														<span className="text-green-500">Submited</span>
													) : (
														<span
															onClick={() => {
																if (!quiz.submit) handleQuiz(quiz._id);
															}}
															className="text-blue-500 hover:underline cursor-pointer"
														>
															Take Quiz
														</span>
													)}
												</td>
												<td className="py-3 px-4 text-green-600">{quiz.result}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Card view for small screens */}
							<div className="md:hidden space-y-4">
								{mergedQuizes?.map((quiz, index) => (
									<div key={quiz._id} className="border border-gray-200 rounded-lg shadow-md p-4 text-sm space-y-2">
										<div className="flex justify-between">
											<span className="font-medium text-gray-500">#</span>
											<span>{index + 1}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-500">Quiz Title</span>
											<span>Quiz No {index + 1}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-500">Start Date</span>
											<span className="text-red-500">{new Date(quiz.dueDate).toLocaleDateString()}</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-500">Total Marks</span>
											<span className="text-[#9865A1]">{quiz.totalMarks}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="font-medium text-gray-500">Submit</span>
											{submittedQuizes?.some((s) => s.studentId === user._id && s.quizId === quiz._id) ? (
												<span className="text-green-500">Submited</span>
											) : (
												<span
													onClick={() => {
														if (!quiz.submit) handleQuiz(quiz._id);
													}}
													className="text-blue-500 hover:underline cursor-pointer"
												>
													Take Quiz
												</span>
											)}
										</div>
										<div className="flex justify-between">
											<span className="font-medium text-gray-500">Result</span>
											<span className="text-green-600">{quiz.result}</span>
										</div>
									</div>
								))}
							</div>
						</>
					) : (
						<div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">No quizes Found!</div>
					)}
				</div>



			</div>
		</div>
	)
}

export default Quiz
