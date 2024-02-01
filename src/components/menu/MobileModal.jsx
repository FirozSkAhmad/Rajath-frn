import React, { useEffect } from "react";
import "./mobileModal.css";

import { Link } from "react-router-dom";

import { NavLink } from "react-router-dom";

import { useNavigate } from "react-router-dom";

const MobileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  // useEffect(() => {
  //     const initializeCursor = () => {
  //         const links = document.querySelectorAll('a');
  //         const cursor = document.querySelector('[data-cursor="1"]');

  //         links.forEach(link => {
  //             link.addEventListener('mouseenter', () => {
  //                 cursor.classList.add('cursor-hover--a');
  //             });

  //             link.addEventListener('mouseleave', () => {
  //                 cursor.classList.remove('cursor-hover--a');
  //             });
  //         });
  //     };

  //     initializeCursor();

  //     // Clean up event listeners when the component unmounts
  //     return () => {
  //         const links = document.querySelectorAll('a');

  //         links.forEach(link => {
  //             link.removeEventListener('mouseenter', () => { });
  //             link.removeEventListener('mouseleave', () => { });
  //         });
  //     };
  // }, []);

  const role_type = localStorage.getItem("role_type");

  const handleLogOut = () => {
    localStorage.removeItem("role_type");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("surveyor_id");
    onClose();
    navigate("/");
  };

  return (
    <>
      <div className={`mob-modal ${isOpen ? "open" : ""}`}>
        <div className="mob-modal-content">
          <div className="mob-menu_Md-wrap">
            <div className="mob-mn_Cnt-bx">
              <div className="mob-mn_Main-cnt">
                <div className="mob-mn_Col1">
                  <div className="mob-mn_Ttl-icn">
                    {/* <Link href="/" onClick={onClose}><Image src="/assets/images/menu-logo.svg" alt='project-d' width={400} height={56}></Image></Link> */}
                    <a
                      href="/"
                      className="mob-menu_Modal-logo"
                      onClick={onClose}
                    >
                      <img src="/assets/images/logo.png" alt="logo"></img>
                    </a>
                    {/* <span>
                                            Super Admin
                                        </span> */}
                  </div>
                  {/* <div className="mn_Cnt-us">
                                        <a href="" onClick={onClose}>Contact BE <i className="fa-solid fa-arrow-right"></i></a>
                                    </div> */}
                </div>
                <div className="mob-mn_Col2">
                  <ul>
                    <li>
                      {role_type === "SUPER ADMIN" ? (
                        <NavLink to="/admin/dashboard" onClick={onClose}>
                          Dashboard
                        </NavLink>
                      ) : (
                        <NavLink to="/surveyor/dashboard" onClick={onClose}>
                          Dashboard
                        </NavLink>
                      )}
                    </li>
                    <li>
                      {role_type === "SUPER ADMIN" ? (
                        <NavLink to="/admin/approvals" onClick={onClose}>
                          Approvals
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </li>
                    <li>
                      {role_type === "SUPER ADMIN" ? (
                        <NavLink to="/admin/history" onClick={onClose}>
                          History
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </li>
                    <li>
                      {role_type === "SUPER ADMIN" ? (
                        <NavLink to="/admin/addVolunteer" onClick={onClose}>
                          Add Volunteer
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </li>
                    <li>
                      {role_type === "SUPER ADMIN" ? (
                        <NavLink to="/admin/surveyorList" onClick={onClose}>
                          surveyor List
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </li>
                  </ul>
                  <button onClick={handleLogOut}>Logout</button>
                </div>
              </div>
              <button className="mob-mn_Cl-icn" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>
    </>
  );
};

export default MobileModal;
