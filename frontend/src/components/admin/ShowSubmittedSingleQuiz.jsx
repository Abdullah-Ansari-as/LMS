import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Circle,
  Check,
  User,
  Award,
  BarChart,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { fetchAndCompareQuiz } from "../../api/courseApi";

const ShowSubmittedSingleQuiz = () => {
  const { quizId } = useParams();
  const location = useLocation();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  
  // const query = new URLSearchParams(location.search);

  const { course, quizNo, studentId, selectedStudent } = Object.fromEntries(new URLSearchParams(location.search));

  useEffect(() => {
    if (!quizId || !course || !quizNo || !studentId) return;

    const getQuiz = async () => {
      try {
        const data = { course, quizNo, studentId };
        const res = await fetchAndCompareQuiz(quizId, data);
        if (res.success) {
          // Transform the API response to match the expected format
          const transformedData = {
            ...res,
            quizQuestions: res.comparedQuestions || [],
            totalQuestions: res.totalQuestions || 0,
            result: calculateScore(res.comparedQuestions || []),
          };
          setQuizData(transformedData);
        }
      } catch (error) {
        console.log("error: ", error.message);
      } finally {
        setLoading(false);
      }
    };
    getQuiz();
  }, [quizId, course, quizNo, studentId]);

  const calculateScore = (questions) => {
    if (!questions || questions.length === 0) return 0;
    const correctAnswers = questions.filter(q => q.isCorrect).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz data...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600">No quiz data found</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const questions = quizData.quizQuestions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const correctCount = questions.filter(q => q.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;

  // Format options with IDs (a, b, c, d)
  const formatOptions = (options) => {
    return options.map((opt, index) => ({
      id: String.fromCharCode(97 + index), // a, b, c, d
      text: opt,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Get the style for option based on correctness
  const getOptionStyle = (optionText, currentQuestion) => {
    const isStudentSelected = optionText === currentQuestion.selectedAnswer;
    const isCorrectOption = optionText === currentQuestion.correctOption;
    
    if (isStudentSelected && isCorrectOption) {
      return {
        container: "border-2 border-green-500 bg-green-50",
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        badge: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600",
        badgeText: "Correct Answer",
        badgeIcon: <CheckCircle className="w-3 h-3 mr-1" />
      };
    } else if (isStudentSelected && !isCorrectOption) {
      return {
        container: "border-2 border-red-500 bg-red-50",
        icon: <XCircle className="w-6 h-6 text-red-500" />,
        badge: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600",
        badgeText: "Wrong Answer",
        badgeIcon: <X className="w-3 h-3 mr-1" />
      };
    } else if (isCorrectOption) {
      return {
        container: "border-2 border-green-500 bg-green-50",
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        badge: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600",
        badgeText: "Correct Answer",
        badgeIcon: <CheckCircle className="w-3 h-3 mr-1" />
      };
    } else {
      return {
        container: "border-2 border-gray-200",
        icon: <Circle className="w-6 h-6 text-gray-400" />,
        badge: null,
        badgeText: "",
        badgeIcon: null
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 pt-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                {quizData.course}
              </h1>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span className="mr-4">
                  Submitted by:{" "}
                  <span className="font-semibold">
                    {selectedStudent
                      ? selectedStudent.charAt(0).toUpperCase() +
                        selectedStudent.slice(1)
                      : `Student (${quizData.studentId?.slice(-6) || ''})`}
                  </span>
                </span>
               
              </div>
            </div>

            {/* Score Circle */}
            <div className="mt-4 md:mt-0">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  <circle
                    className="text-blue-500 stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${quizData.result * 2.513} 251.3`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {quizData.result}%
                  </span>
                  <span className="text-sm text-gray-600">Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600 font-semibold">Quiz No</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">
                {quizNo || "N/A"}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <BarChart className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-600 font-semibold">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">
                {totalQuestions}
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-emerald-600 font-semibold">Correct</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">
                {correctCount}
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-600 font-semibold">Wrong</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">
                {incorrectCount}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-purple-600 font-semibold">Status</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">
                Submitted
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="w-5 h-5 text-amber-600 mr-2">📊</span>
                <span className="text-amber-600 font-semibold">Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-2">
                {quizData.result}%
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 ">
          {/* Questions Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 lg:mb-0">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Questions
              </h2>
              <div className="space-y-2">
                {questions.map((q, index) => {
                  const isCurrent = index === currentQuestionIndex;
                  const isCorrect = q.isCorrect;

                  return (
                    <button
                      key={q.questionId || q._id || index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-full p-3 rounded-lg flex items-center justify-between transition-all duration-200 ${
                        isCurrent
                          ? "bg-blue-100 border-2 border-blue-500"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            isCurrent
                              ? "bg-blue-600 text-white"
                              : isCorrect
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-gray-700">
                          Question {index + 1}
                        </span>
                      </div>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mt-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quiz Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Correct:</span>
                  <span className="font-semibold text-green-600">{correctCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wrong:</span>
                  <span className="font-semibold text-red-600">{incorrectCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-semibold">{quizData.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quiz No:</span>
                  <span className="font-semibold">{quizNo || "N/A"}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Final Score:</span>
                    <span className="text-xl font-bold text-gray-800">
                      {quizData.result}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Display */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              {/* Question Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full mr-3">
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${
                      currentQuestion.isCorrect 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {currentQuestion.isCorrect ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {currentQuestion.isCorrect ? "Correct" : "Incorrect"}
                    </div>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    {currentQuestion.question}
                  </h2>
                </div>
              </div>

              {/* Options List */}
              <div className="space-y-4 mb-8">
                {formatOptions(currentQuestion.options).map((option) => {
                  const style = getOptionStyle(option.text, currentQuestion);
                  
                  return (
                    <div
                      key={option.id}
                      className={`p-4 rounded-xl transition-all duration-200 ${style.container}`}
                    >
                      <div className="flex items-center">
                        <div className="mr-4">{style.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-700 mr-3">
                              {option.id.toUpperCase()}.
                            </span>
                            <span className="text-gray-800">{option.text}</span>
                          </div>
                          {style.badge && (
                            <div className="mt-2 ml-7">
                              <span className={style.badge}>
                                {style.badgeIcon}
                                {style.badgeText}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Feedback for Incorrect Answers */}
              {!currentQuestion.isCorrect && (
                <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-yellow-800">
                        Feedback
                      </h3>
                      <div className="mt-1 text-sm text-yellow-700">
                        <p>
                          You selected: <span className="font-semibold">{currentQuestion.selectedAnswer}</span>
                        </p>
                        <p>
                          Correct answer: <span className="font-semibold text-green-600">{currentQuestion.correctOption}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    currentQuestionIndex === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>

                <div className="text-gray-600">
                  {currentQuestionIndex + 1} of {totalQuestions}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    currentQuestionIndex === totalQuestions - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowSubmittedSingleQuiz;