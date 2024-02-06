import React, { useState, useContext } from "react";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import BASEURL from "../../data/baseurl";
import toast from "react-hot-toast";
import sharedContext from "../../context/SharedContext";
import Loader from "../Loader"

const Login = () => {
  const { setLoader } = useContext(sharedContext);

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
    setLoader(true);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

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
      const response = await fetch(`${BASEURL.url}/auth/login`, requestOptions);

      if (response.ok) {
        setIsAuthorized(true);
        const data = await response.json();
        // Use optional chaining and nullish coalescing for safer property access
        const role_type = data?.data?.role_type ?? "";
        const accessToken = data?.data?.accessToken;

        localStorage.setItem("accessToken", accessToken);

        localStorage.setItem("role_type", role_type);

        // Redirect to the appropriate dashboard
        if (role_type === "SUPER ADMIN") {
          // Use the Navigate component to redirect
          setLoader(false);
          const surveyorId = data?.data?.id;
          localStorage.setItem("surveyor_id", surveyorId);
          navigate("/admin/dashboard");
          toast.success("logined Successfully");
        } else {
          // You can use the Navigate component or another method to redirect to the user dashboard
          setLoader(false);
          const surveyorId = data?.data?.id;
          localStorage.setItem("surveyor_id", surveyorId);
          navigate("/surveyor/dashboard");
          toast.success("logined Successfully");
        }
      } else {
        // If login fails, parse and display the error response
        const errorResponse = await response.json();
        toast.error("Login failed:", errorResponse.message);
        setLoader(false);
        setError(errorResponse.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Loader />
      <div className="pg__Wrap">
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
