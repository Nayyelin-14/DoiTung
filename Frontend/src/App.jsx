import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Home = lazy(() => import("./Pages/Home"));
const AboutUs = lazy(() => import("./Pages/AboutUs"));
const Login = lazy(() => import("./Appcomponents/AuthService/Login"));
const Main = lazy(() => import("./layouts/Main"));
const ErrorPage = lazy(() => import("./Pages/ErrorPage"));
const AuthProvider = lazy(() => import("./providers/AuthProvider"));
const Courses = lazy(() => import("./Pages/Courses"));
const CourseOverview = lazy(() => import("./Pages/CourseOverview"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Profile = lazy(() => import("./Pages/Profile"));
const Createcourse = lazy(() => import("./Pages/Createcourse"));
const EditProfile = lazy(() => import("./Pages/EditProfile"));
const CourseForm = lazy(() =>
  import("./Appcomponents/Creation/CourseCreate/CourseForm")
);
const CreateLessons = lazy(() =>
  import("./Appcomponents/Creation/CreateModule/CreateLessons")
);
const Users = lazy(() => import("./Pages/Users"));
const Learning = lazy(() => import("./Pages/Learning"));
const UserEnrolledcourse = lazy(() =>
  import("./Appcomponents/AdminSide/Management/UserEnrolledcourse")
);
const ProtectedRoute = lazy(() => import("./providers/ProtectedRoute"));
const Savetowatch = lazy(() => import("./Pages/Savetowatch"));
const RegisterNewUser = lazy(() =>
  import("./Appcomponents/AdminSide/CreateUser/NewUser")
);
const AnswerTest = lazy(() => import("./Pages/AnswerTest"));
const Report = lazy(() =>
  import("./Appcomponents/AdminSide/Management/Report")
);
const UserReports = lazy(() =>
  import("./Appcomponents/UserProfile/UserReports")
);
const CourseDetail = lazy(() =>
  import("./Appcomponents/AdminSide/CourseManagement/CourseDetail")
);
const AdminsLogin = lazy(() => import("./Pages/AdminsLogin"));
const CheckAccess = lazy(() => import("./providers/CheckAccess"));

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
          element: (
            <CheckAccess>
              <Login />
            </CheckAccess>
          ),
        },
        {
          path: "/auth/admins_login",
          element: (
            <CheckAccess>
              <AdminsLogin />
            </CheckAccess>
          ),
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
