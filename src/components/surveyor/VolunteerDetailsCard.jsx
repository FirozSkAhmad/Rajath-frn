import React, { useState, useEffect } from "react";
import BASEURL from "../../data/baseurl";
import toast from "react-hot-toast";
// import "./SurveyorCustomModel.css";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";

import VolunteerEditCard from "./VolunteerEditCard";

const VolunteerDetailsCard = ({
  isOpen,
  onClose,
  getBoothDetailsByATB,
  fetchVolunteersData,
}) => {
  const { volunteerData } = useContext(sharedContext);

  const [isVECOpen, setIsVECOpen] = useState(false);

  let location = useLocation();
  console.log("Current path:", location.pathname);

  if (!isOpen) {
    return null;
  }

  const handleDelete = (event, volunteer_id) => {
    event.preventDefault();

    // Perform actions for Reject button
    console.log("Delete clicked", volunteer_id);

    const token = localStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${BASEURL.url}/auth/deleteVolunteer/${volunteer_id}`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.status == 201) {
          toast.success("Volunteer Deleted successfully");
          if (location.pathname === "/booth-address") {
            getBoothDetailsByATB();
          } else if (location.pathname === "/surveyor/history") {
            fetchVolunteersData();
          }
          onClose();
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message || "Failed to delete Volunteer");
      });
  };

  return (
    <>
      <div className="custom-modal-overlay">
        <div className="custom-modal" style={{ position: "absolute" }}>
          <div className="modal-header">
            <h2>Volunteers Details</h2>
            <div className="close-btn" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>
          <div className="modal-body-h">
            <div className="prof_img-ap">
              <img src={volunteerData.photo_url} alt="surveyor_img" />
            </div>
            {/* Display details from 'data' prop */}
            <p>Assembly : {volunteerData.assembly}</p>
            <p>Thaluka: : {volunteerData.taluka}</p>
            <p>Booth : {volunteerData.booth}</p>
            <p>Booth Address : {volunteerData.booth_address}</p>
            <p>Volunteer Name : {volunteerData.volunteer_name}</p>
            <p>Phone no : {volunteerData.phn_no}</p>
            <p>
              Email ID :{" "}
              {volunteerData.emailId ? volunteerData.emailId : "empty"}
            </p>
            <p>Gender : {volunteerData.gender}</p>
            <p>Address : {volunteerData.volunteer_address}</p>
            <p>Age : {volunteerData.age}</p>
            <p>Caste : {volunteerData.caste}</p>
            <p>Occupation : {volunteerData.occupation}</p>
            <p>Designation : {volunteerData.designation}</p>
            <p>Phone no: {volunteerData.phn_no}</p>
            {/* Add more details as needed */}

            <div
              className="app__Btns"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "30px",
              }}
            >
              <button
                className="btn btn-danger"
                onClick={(event) => handleDelete(event, volunteerData.id)}
              >
                Delete
              </button>
              <button
                className="btn btn-success"
                onClick={() => setIsVECOpen(true)}
              >
                Edit
              </button>
            </div>
          </div>
          {/* Add additional modal content or buttons as needed */}
        </div>
      </div>
      <VolunteerEditCard
        isOpen={isVECOpen}
        onClose={() => setIsVECOpen(false)}
        closeVEC={() => onClose()}
        getBoothDetailsByATB={() => getBoothDetailsByATB()}
        fetchVolunteersData={() => fetchVolunteersData()}
      ></VolunteerEditCard>
    </>
  );
};

export default VolunteerDetailsCard;
