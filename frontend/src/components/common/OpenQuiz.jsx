import React, { useState, useEffect } from 'react';
import { TiTick } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { submitQuiz } from '../../api/courseApi';
import { setSubmittedQuizes } from '../../redux/slices/courseSlice';
import { toast } from 'sonner';

const OpenQuiz = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quizes } = useSelector((store) => store.course);
  const quizIndex = quizes?.findIndex((quiz) => quiz._id === quizId);
  const singleQuizData = quizes?.[quizIndex];
  const quizData = singleQuizData?.quizQuestions || [];

  const [current, setCurrent] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userResponses, setUserResponses] = useState([]);

  const currentQuestion = quizData[current];

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (current >= quizData.length) return;

    const newResponse = {
      question: currentQuestion.question,
      options: currentQuestion.options,
      selectedAnswer: selectedAnswer,
    };

    setUserResponses([...userResponses, newResponse]);
    setSelectedAnswer('');
    setCurrent((prev) => prev + 1);
  };

  // Auto submit on last question
  useEffect(() => {
    if (current === quizData.length && userResponses.length === quizData.length) {
      const data = {
        quizId,
        course: singleQuizData?.selectedCourse,
        quizQuestions: userResponses,
      };

      const submitQuizData = async () => {
        try {
          const result = await submitQuiz(quizId, data);
          if (result.success) {
            toast.success(result.message);
            dispatch(setSubmittedQuizes(result.submission));
          }
        } catch (error) {
          console.error('Submission failed', error);
        }
      };

      submitQuizData();
    }
  }, [current, quizData.length, userResponses.length]);

  // ✅ Return if quiz is finished
  if (current >= quizData.length) {
    return (
      <div className="bg-[#F2F3F8] min-h-screen flex items-center justify-center px-4">
        <div className="p-6 max-w-md text-center bg-white rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold text-green-600 mb-2 flex justify-center items-center gap-2">
            <TiTick className="w-6 h-6" /> Quiz Finished
          </h2>
          <span className="block font-semibold text-left">Dear Student,</span>
          <p className="text-gray-900 mt-4 tracking-wide">
            Your Quiz has been finished successfully! <br />
            Click{' '}
            <Link
              onClick={() => navigate(-1)}
              className="hover:underline text-blue-600 hover:text-blue-700"
            >
              here
            </Link>{' '}
            to view Quiz List!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#F2F3F8] py-8 px-4 mt-18">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Course Info */}
        <div className="text-center mb-6 flex justify-between">
          <h1 className="text-sm md:text-2xl font-bold text-gray-500">Quiz No {quizIndex + 1}</h1>
          <h1 className="text-base md:text-2xl font-bold text-primary">{singleQuizData?.selectedCourse}</h1>
          <p className="text-xs md:text-sm text-gray-500">{singleQuizData?.dueDate}</p>
        </div>

        {/* Question & Options */}
        <div>
          <div className="text-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Question {current + 1} of {quizData.length}
            </h2>
            <p className="text-gray-700 mt-2 text-base sm:text-lg">
              {currentQuestion?.question}
            </p>
          </div>

          <div className="space-y-3 mt-4">
            {currentQuestion?.options?.map((answer, index) => (
              <label
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                  ${selectedAnswer === answer
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700'
                  }`}
              >
                <input
                  type="radio"
                  name={`question-${current}`}
                  value={answer}
                  checked={selectedAnswer === answer}
                  onChange={() => handleAnswerClick(answer)}
                  className="radio radio-primary"
                />
                <span className="text-sm sm:text-base">{answer}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`mt-6 w-full py-2 rounded-lg text-white font-semibold transition duration-200
              ${selectedAnswer
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            {current + 1 === quizData.length ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenQuiz;
