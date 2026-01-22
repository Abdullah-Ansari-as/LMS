import React, { useState } from "react";
import { useSelector } from "react-redux";
import { uploadGrades } from "../../api/gradesApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UploadGrades = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [title, setTitle] = useState("");
  const [assignmentGrade, setAssignmentGrade] = useState("");
  const [quizGrade, setQuizGrade] = useState("");
  const [isAssignment, setIsAssignment] = useState(false);
  const [isQuiz, setIsQuiz] = useState(false);
  const [loading, setLoading] = useState(false);

  const allStudents = useSelector((store) => store.user.allStudents);
  const allCourses = useSelector((store) => store.course.courses);
  const submittedQuizes = useSelector((store) => store.course.submittedQuizes);
  //   console.log("submittedQuizes: ", submittedQuizes[0].quizNo)
  //   console.log("title", title);

  const matchedQuiz = submittedQuizes?.find(
    (quiz) => quiz?.quizNo?.toLowerCase() === title.trim().toLowerCase()
  );

  const handleUpload = async () => {
    if (
      !selectedCourse ||
      !selectedStudent.name ||
      !selectedStudent._id ||
      !title
    ) {
      alert("Please select a course and student.");
      return;
    }

    if (!isAssignment && !isQuiz) {
      alert("Please select at least one grade to upload (assignment or quiz).");
      return;
    }

    const gradeData = {
      selectedCourse,
      selectedStudent: selectedStudent.name,
      selectedStudentId: selectedStudent._id,
      title,
      assignmentGrade: isAssignment ? Number(assignmentGrade) : 0,
      quizGrade: isQuiz ? Number(quizGrade) : 0,
      assignmentSubmited: isAssignment,
      quizSubmited: isQuiz,
    };

    try {
      setLoading(true);
      const result = await uploadGrades(gradeData);
      if (result.success) {
        setLoading(false);
        toast.success(
          `Grades uploaded for ${selectedStudent.name} in ${selectedCourse}`
        );

        setSelectedCourse("");
        setSelectedStudent(null);
        setTitle("");
        setAssignmentGrade("");
        setQuizGrade("");
        setIsAssignment(false);
        setIsQuiz(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F2F3F8] h-full mt-0 md:pt-10 px-3 md:px-7 p-6">
      <h2 className="font-semibold text-2xl">Upload Grades</h2>

      <div className="bg-[#F8F8F8] my-6 p-3 md:p-6">
        {/* Course Selector */}
        <div className="form-control mb-4">
          <label className="label font-semibold pr-3">Select Course</label>
          <select
            className="select select-bordered"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">-- Choose Course --</option>
            {allCourses?.map((course) => (
              <option key={course._id} value={course?.courseName}>
                {course?.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Student Selector */}
        <div className="form-control mb-4">
          <label className="label font-semibold pr-3">Select Student</label>
          <select
            className="select select-bordered"
            value={selectedStudent ? JSON.stringify(selectedStudent) : ""}
            onChange={(e) => {
              const selected = JSON.parse(e.target.value);
              setSelectedStudent(selected);
            }}
          >
            <option value="">-- Choose Student --</option>
            {allStudents?.map((student) => (
              <option key={student._id} value={JSON.stringify(student)}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="form-control mb-4 flex gap-5">
          <label className="label font-semibold pr-3">Title</label>
          <input
            type="text"
            placeholder="Enter Title (e.g. Quiz/Assignment No 1)"
            className="input input-bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {matchedQuiz && (

            <button
              onClick={() => {
                const params = new URLSearchParams({
                  course: selectedCourse,
                  quizNo: matchedQuiz?.quizNo,
                  studentId: selectedStudent?._id,
                  studentName: selectedStudent?.name,
                });
                window.open(
                  `/quiz/${matchedQuiz?.quizId}?${params.toString()}`,
                  "_blank"
                );

              }}
              className="btn btn-primary p-1 rounded text-white border-transparent"
            >
              Show Quiz
            </button>
          )}
        </div>

        {/* Checkboxes to toggle input fields */}
        <div className="form-control mb-4 flex flex-col md:flex-row gap-4">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAssignment}
              onChange={() => setIsAssignment(!isAssignment)}
            />
            <span>Include Assignment Grade</span>
          </label>

          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={isQuiz}
              onChange={() => setIsQuiz(!isQuiz)}
            />
            <span>Include Quiz Grade</span>
          </label>
        </div>

        {/* Conditional Input: Assignment */}
        {isAssignment && (
          <div className="form-control mb-4">
            <label className="label font-semibold pr-3">Assignment Grade</label>
            <input
              type="number"
              placeholder="Enter marks (e.g. 20)"
              className="input input-bordered"
              value={assignmentGrade}
              max="20"
              onChange={(e) => setAssignmentGrade(e.target.value)}
            />
          </div>
        )}

        {/* Conditional Input: Quiz */}
        {isQuiz && (
          <div className="form-control mb-4">
            <label className="label font-semibold pr-3">Quiz Grade</label>
            <input
              type="number"
              placeholder="Enter marks (e.g. 15)"
              className="input input-bordered"
              value={quizGrade}
              onChange={(e) => setQuizGrade(e.target.value)}
            />
          </div>
        )}

        {loading ? (
          <button className="btn btn-success w-full mt-2 text-base cursor-none">
            <div>
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            please wait
          </button>
        ) : (
          <button
            className="btn btn-success text-base w-full mt-2"
            onClick={handleUpload}
          >
            Upload Grades
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadGrades;
