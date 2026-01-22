import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadQuizByAdmin } from '../../api/courseApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const CreateQuiz = () => {

	const [selectedCourse, setSelectedCourse] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [totalMarks, setTotalMarks] = useState(5);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const allCourses = useSelector((store) => store.course.courses);


	const [quizQuestions, setQuizQuestions] = useState([
		{ question: "", options: ["", "", ""], correctOption: "" }
	]);

	const handleQuizChange = (qIndex, field, value) => {
		const updated = [...quizQuestions];
		if (field === "question") {
			updated[qIndex].question = value;
		}
		setQuizQuestions(updated);
	}

	const handleOptionChange = (qIndex, optIndex, value) => {
		if (quizQuestions[qIndex].question === "") {
			alert("Please Enter your question first!");
			return;
		}

		const updated = [...quizQuestions];
		updated[qIndex].options[optIndex] = value;
		setQuizQuestions(updated);

	}

	const setCorrectOption = (qIndex, optValue) => {
		const updated = [...quizQuestions];
		updated[qIndex].correctOption = optValue;
		setQuizQuestions(updated);
	}

	const addNewQuestion = () => {
		setQuizQuestions([
			...quizQuestions,
			{ question: "", options: ["", "", ""], correctOption: "" }
		])
	}

	const submitQuiz = async () => {
		if (!totalMarks || !dueDate) {
			alert("We Required All Fields, please select due date and total marks as well!");
			return;
		};

		const finalAnswer = { selectedCourse, quizQuestions, totalMarks, dueDate }

		try {
			setLoading(true);
			const result = await uploadQuizByAdmin(finalAnswer); 
			if (result.success) {
				setLoading(false);
				toast.success(`${result.message} for ${result.quiz.selectedCourse}`);
				setQuizQuestions([
					{ question: "", options: ["", "", ""], correctOption: "" },
				])
				setDueDate("");
				setTotalMarks(5);
			}
		} catch (error) {
			setLoading(false);
			toast.error(error.response.data);
			console.error("Error uploading quiz:", error);
		}

	}

	return (
		<div className='bg-[#F2F3F8] mb-5 h-full mt-0 md:pt-10 px-3 md:PX-7 p-6'>
			<h3 className="text-2xl font-semibold mb-4">Create Quiz</h3>



			{/* Create Quiz */}
			<div className="mb-6 bg-[#F8F8F8] p-3">

				<div className="grid grid-cols-1 md:grid-cols-3 mx-1 gap-2">

					{/* Due Date */}
					<input
						type="date"
						className="input input-bordered w-full mb-2"
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
						required
					/>
					{/* Total Marks */}
					<input
						type="number"
						className="input input-bordered w-full mb-2"
						placeholder="Total Marks"
						value={totalMarks}
						onChange={(e) => setTotalMarks(e.target.value)}
						required
					/>

				</div>

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
							<option key={course._id} value={course.courseName}>{course.courseName}</option>
						))}
					</select>
				</div>

				{quizQuestions.map((q, qIndex) => (
					<div key={qIndex} className="mb-4 border border-base-300 p-1.5 md:p-4 rounded-md">
						<label className="label font-medium">
							Question {qIndex + 1}
						</label>
						<input
							type="text"
							className="input input-bordered w-full mb-3"
							placeholder="Enter question"
							value={q.question}
							onChange={(e) =>
								handleQuizChange(qIndex, "question", e.target.value)
							}
						/>

						{q.options.map((opt, optIndex) => (
							<div key={optIndex} className="flex items-center gap-2 mb-2">
								<input
									type="radio"
									name={`correct-${qIndex} `}
									checked={q.correctOption === opt}
									onChange={(e) => setCorrectOption(qIndex, opt)}
									className="radio radio-primary"
								/>
								<input
									type="text"
									className="input input-bordered flex-1"
									placeholder={`Answer ${optIndex + 1} `}
									value={opt}
									onChange={(e) =>
										handleOptionChange(qIndex, optIndex, e.target.value)
									}
								/>
							</div>
						))}
					</div>
				))}

				<div className="flex flex-col md:flex-row gap-2 md:gap-3">
					<button
						onClick={addNewQuestion}
						className="btn btn-accent"
						disabled={!selectedCourse || quizQuestions[0].question === "" || quizQuestions[0].options[2] === ""}
					>
						+ Add Another Question
					</button>

					<div className="flex gap-1.5">
						{loading ? (
						<button className='btn bg-gray-300 cursor-not-allowed'><div><Loader2 className='w-5 h-5 animate-spin' /></div></button>
					) : (
						<button
						onClick={submitQuiz}
						className="btn btn-warning"
						disabled={!selectedCourse || quizQuestions[0].question === "" || quizQuestions[0].options[2] === ""}
					>
						Submit Quiz
					</button>
					)}
					<button onClick={() => navigate(-1)} className='text-white p-2 rounded-md  bg-gray-400 hover:bg-gray-500 cursor-pointer'>Cancel</button>
					</div>
				</div>
			</div>

		</div>
	)
}

export default CreateQuiz
