import React, { useState, useEffect } from "react";
import BASEURL from "../../data/baseurl";
import SurveyorEditCustomModel from "./SurveyorEditCustomModel";
import toast from "react-hot-toast";
import "./SurveyorCustomModel.css";

const SurveyorCustomModal = ({ isOpen, onClose, data, fetchUserList }) => {
  if (!isOpen || !data) {
    return null;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleDelete = (event, surveyor_id) => {
    event.preventDefault();

    // Perform actions for Reject button
    console.log("Delete clicked", surveyor_id);

    const token = localStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${BASEURL.url}/admin/deleteSurveyor/${surveyor_id}`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.status == 201) {
          toast.success("Surveyor Deleted successfully");
          fetchUserList();
          onClose();
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message || "Failed to update Surveyor");
      });
  };

  const handleEdit = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  return (
    <>
      {isOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal" style={{ position: "absolute" }}>
            <div className="modal-header">
              <h2>Details</h2>
              <div className="close-btn" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>
            <div className="modal-body-h">
              <div className="prof_img-ap">
                <img src={data.photo_url} alt="surveyor_img" />
              </div>
              {/* Display details from 'data' prop */}
              <p>Surveyor Name : {data.surveyor_name}</p>
              <p>Phone no: {data.phn_no}</p>
              <p>Email ID: {data.emailId}</p>
              <p>Address: {data.address}</p>
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
                  onClick={(event) => handleDelete(event, data.surveyor_id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleEdit(data)}
                >
                  Edit
                </button>
              </div>
            </div>
            {/* Add additional modal content or buttons as needed */}
          </div>
        </div>
      )}
      <SurveyorEditCustomModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        closeSurveyorEditCustomModel={() => onClose()}
        fetchUserList={() => fetchUserList()}
      ></SurveyorEditCustomModel>
    </>
  );
};

export default SurveyorCustomModal;
