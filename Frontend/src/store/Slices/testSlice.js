import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testStarted: false,
  startTime: null, // Stores the timestamp of when the test starts
  timeLeft: 0, // Time left in seconds
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    startTest: (state, action) => {
      state.testStarted = true;
      state.startTime = Date.now(); // Set start timestamp
      state.initialTimeLeft = action.payload;
      state.timeLeft = action.payload; // Set time left in seconds
    },
    stopTest: (state) => {
      state.testStarted = false;
      state.timeLeft = 0;
      state.startTime = null;
    },
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
  },
});

export const {
  startTest,
  stopTest,
  setTimeLeft,
  setTestStarted,
} = testSlice.actions;
export default testSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// // Load saved time from localStorage or set initial values
// const storedTimeLeft = localStorage.getItem("timeLeft") || 0;
// const storedStartTime = localStorage.getItem("startTime") || null;

// const initialState = {
//   testStarted: storedStartTime !== null, // If there's a startTime, the test was started
//   startTime: storedStartTime ? parseInt(storedStartTime, 10) : null,
//   timeLeft: storedTimeLeft, // Start with the saved timeLeft or 0
// };

// const testSlice = createSlice({
//   name: "test",
//   initialState,
//   reducers: {
//     startTest: (state, action) => {
//       state.testStarted = true;
//       state.startTime = Date.now(); // Set start timestamp
//       state.timeLeft = action.payload; // Set time left in seconds
//       // Save start time and time left to localStorage
//       localStorage.setItem("startTime", state.startTime);
//       localStorage.setItem("timeLeft", state.timeLeft);
//     },
//     updateTimeLeft: (state) => {
//       if (state.testStarted && state.startTime) {
//         const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
//         state.timeLeft = Math.max(0, state.timeLeft - elapsedTime);
//         // Update the stored timeLeft in localStorage
//         localStorage.setItem("timeLeft", state.timeLeft);
//       }
//     },
//     stopTest: (state) => {
//       state.testStarted = false;
//       state.timeLeft = 0;
//       state.startTime = null;
//       // Clear localStorage when stopping the test
//       localStorage.removeItem("startTime");
//       localStorage.removeItem("timeLeft");
//     },
//     setTimeLeft: (state, action) => {
//       state.timeLeft = action.payload;
//       localStorage.setItem("timeLeft", state.timeLeft); // Save new timeLeft
//     },
//     setTestStarted: (state, action) => {
//       state.testStarted = action.payload;
//     },
//   },
// });

// export const { startTest, updateTimeLeft, stopTest, setTimeLeft, setTestStarted } = testSlice.actions;
// export default testSlice.reducer;

