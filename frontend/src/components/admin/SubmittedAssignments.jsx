import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchSubmittedAssignmentsAdmin } from "../../api/courseApi";

const SubmittedAssignments = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchSubmittedAssignmentsAdmin();
        if (res?.success) setSubmitted(res.submittedAssignments || []);
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
      const course = s?.assignmentId?.selectedCourse || s?.course || "";
      return (
        studentName.toLowerCase().includes(q) ||
        studentEmail.toLowerCase().includes(q) ||
        course.toLowerCase().includes(q)
      );
    });
  }, [submitted, search]);

  return (
    <div className="bg-[#F2F3F8] h-full mt-0 md:pt-10 px-3 md:px-7 p-6">
      <div className="p-3 md:p-6 max-w-6xl bg-[#F8F8F8] mx-auto rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="font-semibold text-2xl">Submitted Assignments</h2>
          <input
            type="text"
            placeholder="Search by student/course"
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
                  <th>Due Date</th>
                  <th>Marks</th>
                  <th>Submitted At</th>
                  <th>File</th>
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
                    <td>{s?.assignmentId?.selectedCourse || s?.course}</td>
                    <td className="text-red-500">{s?.assignmentId?.dueDate}</td>
                    <td>{s?.assignmentId?.totalMarks}</td>
                    <td>
                      {s?.submittedAt
                        ? new Date(s.submittedAt).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      {s?.file ? (
                        <a
                          className="text-blue-500 hover:underline"
                          href={`${import.meta.env.VITE_BACKEND_URL}/api/courses/download?url=${encodeURIComponent(
                            s.file
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}

                {filtered?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No submitted assignments found.
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

export default SubmittedAssignments;

