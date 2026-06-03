import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import './App.css';
import UserLayout from "./layout/userlayout";
import AdminLayout from "./layout/adminlayout";
import ThemeSwitcher from "./components/ThemeSwitcher";
import ProtectedRoute from "./components/ProtectedRoute";


const Login          = lazy(() => import("./pages/user/login"));
const Register       = lazy(() => import('./pages/user/register'));
const Home           = lazy(() => import("./pages/user/home"));
const Books          = lazy(() => import('./pages/user/books'));
const AllCategories  = lazy(() => import('./pages/user/allcategories'));
const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
const AdminShell    = lazy(() => import('./layout/AdminShell'));
const AdminLogin     = lazy(() => import('./pages/admin/AdminLogin'));
const AddBookForm    = lazy(() => import('./pages/admin/addbook'));
const ViewBooks      = lazy(() => import('./pages/admin/viewbook'));
const AddLibrarian   = lazy(() => import('./pages/admin/AddLibrarian'));
const BookDetails    = lazy(() => import('./pages/user/bookdetails'));
const ProfilePage    = lazy(() => import('./pages/user/profile'));
const LibrarianRequests = lazy(() => import('./pages/librarian/LibrarianRequest'));
const ReturnRequest  = lazy(() => import('./pages/librarian/ReturnRequest'));
const AboutUs        = lazy(() => import('./pages/user/AboutUs'));
const ContactUs      = lazy(() => import('./pages/user/ContactUs'));
const BooksBorrowed  = lazy(() => import('./pages/librarian/BooksBorrowed'));
const ForgotPassword = lazy(() => import('./pages/user/ForgetPassword/ForgetPassword'));
const VerifyOTP      = lazy(() => import('./pages/user/ForgetPassword/VerifyOtp'));
const ResetPassword  = lazy(() => import('./pages/user/ForgetPassword/UpdatePassword'));


const Reservations    = lazy(() => import('./pages/user/Reservations'));
const MyBooks         = lazy(() => import('./pages/user/MyBooks'));
const MyFines         = lazy(() => import('./pages/user/MyFines'));
const Reports         = lazy(() => import('./pages/admin/Reports'));
const ManageMembers   = lazy(() => import('./pages/admin/ManageMembers'));
const FineManagement  = lazy(() => import('./pages/admin/FineManagement'));
const FineConfig      = lazy(() => import('./pages/admin/FineConfig'));
const AllReservations = lazy(() => import('./pages/admin/AllReservations'));
const AdminProfile    = lazy(() => import('./pages/admin/AdminProfile'));


const LoginPortal    = lazy(() => import('./pages/auth/LoginPortal'));
const LibrarianLogin = lazy(() => import('./pages/auth/LibrarianLogin'));
const StudentLogin   = lazy(() => import('./pages/auth/StudentLogin'));
const AccessDenied   = lazy(() => import('./pages/auth/AccessDenied'));

const Preloader = () => (
  <div className="preloader">
    <div className="spinner" />
    <p>Loading&hellip;</p>
  </div>
);

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const loginPaths = ["/login-portal", "/admin-login", "/librarian-login", "/login", "/student-login"];
        if (location.pathname === "/" || loginPaths.includes(location.pathname)) {
          if (decoded.role === "admin" || decoded.role === "librarian") {
            navigate("/admin", { replace: true });
          } else if (decoded.role === "user") {
            if (location.pathname !== "/") {
              navigate("/", { replace: true });
            }
          }
        }
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
      }
    }
  }, [location.pathname, navigate]);

  return (
    <>
    <Suspense fallback={<Preloader />}>
      <Routes>
        <Route path="/login-portal"    element={<LoginPortal />} />
        <Route path="/admin-login"     element={<AdminLogin />} />
        <Route path="/librarian-login" element={<LibrarianLogin />} />
        <Route path="/access-denied"   element={<AccessDenied />} />

        <Route path="/" element={<UserLayout />}>
          <Route index                  element={<Home />} />
          <Route path="books"           element={<Books />} />
          <Route path="bookdetails/:id" element={<BookDetails />} />
          <Route path="category"        element={<AllCategories />} />
          <Route path="register"        element={<Register />} />
          <Route path="login"           element={<Login />} />
          <Route path="student-login"   element={<StudentLogin />} />
          <Route path="aboutus"         element={<AboutUs />} />
          <Route path="contactus"       element={<ContactUs />} />
          <Route path="forgetPassword"  element={<ForgotPassword />} />
          <Route path="verifyotp"       element={<VerifyOTP />} />
          <Route path="resetpass"       element={<ResetPassword />} />
          
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="reservations"    element={<Reservations />} />
            <Route path="my-books"        element={<MyBooks />} />
            <Route path="my-fines"        element={<MyFines />} />
          </Route>
        </Route>

        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin", "librarian"]} />}>
          <Route element={<AdminLayout />}>
            <Route element={<AdminShell />}>
              <Route index               element={<DashboardHome />} />
              <Route path="addbook"      element={<AddBookForm />} />
              <Route path="viewbook"     element={<ViewBooks />} />
              <Route path="issuerequest" element={<LibrarianRequests />} />
              <Route path="returnrequest" element={<ReturnRequest />} />
              <Route path="issued"       element={<BooksBorrowed />} />
              <Route path="members"      element={<ManageMembers />} />
              <Route path="reservations" element={<AllReservations />} />
              <Route path="fines"        element={<FineManagement />} />
              <Route path="fine-config"  element={<FineConfig />} />
              <Route path="reports"      element={<Reports />} />
              <Route path="profile"      element={<AdminProfile />} />
              
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="addlibrarian" element={<AddLibrarian />} />
              </Route>
            </Route>
          </Route>
        </Route>

        
        <Route path="/user" element={<UserLayout />}>
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route index element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
    <ThemeSwitcher variant="floating" />
    </>
  );
}

export default App;