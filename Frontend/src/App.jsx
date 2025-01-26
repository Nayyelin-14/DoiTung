import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./Pages/Home";
import AboutUs from "./Pages/AboutUs";
import Register from "./Appcomponents/AuthService/Register";
import Login from "./Appcomponents/AuthService/Login";
import Main from "./layouts/Main";
import EmailVerification from "./Appcomponents/AuthService/EmailService/EmailVerification";
import VerificationPage from "./Appcomponents/AuthService/VerificationPage";
import Forgotpassword from "./Appcomponents/AuthService/Password/Forgotpassword";
import ErrorPage from "./Pages/ErrorPage";
import AuthProvider from "./providers/AuthProvider";

import Courses from "./Pages/Courses";
import CourseOverview from "./Pages/CourseOverview";

import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import Createcourse from "./Pages/Createcourse";

// import CourseForm from "./Appcomponents/Creation/CourseForm";

import EditProfile from "./Pages/EditProfile";
import CourseForm from "./Appcomponents/Creation/CourseCreate/CourseForm";
import CreateLessons from "./Appcomponents/Creation/CreateModule/CreateLessons";
import Users from "./Pages/Users";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          index: true,
          element: (
            <AuthProvider>
              <Home />
            </AuthProvider>
          ),
        },
        {
          path: "/auth/register",
          element: <Register />,
        },
        {
          path: "/auth/login",
          element: <Login />,
        },
        {
          path: "/verifyemail",
          element: <VerificationPage />,
        },

        {
          path: "/auth/account_verification/:token",
          element: <EmailVerification />,
        },
        {
          path: "/auth/forgotpassword",
          element: <Forgotpassword />,
        },

        {
          path: "/admin/dashboard/:userid",
          element: <Dashboard />,
        },
        {
          path: "/user-profile/:userid",
          element: <Profile />,
        },

        {
          path: "/explore_courses",
          element: <Courses />,
        },
        {
          path: "/explore_courses/overview/:courseID",
          element: <CourseOverview />,
        },

        {
          path: "/admin/users_management",
          element: <Users />,
        },
        {
          path: "/admin/course_management",
          element: <Createcourse />,
        },
        {
          path: "/admin/course_management/createcourse",
          element: <CourseForm />,
        },
        {
          path: "/admin/course_management/createcourse/:courseID/createlessons",
          element: <CreateLessons />,
        },
        {
          path: "/about",
          element: <AboutUs />,
        },

        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
