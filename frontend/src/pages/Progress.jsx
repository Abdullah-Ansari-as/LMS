import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProgress } from "../api/progressApi";

const Progress = () => {

  const allCourses = useSelector((store) => store.course.courses);
  const [currentId, setCurrentId] = useState(allCourses[0]._id);
  const [loading, setLoading] = useState(false);
  const [courseName, setCourseName] = useState(allCourses[0]?.courseName);
  const [progressData, setProgressData] = useState([]);

  const handleClick = (id, name) => {
    setCourseName(name);
    setCurrentId(id);
  };

  useEffect(() => {
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
    <div className="mt-18 bg-[#F2F3F8] h-auto md:h-full py-8 px-2 md:px-7">
      <div className="flex items-center px-6 py-3 md:py-6">
        <h2 className='text-2xl mx-auto md:mx-0'>Progress Status</h2>
      </div>

      <div className="grid bg-white grid-cols-1 sm:grid-cols-4 gap-2 shadow">
        {
          allCourses.map((course) => (
            <div key={course._id} className="cursor-pointer">
              <div
                onClick={() => handleClick(course._id, course.courseName)}
                className={`${course._id === currentId ? "bg-[#7e79c9] text-white" : ""} text-center border rounded border-gray-300 p-2`}
              >
                {course.courseName}
              </div>
            </div>
          ))
        }
      </div>

      <div className="border border-gray-200 p-1.5 md:p-3 bg-white mt-1 rounded-md">
        <div className="flex items-center mb-4">
          <span className="text-xl font-semibold">Graded Activities</span>
        </div>
        <div className="border-b border-gray-300 mb-4"></div>

        {loading ? (
          <div className="flex justify-center items-center p-5">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row text-center gap-4">

            {/* Assignments */}
            <div className="md:w-1/2 border-gray-300 md:border-r">
              <p className="font-semibold">Assignments</p>
              <div className="text-start mx-2 md:mx-3 mt-5">
                <ol className="list-decimal list-inside space-y-3 text-gray-800">
                  {progressData?.assignments?.length > 0 ? (
                    progressData.assignments.map((ass, index) => (
                      <li
                        key={ass._id}
                        className="flex justify-between items-center bg-white shadow-sm p-3 rounded-md border border-gray-200"
                      >
                        <span className="text-sm md:text-base md:font-medium">Assignment {index + 1}</span>
                        <span
                          className={`text-xs md:text-sm font-semibold p-1.5 md:px-3 py-1 rounded-full ${ass.submit
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {ass.submit ? "Submitted" : "Not Submitted"}
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="flex items-center justify-center">
                      <p className="text-red-500">No Status Found!</p>
                    </div>
                  )}
                </ol>
              </div>
            </div>

            {/* Quizzes */}
            <div className="md:w-1/2">
              <p className="font-semibold">Quizzes</p>
              <div className="text-start mx-2 md:mx-3 mt-5">
                <ol className="list-decimal list-inside space-y-3 text-gray-800">
                  {progressData?.quizzes?.length > 0 ? (
                    progressData.quizzes.map((quiz, index) => (
                      <li
                        key={quiz._id}
                        className="flex justify-between items-center bg-white shadow-sm p-3 rounded-md border border-gray-200"
                      >
                        <span className="text-sm md:text-base md:font-medium">Quiz {index + 1}</span>
                        <span
                          className={`text-xs md:text-sm font-semibold p-1.5 md:px-3 py-1 rounded-full ${quiz.submit
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          {quiz.submit ? "Submitted" : "Not Submitted"}
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="flex items-center justify-center">
                      <p className="text-red-500">No Status Found!</p>
                    </div>
                  )}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>



    </div>
  );
};

export default Progress;
