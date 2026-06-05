import React, { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  ChevronDown,
  TrendingUp,
  Search,
  Users,
  BookOpen,
  ClipboardList,
  HelpCircle,
  GraduationCap,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllStudents } from "../../api/userApi";
import { getStudentProgress } from "../../api/progressApi";

const ProgressBar = ({ label, completed, total, color, icon: Icon }) => {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`rounded-xl p-2 ${color.bg}`}>
            <Icon className={`h-4 w-4 ${color.text}`} />
          </div>
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </div>
        <span className={`text-sm font-bold tabular-nums ${color.text}`}>
          {completed}/{total}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${color.bar}`}
        />
      </div>
      <p className="mt-2 text-xs font-medium text-slate-400">{percent}% complete</p>
    </div>
  );
};

const CourseProgressCard = ({ courseData }) => {
  const {
    courseId,
    courseName,
    totalLectures,
    completedLectures,
    totalAssignments,
    completedAssignments,
    totalQuizzes,
    completedQuizzes,
    overallProgress,
  } = courseData;

  const lecturePercent =
    totalLectures > 0
      ? Math.round((completedLectures / totalLectures) * 100)
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-600 p-2.5 shadow-lg shadow-indigo-100">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">{courseName}</h4>
            <p className="text-xs font-medium text-slate-500">
              Overall completion across all activities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${overallProgress} 100`}
              />
            </svg>
            <span className="absolute text-sm font-black text-indigo-600">
              {overallProgress}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
        <ProgressBar
          label="Lectures"
          completed={completedLectures}
          total={totalLectures}
          icon={GraduationCap}
          color={{
            bg: "bg-indigo-50",
            text: "text-indigo-600",
            bar: "bg-indigo-600",
          }}
        />

        {totalAssignments > 0 && (
          <ProgressBar
            label="Assignments"
            completed={completedAssignments}
            total={totalAssignments}
            icon={ClipboardList}
            color={{
              bg: "bg-blue-50",
              text: "text-blue-600",
              bar: "bg-blue-500",
            }}
          />
        )}

        {totalQuizzes > 0 && (
          <ProgressBar
            label="Quizzes"
            completed={completedQuizzes}
            total={totalQuizzes}
            icon={HelpCircle}
            color={{
              bg: "bg-emerald-50",
              text: "text-emerald-600",
              bar: "bg-emerald-500",
            }}
          />
        )}

        {totalLectures === 0 && totalAssignments === 0 && totalQuizzes === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No activities added to this course yet.
          </div>
        )}

        {totalLectures > 0 && lecturePercent === 100 && overallProgress < 100 && (
          <div className="col-span-full rounded-xl bg-indigo-50 px-4 py-3 text-xs font-medium text-indigo-700">
            All lectures completed. Remaining progress depends on assignments and quizzes.
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StudentProgress = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState({});
  const [loadingProgressId, setLoadingProgressId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const studentsRes = await getAllStudents();
        if (studentsRes?.success) {
          setStudents(studentsRes.user || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchStudentProgress = async (studentId) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
      return;
    }

    if (studentProgress[studentId]) {
      setExpandedStudent(studentId);
      return;
    }

    try {
      setLoadingProgressId(studentId);
      const res = await getStudentProgress(studentId);
      if (res?.success) {
        setStudentProgress((prev) => ({
          ...prev,
          [studentId]: res.progress || [],
        }));
        setExpandedStudent(studentId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProgressId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;

    return students.filter((s) => {
      const name = s?.name || "";
      const email = s?.email || "";
      return (
        name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q)
      );
    });
  }, [students, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 pt-10">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-10 py-12 shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-500">
            Loading student records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8 md:px-8 lg:px-10 md:pt-10">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-indigo-600 p-3.5 shadow-lg shadow-indigo-100">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Student Progress
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Monitor lecture, assignment, and quiz completion for every student
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="mb-1 flex items-center gap-2 text-slate-400">
                <Users className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Total
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900">{students.length}</p>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 shadow-sm">
              <div className="mb-1 flex items-center gap-2 text-indigo-400">
                <Search className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Showing
                </span>
              </div>
              <p className="text-2xl font-black text-indigo-600">{filtered.length}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name or email..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Student List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((student, index) => {
              const isExpanded = expandedStudent === student._id;
              const progress = studentProgress[student._id];
              const isLoadingProgress = loadingProgressId === student._id;

              return (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => fetchStudentProgress(student._id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-slate-50/80"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="relative shrink-0">
                        <img
                          className="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-md ring-2 ring-indigo-100"
                          src={student.profilePicture}
                          alt={student.name}
                        />
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-indigo-600 p-1">
                          <GraduationCap className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-base font-bold text-slate-900">
                          {student.name}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-slate-500">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{student.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {isLoadingProgress && (
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                      )}
                      <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 sm:inline">
                        {isExpanded ? "Hide details" : "View progress"}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-indigo-600" : ""
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && progress && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 bg-slate-50/40 px-5 pb-5 pt-4">
                          {progress.length > 0 ? (
                            <div className="space-y-4">
                              {progress.map((courseData) => (
                                <CourseProgressCard
                                  key={courseData.courseId}
                                  courseData={courseData}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
                              <div className="mb-3 rounded-2xl bg-slate-100 p-4">
                                <TrendingUp className="h-8 w-8 text-slate-400" />
                              </div>
                              <p className="text-sm font-semibold text-slate-700">
                                No progress records yet
                              </p>
                              <p className="mt-1 max-w-sm text-xs text-slate-500">
                                This student has not started any course activities.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm"
            >
              <div className="mb-4 rounded-2xl bg-indigo-50 p-5">
                <Users className="h-10 w-10 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No students found</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Try adjusting your search to find a student by name or email address.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProgress;
