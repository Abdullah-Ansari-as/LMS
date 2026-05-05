import { Loader2, TrendingUp, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProgress } from "../api/progressApi";
import { motion, AnimatePresence } from "framer-motion";

const Progress = () => {
  const allCourses = useSelector((store) => store.course.courses);
  const [currentId, setCurrentId] = useState(allCourses[0]?._id);
  const [loading, setLoading] = useState(false);
  const [courseName, setCourseName] = useState(allCourses[0]?.courseName);
  const [progressData, setProgressData] = useState([]);

  const handleClick = (id, name) => {
    setCourseName(name);
    setCurrentId(id);
  };

  useEffect(() => {
    if (!courseName) return;
    const fetchAndSetProgress = async () => {
      try {
        setLoading(true);
        const res = await getProgress(courseName);
        if (res.success) {
          setProgressData(res.progress);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetProgress();
  }, [courseName]);

  return (
    <div className="mt-20 bg-[#f8fafc] min-h-screen py-10 px-4 md:px-8 lg:px-12">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Progress Status</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Track your academic milestones</p>
          </div>
        </div>
      </motion.div>

      {/* Course Selection Tabs */}
      <div className="mb-8 overflow-x-auto custom-scrollbar pb-2">
        <div className="flex gap-2 min-w-max">
          {allCourses.map((course) => (
            <motion.button
              key={course._id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClick(course._id, course.courseName)}
              className={`
                px-6 py-3 rounded-2xl font-bold text-sm transition-all border
                ${course._id === currentId 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600 shadow-sm"}
              `}
            >
              {course.courseName}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Graded Activities
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
              {courseName}
            </span>
          </h3>
          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> Submitted</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Pending</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center p-20 gap-4"
            >
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">Syncing records...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
              {/* Assignments Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Assignments</h4>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-200"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {progressData?.assignments?.length > 0 ? (
                    progressData.assignments.map((ass, index) => (
                      <motion.div
                        key={ass._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex justify-between items-center bg-white hover:bg-slate-50 p-4 rounded-2xl border border-slate-200 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${ass.submit ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                            {ass.submit ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                          </div>
                          <div>
                            <span className="text-sm font-black text-slate-900 leading-none">Assignment {index + 1}</span>
                            <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase">Course Requirement</p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-2 ${ass.submit
                            ? "bg-green-50/50 text-green-600 border-green-100"
                            : "bg-red-50/50 text-red-600 border-red-100"
                            }`}
                        >
                          {ass.submit ? "Complete" : "Action Needed"}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No Assignments Yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quizzes Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Quizzes</h4>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-200"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {progressData?.quizzes?.length > 0 ? (
                    progressData.quizzes.map((quiz, index) => (
                      <motion.div
                        key={quiz._id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex justify-between items-center bg-white hover:bg-slate-50 p-4 rounded-2xl border border-slate-200 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${quiz.submit ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                            {quiz.submit ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                          </div>
                          <div>
                            <span className="text-sm font-black text-slate-900 leading-none">Quiz {index + 1}</span>
                            <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase">Assessment Item</p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-2 ${quiz.submit
                            ? "bg-green-50/50 text-green-600 border-green-100"
                            : "bg-red-50/50 text-red-600 border-red-100"
                            }`}
                        >
                          {quiz.submit ? "Complete" : "Action Needed"}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No Quizzes Yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Progress;
