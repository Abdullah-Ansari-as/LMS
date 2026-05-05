import React, { useEffect, useMemo, useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { getAllStudents } from "../../api/userApi";
import { getStudentProgress } from "../../api/progressApi";

const StudentProgress = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState({});

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
    if (studentProgress[studentId]) {
      setExpandedStudent(expandedStudent === studentId ? null : studentId);
      return;
    }

    try {
      const res = await getStudentProgress(studentId);
      if (res?.success) {
        setStudentProgress(prev => ({
          ...prev,
          [studentId]: res.progress || [],
        }));
        setExpandedStudent(studentId);
      }
    } catch (error) {
      console.error(error);
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
      <div className="bg-[#F2F3F8] h-full mt-0 md:pt-10 px-3 md:px-7 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#F2F3F8] h-full mt-0 md:pt-10 px-3 md:px-7 p-6">
      <div className="p-3 md:p-6 max-w-6xl bg-[#F8F8F8] mx-auto rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="font-semibold text-2xl">Student Progress</h2>
          <input
            type="text"
            placeholder="Search by student name/email"
            className="input input-bordered w-full sm:w-80 mt-3 sm:mt-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filtered?.map((student) => (
            <div key={student._id} className="bg-white rounded-lg shadow">
              <button
                onClick={() => fetchStudentProgress(student._id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 flex-1">
                  <img
                    className="rounded-full h-12 w-12 object-cover"
                    src={student.profilePicture}
                    alt={student.name}
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    expandedStudent === student._id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedStudent === student._id && studentProgress[student._id] && (
                <div className="px-4 pb-4 border-t">
                  {studentProgress[student._id].length ? (
                    studentProgress[student._id].map((courseData) => {
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

                      const assignmentProgress = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;
                      const quizProgress = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

                      return (
                        <div key={courseId} className="py-4 border-t first:border-t-0">
                          <h4 className="font-semibold text-gray-900 mb-3">{courseName}</h4>

                          <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Lecture Progress</span>
                                <span className="text-sm font-semibold text-indigo-600">{completedLectures}/{totalLectures}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-indigo-600 h-2 rounded-full transition-all"
                                  style={{ width: `${totalLectures ? Math.round((completedLectures / totalLectures) * 100) : 0}%` }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Overall Progress</span>
                                <span className="text-sm font-semibold text-indigo-600">{overallProgress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-slate-900 h-2 rounded-full transition-all"
                                  style={{ width: `${overallProgress}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {totalAssignments > 0 && (
                            <div className="mt-4">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Assignments</span>
                                <span className="text-sm font-semibold text-blue-600">{completedAssignments}/{totalAssignments}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all"
                                  style={{ width: `${assignmentProgress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {totalQuizzes > 0 && (
                            <div className="mt-4">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-600">Quizzes</span>
                                <span className="text-sm font-semibold text-green-600">{completedQuizzes}/{totalQuizzes}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all"
                                  style={{ width: `${quizProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-sm text-gray-500">No progress records available for this student yet.</div>
                  )}
                </div>
              )}
            </div>
          ))}

          {filtered?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No students found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
