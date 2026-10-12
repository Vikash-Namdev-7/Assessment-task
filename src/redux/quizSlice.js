import { createSlice } from '@reduxjs/toolkit';
import questionsData from '../data/questions.json';

const STORAGE_KEY = 'assessment_quiz_state';

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        questions: questionsData,
        currentQuestion: parsed.currentQuestion ?? 0,
        userAnswers: parsed.userAnswers ?? {},
        timer: parsed.timer ?? 600,
        quizStatus: parsed.quizStatus ?? 'idle',
      };
    }
  } catch {
    // fallback
  }
  return {
    questions: questionsData,
    currentQuestion: 0,
    userAnswers: {},
    timer: 600,
    quizStatus: 'idle',
  };
};

const initialState = getInitialState();

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state) => {
      state.currentQuestion = 0;
      state.userAnswers = {};
      state.timer = 600;
      state.quizStatus = 'active';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    selectAnswer: (state, action) => {
      state.userAnswers[state.currentQuestion] = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    nextQuestion: (state) => {
      if (state.currentQuestion + 1 < state.questions.length) {
        state.currentQuestion += 1;
      } else {
        state.quizStatus = 'finished';
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    prevQuestion: (state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    tickTimer: (state) => {
      if (state.timer > 1) {
        state.timer -= 1;
      } else {
        state.timer = 0;
        state.quizStatus = 'finished';
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    finishQuiz: (state) => {
      state.quizStatus = 'finished';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    restartQuiz: (state) => {
      state.currentQuestion = 0;
      state.userAnswers = {};
      state.timer = 600;
      state.quizStatus = 'idle';
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const {
  startQuiz,
  selectAnswer,
  nextQuestion,
  prevQuestion,
  tickTimer,
  finishQuiz,
  restartQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
