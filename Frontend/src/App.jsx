import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
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
      element: <AuthProvider />,
      children: [
        {
          path: "",
          element: <Main />,
          children: [
            {
              index: true,
              element: (
                <ProtectedRoute allowedRoles={["user"]}>
                  <Home />
                </ProtectedRoute>
              ),
            },

            {
              path: "/auth",
              children: [
                {
                  element: <CheckAccess />, // Apply once here
                  children: [
                    {
                      path: "login",
                      element: <Login />,
                    },
                    {
                      path: "admins_login",
                      element: <AdminsLogin />,
                    },
                  ],
                },
              ],
            },
            // 🔹 Protected Admin Routes
            {
              path: "/admin",
              children: [
                // Superadmin-only routes
                {
                  element: <ProtectedRoute allowedRoles={["superadmin"]} />,
                  children: [
                    {
                      path: "dashboard/:userid",
                      element: <Dashboard />,
                    },
                    {
                      path: "users_management",
                      element: <Users />,
                    },
                    {
                      path: "register",
                      element: <RegisterNewUser />,
                    },
                  ],
                },

                // Admin + Superadmin shared routes
                {
                  element: (
                    <ProtectedRoute allowedRoles={["admin", "superadmin"]} />
                  ),
                  children: [
                    {
                      path: "course_management/coursedetail/:courseid",
                      element: <CourseDetail />,
                    },
                    {
                      path: "enrollment",
                      element: <UserEnrolledcourse />,
                    },
                    {
                      path: "course_management",
                      element: <Createcourse />,
                    },
                    {
                      path: "course_management/createcourse",
                      element: <CourseForm />,
                    },
                    {
                      path: "course_management/createcourse/:courseID/createlessons",
                      element: <CreateLessons />,
                    },
                  ],
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
                  element: <Profile />,
                },
                {
                  path: "savetowatch/:userid",
                  element: <Savetowatch />,
                },
                {
                  path: "editProfile",
                  element: <EditProfile />,
                },
                {
                  path: "reports",
                  element: <UserReports />,
                },
                {
                  path: "explore_courses",
                  element: <Courses />,
                },
                {
                  path: "explore_courses/overview/:courseID",
                  element: <CourseOverview />,
                },
                {
                  path: "course/:userID/:courseID",
                  element: <Learning />,
                },
                {
                  path: "course/:userID/:courseID/:testID",
                  element: <AnswerTest />,
                },
              ],
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
      ],
    }
  ])

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />;
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
