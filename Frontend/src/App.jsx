import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./Pages/Home";
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
import { GoogleOAuthProvider } from "@react-oauth/google";
import Admin from "./Pages/Admin";
import Dashboard from "./Appcomponents/AdminSide/admincomponents/Dashboard";
import Profile from "./Pages/Profile";
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
          element: <Admin />,
          // children: [
          //   {
          //     index: true,
          //     element: <Dashboard />,
          //   },
          // ],
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
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
