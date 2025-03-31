import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./Pages/Home";
import AboutUs from "./Pages/AboutUs";
import Login from "./Appcomponents/AuthService/Login";
import Main from "./layouts/Main";

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
import Learning from "./Pages/Learning";
import UserEnrolledcourse from "./Appcomponents/AdminSide/Management/UserEnrolledcourse";
// import { Register as AccountRegister } from "./Appcomponents/AdminSide/Registeration/Register
import ProtectedRoute from "./providers/ProtectedRoute";
import Savetowatch from "./Pages/Savetowatch";
import RegisterNewUser from "./Appcomponents/AdminSide/CreateUser/NewUser";
// import CourseDetail from "./Appcomponents/Courses/CourseManagement/CourseDetail";
import AnswerTest from "./Pages/AnswerTest";
import Report from "./Appcomponents/AdminSide/Management/Report";
import UserReports from "./Appcomponents/UserProfile/UserReports";
import CourseDetail from "./Appcomponents/AdminSide/CourseManagement/CourseDetail";
import AdminsLogin from "./Pages/AdminsLogin";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute allowedRoles={["user"]}>
              <AuthProvider>
                <Home />
              </AuthProvider>
            </ProtectedRoute>
          ),
        },

        {
          path: "/auth/login",
          element: <Login />,
        },
        {
          path: "/auth/admins_login",
          element: <AdminsLogin />,
        },
        // 🔹 Protected Admin Routes
        {
          path: "/admin",

          children: [
            {
              path: "dashboard/:userid",
              element: (
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <AuthProvider>
                    <Dashboard />
                  </AuthProvider>
                </ProtectedRoute>
              ),
            },
            {
              path: "course_management/coursedetail/:courseid",
              element: (
                <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
                  <AuthProvider>
                    <CourseDetail />
                  </AuthProvider>
                </ProtectedRoute>
              ),
            },
            {
              path: "users_management",
              element: (
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <AuthProvider>
                    <Users />
                  </AuthProvider>
                </ProtectedRoute>
              ),
            },
            {
              path: "register",
              element: (
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <AuthProvider>
                    <RegisterNewUser />
                  </AuthProvider>
                </ProtectedRoute>
              ),
            },
            {
              path: "enrollment",
              element: (
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AuthProvider>
                    <UserEnrolledcourse />
                  </AuthProvider>
                </ProtectedRoute>
              ),
            },
            {
              path: "course_management",
              element: (
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AuthProvider>
                    <Createcourse />
                  </AuthProvider>
                </ProtectedRoute>
              ),
            },
            {
              path: "course_management/createcourse",
              element: (
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AuthProvider>
                    <CourseForm />
                  </AuthProvider>
                </ProtectedRoute>
              ),
            },
            {
              path: "course_management/createcourse/:courseID/createlessons",
              element: (
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AuthProvider>
                    <CreateLessons />
                  </AuthProvider>
                </ProtectedRoute>
              ),
            },
          ],
        },

        // 🔹 Protected User Routes
        {
          path: "/user",
          element: <ProtectedRoute allowedRoles={["user"]} />,
          children: [
            {
              path: "user-profile/:userid",
              element: (
                <AuthProvider>
                  <Profile />
                </AuthProvider>
              ),
            },
            {
              path: "savetowatch/:userid",
              element: (
                <AuthProvider>
                  <Savetowatch />
                </AuthProvider>
              ),
            },
            {
              path: "editProfile",
              element: (
                <AuthProvider>
                  <EditProfile />
                </AuthProvider>
              ),
            },
            {
              path: "reports",
              element: (
                <AuthProvider>
                  <UserReports />
                </AuthProvider>
              ),
            },
            {
              path: "explore_courses",
              element: (
                <AuthProvider>
                  <Courses />{" "}
                </AuthProvider>
              ),
            },
            {
              path: "explore_courses/overview/:courseID",
              element: (
                <AuthProvider>
                  <CourseOverview />
                </AuthProvider>
              ),
            },
            {
              path: "course/:userID/:courseID",
              element: (
                <AuthProvider>
                  <Learning />
                </AuthProvider>
              ),
            },
            {
              path: "course/:userID/:courseID/:testID",
              element: (
                <AuthProvider>
                  <AnswerTest />
                </AuthProvider>
              ),
            },
          ],
        },

        {
          path: "/about",
          element: (
            <AuthProvider>
              <AboutUs />
            </AuthProvider>
          ),
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
