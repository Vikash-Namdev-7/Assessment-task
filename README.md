# Assessment Quiz Application

## Project Setup Instructions
Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/Vikash-Namdev-7/Assessment-task.git
cd Assessment-task
```

## How to Install Dependencies
Run the following command to install all required dependencies:
```bash
npm install
```

## How to Run the Project Locally
Start the development server:
```bash
npm run dev
```
Open your browser and visit: `http://localhost:5173`

## Technologies Used
- **React**: Component structure and UI rendering
- **Tailwind CSS**: Responsive styling and layout
- **Vite**: Build tool and local development server
- **JavaScript (ES6+)**: Application logic

## Important Implementation Details
- **Single Reducer State Management**: Uses React's `useReducer` hook (`quizReducer.js`) to centrally manage:
  - Questions list
  - Current question index
  - User selected answers
  - 10-minute countdown timer
  - Quiz status (`idle`, `active`, `finished`)
- **10-Minute Countdown & Auto-Submit**: Global 10-minute timer that automatically submits the assessment when it hits 0.
- **LocalStorage Persistence**: Assessment progress is saved to `localStorage` on every change and restored upon page refresh, allowing users to resume where they left off.
- **Results & Review Section**: Evaluates final score and percentage, and provides a review of each question showing user answers, correct answers, and pass/fail indicators.
- **Responsive Layout**: Designed with Tailwind CSS to ensure a smooth layout across mobile, tablet, laptop, and desktop screens without horizontal overflow.
