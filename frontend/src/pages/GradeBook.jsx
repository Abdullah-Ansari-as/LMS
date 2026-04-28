import React, { useEffect, useState } from "react";
import { getGrades } from "../api/gradesApi";
import { Loader2, User, GraduationCap, FileText, CheckCircle2, XCircle, Award } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";


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
				marks: grade.assignmentGrade,
				totalMarks: 20,
				status: "Submitted",
			});
		} else if (grade.quizSubmited) {
			grouped[course].push({
				type: "Quiz",
				title: grade.title,
				marks: grade.quizGrade,
				totalMarks: 5,
				status: "Submitted",
			});
		} else {
			grouped[course].push({
				type: grade.assignmentGrade ? "Assignment" : "Quiz",
				title: grade.title,
				marks: 0,
				totalMarks: 10,
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

	useEffect(() => {
		const getCurrentStudentGrades = async () => {
			try {
				setLoading(true)
				const res = await getGrades();
				if (res.success) {
					setGrades(res.grades);
				}
			} catch (error) {
				console.error(error);
			} finally {
        setLoading(false);
      }
		}
		getCurrentStudentGrades();
	}, [])

	if (loading) {
		return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] h-full min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600"/>
          <span className="text-slate-500 font-medium animate-pulse">Calculating grades...</span>
        </motion.div>
      </div>
    )
	}

	return (
		<div className="mt-20 bg-[#f8fafc] min-h-screen py-10 px-4 md:px-8 lg:px-12">
			{/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Grade Book</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Review your academic performance</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{user?.name}</span>
        </div>
      </motion.div>
			
		
			{ gradeData.length > 0  ? (
				<div className="space-y-10">
          {gradeData?.map((course, courseIndex) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: courseIndex * 0.1 }}
              className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                  {course.course}
                </h3>
              </div>

              {/* Table Layout: visible on md and up */}
              <div className="overflow-x-auto hidden md:block">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-400">
                      <th className="text-left px-8 py-4 text-[11px] font-black uppercase tracking-widest">Assessment Type</th>
                      <th className="text-left px-8 py-4 text-[11px] font-black uppercase tracking-widest">Title</th>
                      <th className="text-center px-8 py-4 text-[11px] font-black uppercase tracking-widest">Obtained Marks</th>
                      <th className="text-center px-8 py-4 text-[11px] font-black uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {course.items.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-600">{item.type}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-semibold text-slate-900">{item.title}</td>
                        <td className="px-8 py-5 text-center">
                          <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                            {item.marks} <span className="text-indigo-300 mx-1">/</span> {item.totalMarks}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${item.status === "Submitted"
                                ? "bg-green-50/50 text-green-600 border-green-100"
                                : "bg-red-50/50 text-red-600 border-red-100"
                              }`}
                          >
                            {item.status === "Submitted" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card Layout: visible only on small screens */}
              <div className="block md:hidden p-6 space-y-4 bg-slate-50/30">
                {course.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.type}</span>
                        <h4 className="text-base font-black text-slate-900 tracking-tight mt-1">
                          {item.title}
                        </h4>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.status === "Submitted"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                          }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-xs font-bold text-slate-400 uppercase">Obtained Marks:</span>
                      <span className="text-sm font-black text-indigo-600">
                        {item.marks} / {item.totalMarks}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
			) : (
				<motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-3xl border-2 border-dashed border-slate-200"
        >
          <Award className="w-16 h-16 text-slate-200 mb-4" />
          <p className="text-slate-400 font-black text-lg uppercase tracking-widest">No Grades Found Yet</p>
          <p className="text-slate-300 text-sm mt-2">Complete assignments and quizzes to see your grades here.</p>
        </motion.div>
			)}

		</div>
	);
};

export default GradeBook;