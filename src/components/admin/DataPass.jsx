import React from "react";

const DataPass = ({ selectedVolunteer, onClose }) => {
  console.log(selectedVolunteer)
  return (
    <div className="modal admin_modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <div className="mr_dt-mdl">
          <div className="mr_mdl-lst">
            <span>Surveyor Name : {selectedVolunteer.surveyor_name || "NA"}</span>
          </div>
          <div className="mr_mdl-lst">
            <span>Assembly Name : {selectedVolunteer.assembly || "NA"}</span>
          </div>
          <div className="mr_mdl-lst">
            <span>Taluka Name : {selectedVolunteer.taluka || "NA"}</span>
          </div>
          <div className="mr_mdl-lst">
            <span>Booth Name : {selectedVolunteer.booth || "NA"}</span>
          </div>
          <div className="mr_mdl-img">
            <img src={selectedVolunteer.photo_url} alt="photo" />
          </div>
          <div className="mr_mdl-lst">
            <span>Volunteer Name : {selectedVolunteer.volunteer_name || "NA"}</span>
          </div>
          <div className="mr_mdl-lst">
            <span>Contact No : {selectedVolunteer.phn_no || "NA"}</span>
          </div>
          <div className="mr_mdl-lst">
            <span>Designation : {selectedVolunteer.designation || "NA"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPass;
