import questionsData from '../data/questions.json';

const STORAGE_KEY = 'assessment_quiz_state';

export const initialState = {
  questions: questionsData,
  currentQuestion: 0,
  userAnswers: {},
  timer: 600, // 10 minutes countdown (600 seconds)
  quizStatus: 'idle', // 'idle' | 'active' | 'finished'
};

// Restore saved state from localStorage or fallback to initialState
export const getInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        questions: questionsData, // ensure questions array is intact
      };
    }
  } catch {
    // fallback if parse fails
  }
  return initialState;
};

export function quizReducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        currentQuestion: 0,
        userAnswers: {},
        timer: 600,
        quizStatus: 'active',
      };

    case 'SELECT_ANSWER':
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [state.currentQuestion]: action.payload,
        },
      };

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestion + 1;
      if (nextIndex < state.questions.length) {
        return {
          ...state,
          currentQuestion: nextIndex,
        };
      }
      return {
        ...state,
        quizStatus: 'finished',
      };
    }

    case 'PREV_QUESTION':
      return {
        ...state,
        currentQuestion: Math.max(0, state.currentQuestion - 1),
      };

    case 'TICK_TIMER': {
      if (state.timer > 1) {
        return {
          ...state,
          timer: state.timer - 1,
        };
      }
      // Auto-submit assessment when timer reaches 0
      return {
        ...state,
        timer: 0,
        quizStatus: 'finished',
      };
    }

    case 'FINISH_QUIZ':
      return {
        ...state,
        quizStatus: 'finished',
      };

    case 'RESTART_QUIZ': {
      localStorage.removeItem(STORAGE_KEY);
      return {
        ...initialState,
        quizStatus: 'idle',
      };
    }

    default:
      return state;
  }
}
