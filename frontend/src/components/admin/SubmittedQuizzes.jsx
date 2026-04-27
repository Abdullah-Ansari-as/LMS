import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Eye } from "lucide-react";
import { fetchSubmittedQuizesAdmin } from "../../api/courseApi";
import { Link } from "react-router-dom";

const SubmittedQuizzes = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchSubmittedQuizesAdmin();
        if (res?.success) setSubmitted(res.submittedQuizes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return submitted;

    return submitted.filter((s) => {
      const studentName = s?.studentId?.name || "";
      const studentEmail = s?.studentId?.email || "";
      const course = s?.quizId?.selectedCourse || s?.course || "";
      const quizTitle = s?.quizId?.quizTitle || `Quiz ${s.quizNo}` || "";
      return (
        studentName.toLowerCase().includes(q) ||
        studentEmail.toLowerCase().includes(q) ||
        course.toLowerCase().includes(q) ||
        quizTitle.toLowerCase().includes(q)
      );
    });
  }, [submitted, search]);

  return (
    <div className="bg-[#F2F3F8] h-full mt-0 md:pt-10 px-3 md:px-7 p-6">
      <div className="p-3 md:p-6 max-w-6xl bg-[#F8F8F8] mx-auto rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="font-semibold text-2xl">Submitted Quizzes</h2>
          <input
            type="text"
            placeholder="Search by student, course, or quiz"
            className="input input-bordered w-full sm:w-80 mt-3 sm:mt-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200 text-base font-semibold">
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Quiz Title</th>
                  <th>Result</th>
                  <th>Submitted At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          className="rounded-full h-10 w-10 object-cover"
                          src={s?.studentId?.profilePicture}
                          alt="..."
                        />
                        <div>
                          <div className="font-semibold">{s?.studentId?.name}</div>
                          <div className="text-xs text-gray-500">
                            {s?.studentId?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{s?.quizId?.selectedCourse || s?.course}</td>
                    <td>{s?.quizId?.quizTitle || `Quiz ${s.quizNo}`}</td>
                    <td className="font-bold text-indigo-600">
                        {s.result.toFixed(2)} / {s?.quizId?.totalMarks || 5}
                    </td>
                    <td>
                      {s.submittedAt
                        ? new Date(s.submittedAt).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                        <Link 
                            to={`/admin/show-submitted-quiz/${s.quizId?._id || s.quizId}?course=${s.quizId?.selectedCourse || s.course}&quizNo=${s.quizNo}&studentId=${s.studentId?._id || s.studentId}&selectedStudent=${s.studentId?.name || ''}`}
                            className="btn btn-sm btn-ghost text-blue-600 flex items-center gap-1"
                        >
                            <Eye size={16} /> View
                        </Link>
                    </td>
                  </tr>
                ))}

                {filtered?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No submitted quizzes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmittedQuizzes;
