import { MdOutlineArrowLeft } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import courseBG from "/courcebg.png";
import { MdCameraRoll } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { closeLectureModal, openLectureModal } from "../redux/slices/uiSlice";
import { toast } from "sonner";
import { BiCheckDouble } from "react-icons/bi";
import CommentSection from "./CommentSection";
import { FaFileAlt } from "react-icons/fa";
import { X } from "lucide-react";
import { getAllCourses } from "../api/courseApi";
import { getProgress, markLectureComplete } from "../api/progressApi";
import { setCourses } from "../redux/slices/courseSlice";

const WATCH_COMPLETION_THRESHOLD = 0.5;
const PROGRESS_CHECK_INTERVAL_MS = 1000;
const MAX_PLAYBACK_DELTA_SEC = 3;

const formatWatchTime = (seconds) => {
  if (!seconds || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const ViewCourse = () => {
  const params = useParams();
  const paramId = params.courseId;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLatestCourses = async () => {
      try {
        const data = await getAllCourses();
        if (data?.success) {
          dispatch(setCourses(data.allCourses || []));
        }
      } catch (error) {
        console.error("Failed to refresh course data:", error);
      }
    };

    fetchLatestCourses();
  }, [dispatch]);

  useEffect(() => {
    const saved = localStorage.getItem("completedLectures");
    if (saved) {
      setCompletedLectures(JSON.parse(saved));
    }
  }, []);

  const { user } = useSelector((store) => store.user);

  const [currentLecture, setCurrentLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState({});
  const [comments, setComments] = useState([]);
  const [selectLecture, setSelectLecture] = useState(null);
  const [selectedHandoutLecture, setSelectedHandoutLecture] = useState(null);
  const [handoutText, setHandoutText] = useState("");
  const [watchProgress, setWatchProgress] = useState({ watched: 0, duration: 0 });

  const allCourses = useSelector((store) => store.course.courses);
  const course = allCourses?.find((c) => c._id === paramId);
  const LectureData = course?.lectures || [];

  const isOpen = useSelector((state) => state.ui.isLectureModalOpen);

  useEffect(() => {
    const loadServerCompletedLectures = async () => {
      if (!course?.courseName) return;

      try {
        const res = await getProgress(course.courseName);
        const completedIds =
          res?.progress?.lectureProgress?.completedLectureIds || [];

        if (!completedIds.length) return;

        setCompletedLectures((prev) => {
          const updated = { ...prev };
          completedIds.forEach((id) => {
            updated[id] = true;
          });
          localStorage.setItem("completedLectures", JSON.stringify(updated));
          return updated;
        });
      } catch (error) {
        console.error("Failed to load lecture completion status:", error);
      }
    };

    loadServerCompletedLectures();
  }, [course?.courseName]);

  const openModal = (lecture) => {
    // console.log("lecture: ", lecture)
    setCurrentLecture(lecture);
    dispatch(openLectureModal());
  };

  const playerContainerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const progressCheckedRef = useRef(false);
  const lastPlaybackTimeRef = useRef(null);
  const watchedSecondsRef = useRef(0);
  const videoDurationRef = useRef(0);

  const markLectureCompletedOnServer = async (watchedSeconds, videoDuration) => {
    if (!course?._id || !currentLecture?._id) return;
    try {
      await markLectureComplete(
        course._id,
        currentLecture._id,
        watchedSeconds,
        videoDuration,
      );
    } catch (error) {
      console.error("Failed to save lecture progress:", error);
    }
  };

  const handleWatchProgress = (player) => {
    const duration = videoDurationRef.current || player.getDuration();
    if (!duration || duration <= 0) return;

    videoDurationRef.current = duration;

    const currentTime = player.getCurrentTime();
    if (currentTime == null || Number.isNaN(currentTime)) return;

    const lastTime = lastPlaybackTimeRef.current;
    if (lastTime !== null) {
      const delta = currentTime - lastTime;
      if (delta > 0 && delta <= MAX_PLAYBACK_DELTA_SEC) {
        watchedSecondsRef.current += delta;
      }
    }

    lastPlaybackTimeRef.current = currentTime;

    setWatchProgress({
      watched: watchedSecondsRef.current,
      duration,
    });

    const watchedRatio = watchedSecondsRef.current / duration;
    if (
      watchedRatio >= WATCH_COMPLETION_THRESHOLD &&
      !progressCheckedRef.current
    ) {
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

      markLectureCompletedOnServer(watchedSecondsRef.current, duration);
      toast("🎉 50% watched! Lecture marked as completed.");
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };

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
    progressCheckedRef.current = !!completedLectures[currentLecture._id];
    lastPlaybackTimeRef.current = null;
    watchedSecondsRef.current = 0;
    videoDurationRef.current = 0;
    setWatchProgress({ watched: 0, duration: 0 });

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

              videoDurationRef.current = duration;

              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
              }

              progressIntervalRef.current = setInterval(() => {
                try {
                  handleWatchProgress(player);
                } catch (e) {
                  // ignore transient errors
                }
              }, PROGRESS_CHECK_INTERVAL_MS);
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
      lastPlaybackTimeRef.current = null;
      watchedSecondsRef.current = 0;
      videoDurationRef.current = 0;
      setWatchProgress({ watched: 0, duration: 0 });
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
      lastPlaybackTimeRef.current = null;
      watchedSecondsRef.current = 0;
      videoDurationRef.current = 0;
      setWatchProgress({ watched: 0, duration: 0 });
    }
  }, [isOpen]);

  const openHandoutModal = (lecture) => {
    if (!lecture?.handout?.fileUrl) {
      toast("No handout uploaded for this lecture yet.");
      return;
    }

    setSelectedHandoutLecture(lecture);
  };

  const closeHandoutModal = () => {
    setSelectedHandoutLecture(null);
  };

  const getFileExtension = (fileName = "", fileUrl = "") => {
    const source = fileName || fileUrl;
    return source.split(".").pop()?.split("?")[0]?.toLowerCase() || "";
  };

  const getHandoutPreviewType = (lecture) => {
    const extension = getFileExtension(
      lecture?.handout?.fileName,
      lecture?.handout?.fileUrl,
    );

    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension)) {
      return "image";
    }

    if (["pdf"].includes(extension)) {
      return "iframe";
    }

    if (["txt", "md"].includes(extension)) {
      return "text";
    }

    if (["docx"].includes(extension)) {
      return "docx";
    }

    if (["doc", "ppt", "pptx", "xls", "xlsx"].includes(extension)) {
      return "office";
    }

    return "fallback";
  };

  const getHandoutPreviewUrl = (lecture) => {
    const fileUrl = lecture?.handout?.fileUrl;
    if (!fileUrl) return "";

    const previewType = getHandoutPreviewType(lecture);

    if (previewType === "office") {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
    }

    return fileUrl;
  };

  useEffect(() => {
    if (selectedHandoutLecture) {
      if (selectedHandoutLecture.handout?.handoutContent) {
        setHandoutText(selectedHandoutLecture.handout.handoutContent);
        return;
      }

      const type = getHandoutPreviewType(selectedHandoutLecture);
      if (type === "text") {
        fetch(selectedHandoutLecture.handout.fileUrl)
          .then((res) => res.text())
          .then((text) => setHandoutText(text))
          .catch((err) => {
            console.error("Failed to fetch handout text:", err);
            setHandoutText("Error loading handout text.");
          });
      } else if (type === "docx") {
        fetch(selectedHandoutLecture.handout.fileUrl)
          .then((res) => res.arrayBuffer())
          .then((arrayBuffer) => {
            if (window.mammoth) {
              window.mammoth
                .convertToHtml({ arrayBuffer: arrayBuffer })
                .then((result) => {
                  setHandoutText(result.value);
                })
                .catch((err) => {
                  console.error("Mammoth error:", err);
                  setHandoutText("Error converting .docx file.");
                });
            } else {
              setHandoutText("Document parser not loaded. Please try again.");
            }
          })
          .catch((err) => {
            console.error("Failed to fetch .docx handout:", err);
            setHandoutText("Error loading .docx handout.");
          });
      } else {
        setHandoutText("");
      }
    } else {
      setHandoutText("");
    }
  }, [selectedHandoutLecture]);

  const renderWatchProgress = (variant = "overlay") => {
    if (!currentLecture) return null;

    const isCompleted = completedLectures[currentLecture._id];
    const { watched, duration } = watchProgress;
    const requiredWatch = duration * WATCH_COMPLETION_THRESHOLD;
    const progressPercent = isCompleted
      ? 100
      : requiredWatch > 0
        ? Math.min(100, Math.round((watched / requiredWatch) * 100))
        : 0;

    const isStrip = variant === "strip";

    return (
      <div
        className={
          isStrip
            ? "border-b border-slate-200 bg-slate-900 px-2.5 py-2 sm:px-4 sm:py-2.5"
            : "absolute top-0 left-0 right-0 z-10 bg-black/80 px-4 py-2.5"
        }
      >
        <div
          className={`flex text-white ${
            isStrip
              ? "flex-col gap-1.5 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between min-[360px]:gap-2"
              : "items-center justify-between gap-3 text-sm"
          }`}
        >
          <span className={`font-medium ${isStrip ? "text-[11px] sm:text-xs" : "text-sm"}`}>
            Watch Progress
          </span>
          <div className={`flex items-center gap-2 tabular-nums ${isStrip ? "text-[11px] sm:text-xs" : "text-sm"}`}>
            <span className="font-mono">
              {formatWatchTime(watched)}
              {duration > 0 && <> / {formatWatchTime(requiredWatch)}</>}
            </span>
            <span
              className={`font-semibold ${
                isCompleted ? "text-green-400" : "text-blue-300"
              }`}
            >
              {progressPercent}%
            </span>
          </div>
        </div>
        <div className={`rounded-full bg-white/20 overflow-hidden ${isStrip ? "mt-1.5 h-1" : "mt-1.5 h-1.5"}`}>
          <div
            className={`h-full transition-all duration-300 ${
              isCompleted ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {!isCompleted && duration > 0 && !isStrip && (
          <p className="mt-1 text-xs text-white/70 hidden sm:block">
            Watch at least 50% to mark this lecture as completed
          </p>
        )}
      </div>
    );
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
                        onClick={() => {
                          openModal(lecture);
                          setSelectLecture(lecture._id);
                        }}
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
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-4 items-center">
                      {/* Video */}
                      <span
                        onClick={() => {
                          openModal(lecture);
                          setSelectLecture(lecture._id);
                        }}
                        className="flex cursor-pointer items-center text-xs text-gray-600 bg-red-50 px-2 py-1 rounded-md"
                      >
                        <MdCameraRoll className="mr-1 text-red-500" />
                        Video
                      </span>

                      {/* Handouts */}
                      <span
                        onClick={() => openHandoutModal(lecture)}
                        className={`flex items-center text-xs px-2 py-1 rounded-md ${
                          lecture?.handout?.fileUrl || lecture?.handout?.handoutContent
                            ? "cursor-pointer text-gray-600 bg-blue-50"
                            : "cursor-not-allowed text-gray-400 bg-gray-100"
                        }`}
                      >
                        <FaFileAlt className="mr-1 text-blue-500" />
                        Handout
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

      {isOpen && currentLecture && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm">
          <div className="flex min-h-full items-start justify-center p-1.5 sm:p-4 lg:items-center lg:p-6">
            <div className="relative my-2 w-full max-w-7xl sm:my-4 lg:my-8">
              {/* Close Button */}
              <button
                onClick={() => dispatch(closeLectureModal())}
                className="absolute right-1.5 top-1.5 z-50 rounded-full bg-gray-800/90 p-2 text-white shadow-lg transition-colors hover:bg-black sm:right-2 sm:top-2 sm:p-2.5"
                aria-label="Close modal"
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
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

              <div className="flex max-h-none flex-col overflow-hidden rounded-xl bg-white shadow-2xl lg:max-h-[85vh] lg:h-[85vh] lg:flex-row">
                {/* Video Section */}
                <div className="flex w-full shrink-0 flex-col min-w-0 lg:min-h-0 lg:flex-1 lg:w-[65%] xl:w-[70%]">
                  {/* Header */}
                  <div className="border-b px-3 py-2.5 pr-12 sm:px-5 sm:py-3 sm:pr-14 lg:px-6 lg:py-4">
                    <h2 className="text-base font-bold text-gray-800 line-clamp-2 sm:text-lg lg:text-xl">
                      {currentLecture.lectureTitle || "Lecture Video"}
                    </h2>
                    <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-1 sm:text-xs lg:text-sm">
                      {course?.courseName} •{" "}
                      {currentLecture.duration || "Duration not specified"}
                    </p>
                  </div>

                  {/* Watch progress strip on mobile — keeps video fully visible */}
                  <div className="lg:hidden">{renderWatchProgress("strip")}</div>

                  {/* Video Player */}
                  <div className="relative aspect-video w-full shrink-0 bg-black lg:aspect-auto lg:min-h-[280px] lg:flex-1">
                    <div className="hidden lg:block">{renderWatchProgress("overlay")}</div>
                    <div
                      ref={playerContainerRef}
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>

                  {/* Lecture Info below Video */}
                  <div className="shrink-0 border-t p-2.5 sm:p-4 md:p-6">
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                        <img
                          src={course?.instructor?.profilePicture}
                          alt={course?.instructor?.name}
                          className="h-8 w-8 shrink-0 rounded-full border border-gray-300 object-cover sm:h-9 sm:w-9 md:h-10 md:w-10"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                            {course?.instructor?.name}
                          </p>
                          <p className="truncate text-[11px] text-gray-500 sm:text-xs">
                            Instructor • {course?.instructor?.university}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 self-start sm:self-auto">
                        <div
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:text-sm ${
                            completedLectures[currentLecture._id]
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {completedLectures[currentLecture._id]
                            ? "✓ Completed"
                            : "In Progress"}
                        </div>
                      </div>
                    </div>

                    {currentLecture.description && (
                      <div className="mt-2.5 rounded-lg bg-gray-50 p-2.5 sm:mt-3 sm:p-4">
                        <h3 className="mb-1.5 text-sm font-medium text-gray-900 sm:mb-2 sm:text-base">
                          Description
                        </h3>
                        <p className="line-clamp-3 cursor-pointer text-xs text-gray-700 transition-all hover:line-clamp-none sm:text-sm">
                          {currentLecture.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="flex min-h-[280px] w-full flex-col border-t border-gray-200 sm:min-h-[320px] sm:h-[45dvh] lg:min-h-0 lg:h-auto lg:min-h-0 lg:flex-1 lg:border-t-0 lg:border-l lg:w-[35%] xl:w-[30%]">
                  {/* Comments Header */}
                  <div className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-4">
                    <div className="hidden min-w-0 items-center gap-2.5 sm:flex sm:gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={user.profilePicture}
                          alt="Your profile"
                          className="size-9 rounded-full border-2 border-white object-cover shadow-sm sm:size-10 lg:size-12"
                        />
                        <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white sm:h-2.5 sm:w-2.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {user?.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          @{user?.name?.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 sm:text-base lg:text-lg">
                      {comments?.length || 0}
                      <span className="px-1.5 sm:px-2">Comments</span>
                    </h3>
                  </div>

                  {/* Comments Component */}
                  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <CommentSection
                      isOpen={isOpen}
                      comments={comments}
                      setComments={setComments}
                      selectLecture={selectLecture}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedHandoutLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <button
              onClick={closeHandoutModal}
              className="absolute right-4 top-4 z-10 rounded-full bg-gray-900 p-2 text-white transition hover:bg-black"
              aria-label="Close handout"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b px-6 py-4 pr-16">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedHandoutLecture.handout?.fileName || selectedHandoutLecture.lectureTitle}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedHandoutLecture.lectureTitle}
              </p>
            </div>

            <div className="flex-1 bg-gray-50 p-4 overflow-hidden">
              {getHandoutPreviewType(selectedHandoutLecture) === "image" ? (
                <div className="flex h-full items-center justify-center overflow-auto rounded-xl bg-white p-4">
                  <img
                    src={selectedHandoutLecture.handout.fileUrl}
                    alt={selectedHandoutLecture.handout.fileName || "Lecture handout"}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : getHandoutPreviewType(selectedHandoutLecture) === "text" ? (
                <div className="h-full w-full rounded-xl border border-gray-200 bg-white p-4 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                    {handoutText || "Loading handout content..."}
                  </pre>
                </div>
              ) : getHandoutPreviewType(selectedHandoutLecture) === "docx" ? (
                <div className="h-full w-full rounded-xl border border-gray-200 bg-white p-6 overflow-y-auto">
                  <div
                    className="prose prose-sm max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: handoutText || "Loading document...",
                    }}
                  />
                </div>
              ) : getHandoutPreviewType(selectedHandoutLecture) === "iframe" ||
                getHandoutPreviewType(selectedHandoutLecture) === "office" ? (
                <iframe
                  src={getHandoutPreviewUrl(selectedHandoutLecture)}
                  title={
                    selectedHandoutLecture.handout?.fileName || "Lecture handout"
                  }
                  className="h-full w-full rounded-xl border border-gray-200 bg-white"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 text-center">
                  <FaFileAlt className="mb-4 h-12 w-12 text-blue-500" />
                  <p className="text-base font-medium text-gray-800">
                    Preview is not available for this file type.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    You can open the handout in a new tab.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t bg-white px-6 py-4">
               <a
                href={`${import.meta.env.VITE_BACKEND_URL}/api/courses/download?url=${encodeURIComponent(selectedHandoutLecture.handout?.fileUrl)}&name=${encodeURIComponent(selectedHandoutLecture.handout?.fileName || "handout")}`}
                download={selectedHandoutLecture.handout?.fileName || "handout"}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Download Handout
              </a>
              <button
                onClick={closeHandoutModal}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCourse;
