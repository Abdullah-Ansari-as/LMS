import React, { useEffect, useState } from "react";
import { getGrades } from "../api/gradesApi";
import { Loader2, User } from "lucide-react";
import { useSelector } from "react-redux";


// Group grades by course
const groupGradesByCourse = (grades) => {
	const grouped = {};

	grades.forEach((grade) => {
		const course = grade.selectedCourse;

		if (!grouped[course]) {
			grouped[course] = [];
		}

		if (grade.assignmentSubmited) {
			grouped[course].push({
				type: "Assignment",
				title: grade.title,
				marks: `${grade.assignmentGrade} / 20`,
				status: "Submitted",
			});
		} else if (grade.quizSubmited) {
			grouped[course].push({
				type: "Quiz",
				title: grade.title,
				marks: `${grade.quizGrade} / 5`,
				status: "Submitted",
			});
		} else {
			// Optional: handle unsubmitted entries if needed
			grouped[course].push({
				type: grade.assignmentGrade ? "Assignment" : "Quiz",
				title: grade.title,
				marks: "0 / 10",
				status: "Not Submitted",
			});
		}
	});

	// Convert object into array
	return Object.entries(grouped).map(([course, items], index) => ({
		id: index + 1,
		course,
		items,
	}));
};

const GradeBook = () => {

	const {user} = useSelector((store) => store.user)

	const [grades, setGrades] = useState([]);
	const [loading, setLoading] = useState(false);

	const gradeData = groupGradesByCourse(grades);

	// console.log(gradeData)

	useEffect(() => {
		const getCurrentStudentGrades = async () => {
			try {
				setLoading(true)
				const res = await getGrades();
				if (res.success) {
					setLoading(false);
					setGrades(res.grades);
				}
			} catch (error) {
				setLoading(false);
				console.error(error);
			}
		}
		getCurrentStudentGrades();
	}, [])

	if (loading) {
		return <div className="flex-1 flex items-center justify-center bg-[#F2F3F8] h-full py-8 px-7">
			<div><Loader2 className="h-10 w-10 animate-spin" /></div>
		</div>
	}

	return (
		<div className={`h-auto mt-18 bg-[#F2F3F8] py-8 px-2 md:px-7`}>
			<div className='flex items-center px-6 py-3 md:py-6'>
				<span className='text-2xl mx-auto md:mx-0'>Grade Book</span>
			</div>
			
		
			{ gradeData.length > 0  ? (
				gradeData?.map((course) => (
				<div key={course.id} className="mb-6 bg-white shadow-lg rounded-lg p-5">
					<h3 className="text-lg font-semibold text-[#716ACA] mb-4">
						📘 {course.course.toUpperCase()}
					</h3>

					{/* Table Layout: visible on md and up */}
					<div className="overflow-x-auto hidden md:block">
						<table className="min-w-full border-collapse">
							<thead>
								<tr className="bg-[#7E79C9] text-gray-100">
									<th className="text-left p-3">Type</th>
									<th className="text-left p-3">Title</th>
									<th className="text-center p-3">Obtained Marks</th>
									<th className="text-center p-3">Status</th>
								</tr>
							</thead>
							<tbody>
								{course.items.map((item, idx) => (
									<tr key={idx} className="border-b hover:bg-gray-50 transition">
										<td className="p-3">{item.type}</td>
										<td className="p-3">{item.title}</td>
										<td className="p-3 text-center font-semibold">{item.marks}</td>
										<td className="p-3 text-center">
											<span
												className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === "Submitted"
														? "bg-green-100 text-green-600"
														: "bg-red-100 text-red-600"
													}`}
											>
												{item.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Card Layout: visible only on small screens */}
					<div className="block md:hidden space-y-4">
						{course.items.map((item, idx) => (
							<div
								key={idx}
								className="bg-gray-50 rounded-xl shadow-md p-2 border border-gray-200"
							>
								<p className="text-sm text-gray-500 mb-1">{item.type}</p>
								<h4 className="text-base font-semibold text-gray-800 mb-2">
									{item.title}
								</h4>
								<p className="text-sm mb-1">
									<span className="font-medium text-gray-600">Marks: </span>
									<span className="text-[#716ACA] font-semibold">{item.marks}</span>
								</p>
								<p className="text-sm">
									<span className="font-medium text-gray-600">Status: </span>
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${item.status === "Submitted"
												? "bg-green-100 text-green-600"
												: "bg-red-100 text-red-600"
											}`}
									>
										{item.status}
									</span>
								</p>
							</div>
						))}
					</div>
				</div>
			))
			) : (
				<p className="flex items-center justify-center h-screen">No Grades Found for {user?.name}!</p>
			)}

		</div>
	);
};

export default GradeBook;