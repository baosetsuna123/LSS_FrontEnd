import { CourseLandingPage } from "./components/Home/Course-Landing-Page";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import { Layout } from "./Layout/Layout";
import ForgotPassword from "./components/Auth/ForgotPassword";
import SignUp from "./components/Auth/SignUp";
import { Application } from "./components/Application/Application";
import ResetPassword from "./components/Auth/ResetPassword";
import Profile from "./components/Student/Profile";
import ProtectedRoute from "./components/Auth/ProtectedRoute"; // Import the ProtectedRoute
import NotFound from "./components/Notfound/NotFound";
import { Dashboard } from "./components/Staff/Dashboard";

// Import các component Teacher Dashboard
import TeacherDashboardLayout from "./components/Teacher/TeacherDashboardLayout";
import UpdateSchedule from "./components/Teacher/UpdateSchedule";
import CancelClassRequest from "./components/Teacher/CancelClassRequest";
import ClassList from "./components/Teacher/ClassList";
import TeacherHome from "./components/Teacher/TeacherHome";
import { MyWallet } from "./components/Student/Wallet";
import { ClassDetail } from "./components/Student/class-detail";
import { ViewAllClasses } from "./components/Student/All_Class";
import { MyOrders } from "./components/Student/Order";
import MyClass from "./components/Student/MyClass";
import FeedbackForm from "./components/Student/Feedback";
import { WalletHistory } from "./components/Student/All_Transactions";
import { SendApplication } from "./components/Student/send-application";
import { AdminLayout } from "./components/Admin/admin-layout";
import AdminHome from "./components/Admin/AdminHome";
import { AboutMe } from "./components/Home/AboutMe";
import { ApplicationManagement } from "./components/Student/ViewApplication";
import News from "./components/Student/News";
import NewsDetail from "./components/Student/NewsDetail";
import TeacherProfile from "./components/Student/TeacherProfile";
import ProfileTeacher from "./components/Teacher/ProfileTeacher";
import { WalletTeacher } from "./components/Teacher/WalletTeacher";
import User from "./components/Admin/ListUser";
import CreateStaff from "./components/Admin/CreateStaff";
import Notifications from "./components/Student/Notifications";
import Teacher from "./components/Admin/ListTeacher";
import RegisterApp from "./components/Admin/RegisterApp";
import WithdrawApp from "./components/Admin/WithdrawApp";
import OtherApp from "./components/Admin/OtherApp";
import EditParams from "./components/Admin/EditParams";
import Classes from "./components/Admin/Classes";
import { SendApplicationTeacher } from "./components/Teacher/SendApplicationTeacher";
import { ApplicationManagementTeacher } from "./components/Teacher/ViewApplicationTeacher";
import VerifyOtpRegister from "./components/Auth/Verify-Otp-Register";
import VerifyOtpForgot from "./components/Auth/Verify-Otp-Forgot";
import Documents from "./components/Student/Documents";

function App() {
  return (
    <Router>
      <Routes>
        {/* Staff Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="User/ListUser" element={<User />} />
          <Route path="Classes" element={<Classes />} />
          <Route path="User/ListTutor" element={<Teacher />} />
          <Route path="User/Create-staff" element={<CreateStaff />} />
          <Route path="Application/Register" element={<RegisterApp />} />
          <Route path="Application/Withdraw" element={<WithdrawApp />} />
          <Route path="Application/Other" element={<OtherApp />} />
          <Route path="EditParams" element={<EditParams />} />
        </Route>

        {/* Teacher Dashboard Routes */}
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <TeacherDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherHome />} />
            <Route
              path="send-applications"
              element={<SendApplicationTeacher />}
            />
            <Route
              path="view-applications"
              element={<ApplicationManagementTeacher />}
            />
            <Route path="profile" element={<ProfileTeacher />} />
            <Route path="wallet" element={<WalletTeacher />} />
            <Route path="update-schedule" element={<UpdateSchedule />} />
            <Route path="cancel-request" element={<CancelClassRequest />} />
            <Route path="class-list" element={<ClassList />} />
          </Route>
        </Route>

        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp-register" element={<VerifyOtpRegister />} />
          <Route path="/verify-otp-forgot" element={<VerifyOtpForgot />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/create-application" element={<Application />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <MyWallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/all-transactions"
            element={
              <ProtectedRoute>
                <WalletHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-applications"
            element={
              <ProtectedRoute>
                <ApplicationManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/send-applications"
            element={
              <ProtectedRoute>
                <SendApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <News />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news/:id"
            element={
              <ProtectedRoute>
                <NewsDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<CourseLandingPage />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route
            path="/class/:id"
            element={
              <ProtectedRoute>
                <ClassDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/class/:id/documents"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:teacherName"
            element={
              <ProtectedRoute>
                <TeacherProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/class"
            element={
              <ProtectedRoute>
                <ViewAllClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback/:orderId"
            element={
              <ProtectedRoute>
                <FeedbackForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-class"
            element={
              <ProtectedRoute>
                <MyClass />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
