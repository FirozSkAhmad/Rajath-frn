import React, { useState, useEffect } from "react";
import BASEURL from "../../data/baseurl";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
// import "./SurveyorEditCustomModal.css";

import { TextField, Autocomplete } from "@mui/material";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../Loader";

const VolunteerEditCard = ({
  isOpen,
  onClose,
  closeVEC,
  getBoothDetailsByATB,
  fetchVolunteersData,
}) => {
  if (!isOpen) {
    return null;
  }

  let location = useLocation();

  const { volunteerData, setLoader } = useContext(sharedContext);

  const [listOftalukas, setListOftalukas] = useState([]);
  const [listOfBooths, setListOfBooths] = useState([]);

  const token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    // Prefilled data from query parameters
    assembly: volunteerData.assembly || "empty",
    taluka: volunteerData.taluka || "empty",
    booth: volunteerData.booth || "empty",
    booth_address: volunteerData.booth_address || "empty",
    volunteer_name: volunteerData.volunteer_name || "empty",
    phn_no: volunteerData.phn_no || "empty",
    emailId: volunteerData.emailId || "empty",
    gender: volunteerData.gender || "empty",
    age: volunteerData.age || "empty",
    caste: volunteerData.caste || "empty",
    occupation: volunteerData.occupation || "empty",
    volunteer_address: volunteerData.volunteer_address || "empty",
    designation: volunteerData.designation || "empty",
    profileImage: null,
    // Other form fields...
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    volunteerData ? volunteerData.photo_url : ""
  );

  const getTalukasByAssembly = async (selectedAssembly) => {
    try {
      const response = await fetch(
        `${BASEURL.url}/com/talukasByAssembly?assembly=${selectedAssembly}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setListOftalukas(data.data);
    } catch (err) {
      console.log("Error fetching overview data:", err);
    }
  };

  const getBoothsByAT = async (selectedAssembly, selectedTaluka) => {
    try {
      const response = await fetch(
        `${BASEURL.url}/com/getBooths?assembly=${selectedAssembly}&taluka=${selectedTaluka}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setListOfBooths(data.data);
    } catch (err) {
      console.log("Error fetching overview data:", err);
    }
  };

  const getBoothAddress = async (
    selectedAssembly,
    selectedTaluka,
    selectedBooth
  ) => {
    try {
      const response = await fetch(
        `${BASEURL.url}/com/getBoothAddress?assembly=${selectedAssembly}&taluka=${selectedTaluka}&booth=${selectedBooth}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const Reaponse = await response.json();
      setFormData((prevData) => ({
        ...prevData,
        ["booth_address"]: Reaponse.data.address,
      }));
    } catch (err) {
      console.log("Error fetching overview data:", err);
    }
  };

  useEffect(() => {
    if (volunteerData) {
      setFormData({
        assembly: volunteerData.assembly || "",
        taluka: volunteerData.taluka || "",
        booth: volunteerData.booth || "",
        booth_address: volunteerData.booth_address || "",
        volunteer_name: volunteerData.volunteer_name || "",
        phn_no: volunteerData.phn_no || "",
        emailId:
          volunteerData.emailId === "empty" ? null : volunteerData.emailId,
        gender: volunteerData.gender || "",
        age: volunteerData.age || "",
        caste: volunteerData.caste || "",
        occupation: volunteerData.occupation || "",
        volunteer_address: volunteerData.volunteer_address || "",
        designation: volunteerData.designation || "",
        profileImage: volunteerData.profileImage || null,
        // Populate other fields if necessary
      });

      setImagePreviewUrl(volunteerData.photo_url || "");

      const loadData = async () => {
        setLoader(true); // Start loading before any async operation

        try {
          // Await all necessary fetch operations
          await getTalukasByAssembly(volunteerData.assembly);
          await getBoothsByAT(volunteerData.assembly, volunteerData.taluka);
        } catch (error) {
          // Handle any errors that might occur during the fetch operations
          console.error("An error occurred while fetching data:", error);
          setLoader(false);
        } finally {
          // This will always run after all awaits are resolved/rejected
          setLoader(false); // Stop loading after all async operations are done
        }
      };

      loadData();

      // Revoke the image preview URL when the component is unmounted or data changes
      return () => {
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
      };
    }
  }, [volunteerData]);

  const handleSubmit = (event, volunteer_id) => {
    event.preventDefault();
    setLoader(true);
    // Perform actions for Accept button

    const token = localStorage.getItem("accessToken");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("assembly", formData.assembly || "");
    formdata.append("taluka", formData.taluka || "");
    formdata.append("booth", formData.booth || "");
    formdata.append("booth_address", formData.booth_address || "");
    formdata.append("volunteer_name", formData.volunteer_name || "");
    formdata.append("phn_no", formData.phn_no || "");
    formdata.append("emailId", formData.emailId || "");
    formdata.append("gender", formData.gender || "");
    formdata.append("age", formData.age || "");
    formdata.append("caste", formData.caste || "");
    formdata.append("occupation", formData.occupation || "");
    formdata.append("volunteer_address", formData.volunteer_address || "");
    formdata.append("designation", formData.designation || "");

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

    fetch(`${BASEURL.url}/auth/volunteerUpdate/${volunteer_id}`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.status == 201) {
          toast.success("updated volunteer successfully");
          if (location.pathname === "/booth-address") {
            getBoothDetailsByATB();
            setLoader(false);
          } else if (location.pathname === "/surveyor/history") {
            fetchVolunteersData();
            setLoader(false);
          }
          onClose();
          closeVEC();
        } else {
          toast.error(result.message);
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.message || "Failed to update Surveyor");
        setLoader(false);
      });
  };

  const handleChange = (e) => {
    // Handle standard input change
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAutocompleteChange = (e, newValue, fieldName = null) => {
    // Determine if this is an Autocomplete change or a standard input change
    if (fieldName === "assembly") {
      if (newValue !== formData.assembly) {
        setFormData((prevData) => ({
          ...prevData,
          ["taluka"]: "",
          ["booth"]: "",
          ["booth_address"]: "",
        }));

        getTalukasByAssembly(newValue);

        // Handle change from Autocomplete, using the fieldName parameter
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: newValue, // Use dynamic field name
        }));
      }
    } else if (fieldName === "taluka") {
      if (newValue !== formData.taluka) {
        setFormData((prevData) => ({
          ...prevData,
          ["booth"]: "",
          ["booth_address"]: "",
        }));

        getBoothsByAT(formData.assembly, newValue);

        // Handle change from Autocomplete, using the fieldName parameter
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: newValue, // Use dynamic field name
        }));
      }
    } else if (fieldName === "booth") {
      if (newValue !== formData.taluka) {
        setFormData((prevData) => ({
          ...prevData,
          ["booth_address"]: "",
        }));
        getBoothAddress(formData.assembly, formData.taluka, newValue);

        // Handle change from Autocomplete, using the fieldName parameter
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: newValue, // Use dynamic field name
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: newValue, // Use dynamic field name
      }));
    }
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
      <Loader />
      <div className="custom-modal-overlay">
        <div className="custom-modal" style={{ position: "absolute" }}>
          <div className="modal-header">
            <h2>Edit Volunteers</h2>
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
              <div onClick={() => document.getElementById("fileInput").click()}>
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
              <form onSubmit={(event) => handleSubmit(event, volunteerData.id)}>
                <div className="onBoard_cnt">
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Assembly* :</span>
                    <Autocomplete
                      className="auto__Fld"
                      autoHighlight
                      options={[
                        "Baramati",
                        "Satara",
                        "Parbhani",
                        "Buldhana",
                        "Shirur",
                        "Osmanabad",
                      ]}
                      value={formData.assembly}
                      onChange={(event, newValue) => {
                        // Pass null as the first argument, newValue, and explicitly specify the field name
                        handleAutocompleteChange(null, newValue, "assembly");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Assembly"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Thaluka :</span>
                    <Autocomplete
                      className="auto__Fld"
                      autoHighlight
                      options={listOftalukas}
                      value={formData.taluka}
                      onChange={(event, newValue) => {
                        // Pass null as the first argument, newValue, and explicitly specify the field name
                        handleAutocompleteChange(null, newValue, "taluka");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Taluka"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Booth :</span>
                    <Autocomplete
                      className="auto__Fld"
                      autoHighlight
                      options={listOfBooths}
                      value={formData.booth}
                      onChange={(event, newValue) => {
                        // Pass null as the first argument, newValue, and explicitly specify the field name
                        handleAutocompleteChange(null, newValue, "booth");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Booth"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Booth Address :</span>
                    <div className="onBoard_inp-fld">
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        aria-describedby=""
                        name="booth_address"
                        value={formData.booth_address}
                        disabled
                        // onChange={handleChange}
                        autoComplete="off"
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Volunteer Name :</span>
                    <div className="onBoard_inp-fld">
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        aria-describedby=""
                        name="volunteer_name"
                        value={formData.volunteer_name}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Phone No :</span>
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
                    <span className="onBoard_inp-n">Email ID :</span>
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
                    <span className="onBoard_inp-n">Gender :</span>
                    <Autocomplete
                      className="auto__Fld"
                      autoHighlight
                      options={["Male", "Female", "Other"]}
                      value={formData.gender}
                      onChange={(event, newValue) => {
                        // Pass null as the first argument, newValue, and explicitly specify the field name
                        handleAutocompleteChange(null, newValue, "gender");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Gender"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Address :</span>
                    <div className="onBoard_inp-fld">
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        aria-describedby=""
                        name="volunteer_address"
                        value={formData.volunteer_address}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Age :</span>
                    <div className="onBoard_inp-fld">
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        aria-describedby=""
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Caste :</span>
                    <div className="onBoard_inp-fld">
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        aria-describedby=""
                        name="caste"
                        value={formData.caste}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Occupation :</span>
                    <div className="onBoard_inp-fld">
                      <input
                        type="text"
                        className="form-control"
                        id=""
                        aria-describedby=""
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="onBoard_input-box">
                    <span className="onBoard_inp-n">Degination :</span>
                    <Autocomplete
                      className="auto__Fld"
                      autoHighlight
                      options={["PRESIDENT", "BLA1", "BLA2", "VOLUNTEER"]}
                      value={formData.designation}
                      onChange={(event, newValue) => {
                        // Pass null as the first argument, newValue, and explicitly specify the field name
                        handleAutocompleteChange(null, newValue, "designation");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Designation"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
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
                      onClick={onClose}
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
    </>
  );
};

export default VolunteerEditCard;
