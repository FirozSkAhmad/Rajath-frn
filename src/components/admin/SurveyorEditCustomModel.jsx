import React, { useState, useEffect } from "react";
import BASEURL from "../../data/baseurl";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import "./SurveyorEditCustomModal.css";

const SurveyorEditCustomModal = ({
  isOpen,
  onClose,
  data,
  closeSurveyorEditCustomModel,
  fetchUserList,
}) => {
  if (!isOpen || !data) {
    return null;
  }

  const [formData, setFormData] = useState({
    // Prefilled data from query parameters
    surveyor_name: "",
    phn_no: "",
    emailId: "",
    address: "",
    profileImage: null,
    // Other form fields...
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    data ? data.photo_url : ""
  );

  useEffect(() => {
    if (data) {
      setFormData({
        surveyor_name: data.surveyor_name || "",
        phn_no: data.phn_no || "",
        emailId: data.emailId || "",
        address: data.address || "",
        profileImage: data.profileImage || null,
        // Populate other fields if necessary
      });
      setImagePreviewUrl(data.photo_url || "");

      // Revoke the image preview URL when the component is unmounted or data changes
      return () => {
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
      };
    }
  }, [data]);

  const handleSubmit = (event, surveyor_id) => {
    event.preventDefault();
    // Perform actions for Accept button
    console.log("Save clicked", surveyor_id);

    const token = localStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("surveyor_name", formData.surveyor_name);
    formdata.append("phn_no", formData.phn_no);
    formdata.append("emailId", formData.emailId);
    formdata.append("address", formData.address);
    // Append profileImage only if it's not null
    if (formData.profileImage) {
      formdata.append("profileImage", formData.profileImage);
    }

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${BASEURL.url}/admin/surveyorUpdate/${surveyor_id}`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.status == 201) {
          toast.success("updated Surveyor successfully");
          fetchUserList();
          onClose();
          closeSurveyorEditCustomModel();
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message || "Failed to update Surveyor");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });

      // Revoke the previous image preview URL
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }

      // Create a new URL for the selected file
      const newImagePreviewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(newImagePreviewUrl);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal" style={{position:'absolute'}}>
            <div className="modal-header">
              <h2>Edit</h2>
              <span className="close-btn" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
              </span>
            </div>
            <div className="modal-body-h">
              <div
                className="prof_img-ap"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                  gap: "5px",
                }}
              >
                <img src={imagePreviewUrl} alt="surveyor_img" />
                <div
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <FaRegEdit />
                </div>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              {/* Display details from 'data' prop */}
              <div className="on_Board-form">
                <form
                  onSubmit={(event) => handleSubmit(event, data.surveyor_id)}
                >
                  <div className="onBoard_cnt">
                    <div className="onBoard_input-box">
                      <span className="onBoard_inp-n">Surveyor Name :</span>
                      <div className="onBoard_inp-fld">
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          aria-describedby=""
                          name="surveyor_name"
                          value={formData.surveyor_name}
                          onChange={handleChange}
                          autoComplete="off"
                          required
                        ></input>
                      </div>
                    </div>
                    <div className="onBoard_input-box">
                      <span className="onBoard_inp-n">Phone no:</span>
                      <div className="onBoard_inp-fld">
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          aria-describedby=""
                          name="phn_no"
                          value={formData.phn_no}
                          onChange={handleChange}
                          autoComplete="off"
                          required
                        ></input>
                      </div>
                    </div>
                    <div className="onBoard_input-box">
                      <span className="onBoard_inp-n">Email ID:</span>
                      <div className="onBoard_inp-fld">
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          aria-describedby=""
                          name="emailId"
                          value={formData.emailId}
                          onChange={handleChange}
                          autoComplete="off"
                          required
                        ></input>
                      </div>
                    </div>
                    <div className="onBoard_input-box">
                      <span className="onBoard_inp-n">Address:</span>
                      <div className="onBoard_inp-fld">
                        <input
                          type="text"
                          className="form-control"
                          id=""
                          aria-describedby=""
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          autoComplete="off"
                          required
                        ></input>
                      </div>
                    </div>

                    <div
                      className="app__Btns"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "30px",
                      }}
                    >
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => onClose()}
                      >
                        Cancle
                      </button>
                      <button className="btn btn-success" type="submit">
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* Add additional modal content or buttons as needed */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SurveyorEditCustomModal;
