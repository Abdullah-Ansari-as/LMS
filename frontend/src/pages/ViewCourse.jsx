import { MdOutlineArrowLeft } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import courseBG from "/courcebg.png";
import { GiWhiteBook } from "react-icons/gi";
import { MdCameraRoll } from "react-icons/md";
import { FaComments } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { closeLectureModal, openLectureModal } from "../redux/slices/uiSlice";
import { toast } from "sonner";
import { BiCheckDouble } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { deleteCourseLecture, getAllCourses } from "../api/courseApi";
import { setCourses } from "../redux/slices/courseSlice";
import CommentSection from "./CommentSection";

const ViewCourse = () => {
  const params = useParams();
  const paramId = params.courseId;
  const dispatch = useDispatch();

  useEffect(() => {
    const saved = localStorage.getItem("completedLectures");
    if (saved) {
      setCompletedLectures(JSON.parse(saved));
    }
  }, []);

  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedLectures, setCompletedLectures] = useState({});

  const allCourses = useSelector((store) => store.course.courses);
  const course = allCourses?.find((c) => c._id === paramId);
  const LectureData = course?.lectures || [];

  const courseData = useSelector((store) => store.course.courses);

  const isOpen = useSelector((state) => state.ui.isLectureModalOpen);




  const openModal = (lecture) => {
    setCurrentLecture(lecture);
    dispatch(openLectureModal());
  };

  const playerContainerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const progressCheckedRef = useRef(false);

  const loadYouTubeAPI = () => {
    if (window.__ytApiPromise) return window.__ytApiPromise;

    window.__ytApiPromise = new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === "function") prev();
        resolve(window.YT);
      };
    });

    return window.__ytApiPromise;
  };

  const extractVideoID = (url) => {
    if (!url) return null;
    if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0];
    if (url.includes("youtu.be/"))
      return url.split("youtu.be/")[1].split("?")[0];
    return null;
  };

  useEffect(() => {
    if (!isOpen || !currentLecture?.lectureUrl) return;

    let mounted = true;
    progressCheckedRef.current = false;

    const videoId = extractVideoID(currentLecture.lectureUrl);
    if (!videoId) {
      return;
    }

    const createPlayer = async () => {
      const YT = await loadYouTubeAPI();
      if (!mounted) return;

      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {
          /* empty */
        }
        playerInstanceRef.current = null;
      }

      const player = new YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: () => {
            player.playVideo();
          },
          onStateChange: (event) => {
            if (
              event.data === YT.PlayerState.PLAYING &&
              !progressCheckedRef.current
            ) {
              const duration = player.getDuration();
              if (!duration || duration <= 0) return;

              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
              }

              progressIntervalRef.current = setInterval(() => {
                try {
                  const currentTime = player.getCurrentTime();
                  if (!currentTime || !duration) return;
                  const ratio = currentTime / duration;

                  if (ratio >= 0.75 && !progressCheckedRef.current) {
                    progressCheckedRef.current = true;
                    setCompletedLectures((prev) => {
                      const updatedLectures = {
                        ...prev,
                        [currentLecture._id]: true,
                      };

                      localStorage.setItem(
                        "completedLectures",
                        JSON.stringify(updatedLectures),
                      );

                      return updatedLectures;
                    });

                    toast("🎉 75% watched! Marked as done.");
                    if (progressIntervalRef.current) {
                      clearInterval(progressIntervalRef.current);
                      progressIntervalRef.current = null;
                    }
                  }
                } catch (e) {
                  // ignore transient errors
                }
              }, 1000);
            }

            if (
              (event.data === YT.PlayerState.PAUSED ||
                event.data === YT.PlayerState.ENDED) &&
              progressIntervalRef.current
            ) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          },
        },
      });

      playerInstanceRef.current = player;
    };

    createPlayer();

    return () => {
      mounted = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {
          /* empty */
        }
        playerInstanceRef.current = null;
      }
      progressCheckedRef.current = false;
    };
  }, [currentLecture, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentLecture(null);

      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {
          /* empty */
        }
        playerInstanceRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      progressCheckedRef.current = false;
    }
  }, [isOpen]);

  const handleDeleteLecture = async (id) => {
    try {
      await deleteCourseLecture(paramId, id);
      toast("❌ Lecture deleted successfully");

      const fetchCourses = async () => {
        const data = await getAllCourses();
        if (data.success) {
          dispatch(setCourses(data.allCourses));
        }
      };
      fetchCourses();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F3F8] py-8 px-2 md:px-8 mt-18">
      <div className="flex items-center">
        <span className="text-2xl mx-auto md:mx-0 font-semibold">
          {course?.courseName}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 my-6">
        <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-md p-4 space-y-3">
          <div className="flex flex-col items-center justify-center mt-6">
            <img
              className="h-34 w-30 rounded-4xl border border-gray-200 p-1"
              src={course?.instructor?.profilePicture}
              alt=""
            />
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-semibold my-1">
                {course?.instructor.name}
              </p>
              <p className="text-sm text-gray-600">
                {course?.instructor.degree}
              </p>
              <p className="text-sm text-gray-600">
                {course?.instructor.university}
              </p>
            </div>
          </div>
          <div className="border-b border-gray-300"></div>
          <ul className="text-sm text-gray-700 space-y-4">
            <Link to={`/course/${paramId}/assignment`}>
              <li className="hover:text-blue-600 cursor-pointer hover:underline pt-3">
                📝 Assignments
              </li>
            </Link>
            <Link to={`/course/${paramId}/quiz`}>
              <li className="hover:text-blue-600 cursor-pointer hover:underline pt-3">
                🧠 Quizzes
              </li>
            </Link>
            <Link to={`/course/${paramId}/announcement`}>
              <li className="hover:text-blue-600 cursor-pointer hover:underline pt-3">
                📢 Announcements
              </li>
            </Link>
            <Link to={`/notes`}>
              <li className="hover:text-blue-600 cursor-pointer hover:underline mt-3">
                📁 Lecture Notes
              </li>
            </Link>
          </ul>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-md">
          <div className="relative">
            <img
              className="h-20 w-full object-cover"
              src={courseBG}
              alt="courseBgImg"
            />
            <div className="absolute inset-0 flex ml-6 justify-between items-center mx-10">
              <h3 className="text-white text-md font-semibold">
                Index / Lesson
              </h3>
              <Link to="/" className="flex items-center">
                <MdOutlineArrowLeft className="h-5 w-5 text-white" />
                <span className="hover:underline text-white text-sm">Back</span>
              </Link>
            </div>
          </div>

          <div className="p-3 md:p-10">
            {LectureData.length > 0 ? (
              LectureData.map((lecture, index) => (
                <div
                  key={lecture._id ?? index}
                  className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 mb-4"
                >
                  <div className="flex gap-1 text-sm items-center justify-between">
                    <div className="flex items-center">
                      <span className="bg-gray-100 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                        {index + 1}
                      </span>
                      <span
                        onClick={() => openModal(lecture)}
                        className="cursor-pointer hover:text-blue-600 hover:underline font-medium"
                      >
                        {lecture.lectureTitle}
                      </span>
                      {completedLectures[lecture._id] && (
                        <span className="relative group cursor-pointer ml-2">
                          <BiCheckDouble className="text-green-500 text-xl" />
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            Completed
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {lecture.duration || "N/A"}
                      </span>
                      <MdDeleteOutline
                        onClick={() => handleDeleteLecture(lecture._id)}
                        className="hover:text-red-500 text-xl cursor-pointer transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-3">
                      <span className="flex items-center text-xs text-gray-600">
                        <GiWhiteBook className="mr-1 text-blue-500" />
                        Notes
                      </span>
                      <span className="flex items-center text-xs text-gray-600">
                        <MdCameraRoll className="mr-1 text-red-400" />
                        Video
                      </span>
                    </div>
                  
                  </div>

                  {lecture.description && (
                    <p className="text-xs text-gray-500 mt-2 pl-8">
                      {lecture.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <div className="text-gray-300 text-6xl mb-4">📚</div>
                <p className="text-gray-500 text-lg">
                  No lectures uploaded yet!
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Check back soon for course content
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && currentLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative mx-4 h-[90vh] w-full max-w-6xl flex flex-col rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {currentLecture.lectureTitle || "Lecture Video"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {course?.courseName}
                </p>
              </div>
              <button
                onClick={() => dispatch(closeLectureModal())}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-0">
              {/* Video Player - Left Side (2/3 on desktop) */}
              <div className="lg:w-2/3 w-full p-4 lg:p-6">
                <div className="bg-gray-900 rounded-lg overflow-hidden h-full">
                  <div
                    ref={playerContainerRef}
                    className="w-full h-full min-h-[400px]"
                  />
                </div>

                {/* Lecture Info */}
                <div className="mt-4 space-y-3">
                  <div>
                  
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {currentLecture.description || "No description provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-blue-600 font-medium">
                        Status
                      </p>
                      <p className="font-medium">
                        {completedLectures[currentLecture._id]
                          ? "Completed ✓"
                          : "In Progress"}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-xs text-green-600 font-medium">
                        Duration
                      </p>
                      <p className="font-medium">
                        {currentLecture.duration || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section - Right Side (1/3 on desktop) */}
              <div className="lg:w-1/3 w-full border-l border-gray-200">
                <div className="h-full flex flex-col">
                

                  {/* Comments List */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <CommentSection isOpen={isOpen} />
                  </div>

                  {/* Quick Stats */}
                  <div className=" p-4 bg-gray-50">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                 
                </div>
                <button
                  onClick={() => dispatch(closeLectureModal())}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Close Lecture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCourse;
