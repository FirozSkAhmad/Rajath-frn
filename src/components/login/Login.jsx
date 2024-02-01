import React, { useState } from "react";
// import MobHeader from "../header/MobHeader";
// import { useMobHeaderContext } from '../../context/MobHeader';
// import MobileModal from '../menu/MobileModal';

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASEURL from "../../data/baseurl";

const Login = () => {
  // const { isMobModalOpen, closeMobModal } = useMobHeaderContext();

  // useNavigate
  const navigate = useNavigate();

  // Formdata
  const [formData, setFormData] = useState({
    phn_no: "",
    password: "",
  });

  // Authorization

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");

  // On input change
  const onChangeInput = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU3NjQxMjEsImV4cCI6MTczNzMyMTcyMSwiYXVkIjoiMTpTVVBFUiBBRE1JTiIsImlzcyI6InBhYmFwcGxpY2F0aW9uIn0.4dkblN2KV86c5MQu85PnFsnDVq1j9uTvmh5tJ9x1YA4");

    var raw = JSON.stringify({
      phn_no: formData.phn_no,
      password: formData.password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${BASEURL.url}/auth/login`,
        requestOptions
      );

      if (response.ok) {
        setIsAuthorized(true);
        const data = await response.json();
        // Use optional chaining and nullish coalescing for safer property access
        const role_type = data?.data?.role_type ?? "";
        const accessToken = data?.data?.accessToken;

        localStorage.setItem("accessToken", accessToken);

        localStorage.setItem("role_type", role_type);

        console.log("role_type", role_type);

        // Redirect to the appropriate dashboard
        if (role_type === "SUPER ADMIN") {
          // Use the Navigate component to redirect
          navigate("/admin/dashboard");
          // <Navigate to="/admin/dashboard" />;
          const surveyorId = data?.data?.id;
          localStorage.setItem("surveyor_id", surveyorId);
        } else {
          // You can use the Navigate component or another method to redirect to the user dashboard
          // return <Navigate to="/user/dashboard" />;
          const surveyorId = data?.data?.id;
          localStorage.setItem("surveyor_id", surveyorId);
          navigate("/surveyor/dashboard");
        }
      } else {
        // If login fails, parse and display the error response
        const errorResponse = await response.json();
        setError(errorResponse.message);
        console.error("Login failed:", errorResponse.message);
        // console.error('Login failed');
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="pg__Wrap">
        {/* <MobHeader></MobHeader> */}
        <div className="c_Logo-wrap">
          <div className="logo_mb-s">
            <img src="assets/images/logo-m.png" alt="logo" />
          </div>
        </div>
        <div className="login__Sec">
          <div className="act_Ttl">
            <h3>Log in to your account</h3>
            <p>Welcome back! Please enter your details.</p>
          </div>
          <div className="act_Form">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="sPhone" className="form-label">
                  Phone No*
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="sPhone"
                  name="phn_no"
                  value={formData.phn_no}
                  onChange={onChangeInput}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="sPassword" className="form-label">
                  Password*
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="sPassword"
                  name="password"
                  value={formData.password}
                  onChange={onChangeInput}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="mb-3">
                <span className="frgt">Forgot password?</span>
              </div>
              <div className="sbt_btn">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                <span>
                  Don’t have an account? <Link to="/signup">Sign up</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <MobileModal isOpen={isMobModalOpen} onClose={closeMobModal}></MobileModal> */}
    </>
  );
};

export default Login;
