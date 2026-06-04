import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

export default function AdminLayout() {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const isAuthorized = !!(token && (role === "librarian" || role === "admin"));

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login-portal");
    }
  }, [isAuthorized, navigate]);

  return (
    <>
      {isAuthorized ? <Outlet /> : null}
      <ToastContainer
position="top-right"
autoClose={1000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/> 
    </>
  );
}