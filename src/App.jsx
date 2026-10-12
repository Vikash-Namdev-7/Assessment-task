import React, { useReducer, useEffect } from 'react';
import { quizReducer, initialState, getInitialState } from './reducer/quizReducer';

const App = () => {
  // Initialize state from localStorage if available, or fallback to initialState
  const [state, dispatch] = useReducer(quizReducer, initialState, getInitialState);
  const { questions, currentQuestion, userAnswers, timer, quizStatus } = state;

  // Persist assessment state to localStorage on any state change
  useEffect(() => {
    localStorage.setItem('assessment_quiz_state', JSON.stringify(state));
  }, [state]);

  // Global 10-minute countdown timer effect
  useEffect(() => {
    if (quizStatus !== 'active') return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizStatus]);

  // Format seconds into MM:SS format
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Compute final score
  const calculateScore = () => {
    return questions.reduce((score, q, idx) => {
      return userAnswers[idx] === q.correctAnswer ? score + 1 : score;
    }, 0);
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const selectedAnswer = userAnswers[currentQuestion];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-2xl">
        {quizStatus === 'idle' && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4">
              📝
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Assessment Quiz
            </h1>
            <p className="text-slate-500 max-w-md mb-6">
              Test your knowledge. Read each question carefully and select the best answer before the 10-minute timer runs out.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700">
                📋 Questions: <span className="font-bold text-slate-900">{questions.length}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700">
                ⏱ Time Limit: <span className="font-bold text-slate-900">10 mins</span>
              </div>
            </div>

            <button
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              onClick={() => dispatch({ type: 'START_QUIZ' })}
            >
              Start Assessment
            </button>
          </div>
        )}

        {quizStatus === 'active' && currentQ && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <span className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm border transition-colors ${
                  timer <= 60
                    ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                ⏱ {formatTime(timer)}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-6">
              {currentQ.question}
            </h2>

            <div className="flex flex-col gap-3 mb-8">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={idx}
                    className={`w-full text-left p-4 rounded-xl border text-base transition-all duration-150 cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium ring-2 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                    onClick={() =>
                      dispatch({ type: 'SELECT_ANSWER', payload: option })
                    }
                  >
                    <span>{option}</span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                className="px-5 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition-colors cursor-pointer"
                disabled={currentQuestion === 0}
                onClick={() => dispatch({ type: 'PREV_QUESTION' })}
              >
                Previous
              </button>

              {isLastQuestion ? (
                <button
                  className="px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
                  onClick={() => dispatch({ type: 'FINISH_QUIZ' })}
                >
                  Submit Assessment
                </button>
              ) : (
                <button
                  className="px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/25 cursor-pointer"
                  onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {quizStatus === 'finished' && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Quiz Completed!
            </h1>
            <p className="text-xl text-slate-700 mt-2">
              Your Score: <span className="font-bold text-blue-600">{calculateScore()}</span> / {questions.length}
            </p>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Score Percentage: {Math.round((calculateScore() / questions.length) * 100)}%
            </p>

            <div className="text-left mt-6 max-h-80 overflow-y-auto space-y-3 pr-2 border-t border-b border-slate-100 py-4">
              <h3 className="text-base font-bold text-slate-900 mb-3 sticky top-0 bg-white py-1">
                Review Answers
              </h3>
              {questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-sm ${
                      isCorrect
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-rose-50/70 border-rose-200'
                    }`}
                  >
                    <p className="font-semibold text-slate-900 mb-1.5">
                      Q{idx + 1}: {q.question}
                    </p>
                    <p className="text-slate-700">
                      Your Answer: <span className="font-medium">{userAns || 'Not Answered'}</span>
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-700 font-semibold mt-1">
                        Correct Answer: {q.correctAnswer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
              onClick={() => dispatch({ type: 'RESTART_QUIZ' })}
            >
              Restart Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
