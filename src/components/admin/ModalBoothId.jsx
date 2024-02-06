import React, { useEffect, useState } from "react";
import BASEURL from "../../data/baseurl";
import Red from "../../../public/assets/images/red.svg";
import "./ModelDetail.css";
import DataPass from "./DataPass";

const BoothModal = ({ selectedRow, onClose }) => {
  const [boothdata, setBoothData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  // token
  const token = localStorage.getItem("accessToken");

  const getWordColor = (status) => {
    switch (status) {
      case "YELLOW":
        return "#ff0"; // Yellow color
      case "GREEN":
        return "#0f0"; // Green color
      case "RED":
        return "#f00"; // Red color
      default:
        return "#000"; // Default color for unknown statuses
    }
  };

  const renderStatusIcon = (data) => {
    return data === "NOT FILLED" ? (
      <img src={Red} alt="red" />
    ) : (
      `${data.volunteer_name} - ${data.phn_no}`
    );
  };

  useEffect(() => {
    const fetchBoothDetails = async () => {
      try {
        const response = await fetch(
          `${BASEURL.url}/admin/getVolunteersByBoothId?booth_id=${selectedRow.booth_id}`,
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
        if (!data.data) {
          throw new Error("Unexpected data structure");
        }
        setBoothData(data.data);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching data:", err);
        setError("Error fetching data. Please try again."); // Set error message
        setLoading(false);
      }
    };
    fetchBoothDetails();
    console.log("getVolunteersByBoothId");
  }, [selectedRow.booth_id]);

  return (
    <div className="modal admin_modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <>
            <p
              onClick={() => {
                if (
                  boothdata.PRESIDENT &&
                  boothdata.PRESIDENT !== "NOT FILLED"
                ) {
                  const updatedPresident = {
                    ...boothdata.PRESIDENT, // Spread the existing properties
                    designation: "PRESIDENT", // Add or overwrite the 'designation' key
                  };

                  setSelectedVolunteer(updatedPresident);
                }
              }}
            >
              Booth Level President: {renderStatusIcon(boothdata.PRESIDENT)}
            </p>
            <p
              onClick={() => {
                if (boothdata.BLA1 && boothdata.BLA1 !== "NOT FILLED") {
                  const updatedBLA1 = {
                    ...boothdata.BLA1, // Spread the existing properties
                    designation: "BLA1", // Add or overwrite the 'designation' key
                  };

                  setSelectedVolunteer(updatedBLA1);
                }
              }}
            >
              {/* Booth Level Agent 1: {boothdata.BLA1.volunteer_name} */}
              Booth Level Agent 1: {renderStatusIcon(boothdata.BLA1)}
            </p>
            <p
              onClick={() => {
                if (boothdata.BLA2 && boothdata.BLA2 !== "NOT FILLED") {
                  const updatedBLA2 = {
                    ...boothdata.BLA2, // Spread the existing properties
                    designation: "BLA2", // Add or overwrite the 'designation' key
                  };

                  setSelectedVolunteer(updatedBLA2);
                }
              }}
            >
              Booth Level Agent 2: {renderStatusIcon(boothdata.BLA2)}
            </p>

            {boothdata.volunteers.map((volunteer, index) => (
              <p
                key={index}
                onClick={() => {
                  const updatedVolunteer = {
                    ...volunteer, // Spread the existing properties
                    designation: "VOLUNTEER", // Add or overwrite the 'designation' key
                  };

                  setSelectedVolunteer(updatedVolunteer);
                }}
              >
                Booth Level Volunteer {index + 1}: {volunteer.volunteer_name} -{" "}
                {volunteer.phn_no}
              </p>
            ))}
            <p>
              Booth Status:{" "}
              <span style={{ color: getWordColor(selectedRow.booth_status) }}>
                {selectedRow.booth_status === "YELLOW" && "Semi Filled"}
                {selectedRow.booth_status === "GREEN" && "Fully Filled"}
                {selectedRow.booth_status === "RED" && "Empty"}
              </span>
            </p>
          </>
        )}
      </div>
      {selectedVolunteer && (
        <DataPass
          selectedVolunteer={selectedVolunteer}
          onClose={() => {
            setSelectedVolunteer(null);
          }}
        />
      )}
    </div>
  );
};

export default BoothModal;
