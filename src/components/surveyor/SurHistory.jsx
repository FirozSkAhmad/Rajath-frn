import React, { useState, useEffect } from "react";
import MobHeader from "../header/MobHeader";
import MobileModal from "../menu/MobileModal";
import VolunteerDetailsCard from "./VolunteerDetailsCard";
import BASEURL from "../../data/baseurl";
// import "./approval.css";
// import SurveyorCustomModel from "./SurveyorCustomModel";

import { TextField, Autocomplete } from "@mui/material";

import { ThreeCircles } from "react-loader-spinner";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";

const SurHistory = () => {
  const { isMobModalOpen, closeMobModal, setVolunteerData } =
    useContext(sharedContext);

  const [volunteersList, setVolunteersList] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAssembly, setSelectedAssembly] = useState(null);
  const [selectedTaluka, setSelectedTaluka] = useState(null);

  const [listOfTaluka, setListOfTaluka] = useState([]);

  const [isVDCOpen, setIsVDCOpen] = useState(false);

  const token = localStorage.getItem("accessToken");
  const surveyor_id = localStorage.getItem("surveyor_id");

  const fetchVolunteersData = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${BASEURL.url}/auth/getVolunteersDataBySurveyorId?surveyor_id=${surveyor_id}`,
        requestOptions
      );
      const data = await response.json();

      const VolunteersData = data.data;

      // Filter data based on the selectedDate, selectedAssembly, and selectedTaluka
      const filteredData = VolunteersData.filter((volunteer) => {
        const dateFilter =
          !selectedDate ||
          new Date(volunteer.createdAt).toLocaleDateString() ===
            new Date(selectedDate).toLocaleDateString();

        const assemblyFilter =
          selectedAssembly === null || volunteer.assembly === selectedAssembly;

        const talukaFilter =
          selectedTaluka === null || volunteer.taluka === selectedTaluka;

        return dateFilter && assemblyFilter && talukaFilter;
      });

      setVolunteersList(filteredData);
    } catch (error) {
      console.log("error", error);
    }
  };

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
      setListOfTaluka(data.data);
      console.log(data.data);
    } catch (err) {
      console.log("Error fetching overview data:", err);
    }
  };

  const handleViewDetails = (data) => {
    setVolunteerData(data);
    setIsVDCOpen(true);
  };

  const fetchData = () => {
    fetchVolunteersData();
  };

  useEffect(() => {
    fetchData();
    getTalukasByAssembly(selectedAssembly);
  }, [selectedDate, selectedAssembly, selectedTaluka]);

  return (
    <>
      <div className="pg__Wrap">
        <MobHeader></MobHeader>
        <div className="approval__Sec">
          <div
            className="hs_Row1"
            style={{ display: "flex"}}
          >
            <div
              className="ad_flt-dt"
              style={{ marginTop: "10px", width: "100%" }}
            >
              <div className="ad_flt-dt-bx">
                <div className="input-group">
                  <span className="input-group-text sc-icn" id="basic-addon1">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    list="datalistOptions"
                    id="exampleDataList"
                    placeholder="Type to search..."
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="app_ref-btn">
              <button className="btn" onClick={() => fetchData()}>
                <i className="fa-solid fa-rotate-right"></i>
              </button>
            </div>
          </div>

          <div
            className="hs_Row1"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <div className="hs_sh-p">
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
                value={selectedAssembly}
                onChange={(event, newValue) => {
                  setSelectedAssembly(newValue);
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
            <div className="hs_sh-as">
              <Autocomplete
                className="auto__Fld"
                autoHighlight
                options={listOfTaluka}
                value={selectedTaluka}
                onChange={(event, newValue) => {
                  setSelectedTaluka(newValue);
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
          </div>

          <div className="app_Table">
            <table className="table align-middle">
              <thead className="align-middle table-primary">
                <tr className="align-middle">
                  <th scope="col">Assembly</th>
                  <th scope="col">Taluka</th>
                  <th scope="col">Booth</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {volunteersList === null ? (
                  <tr>
                    <td colSpan="4">
                      <ThreeCircles
                        visible={true}
                        height="100"
                        width="100"
                        color="#4fa94d"
                        ariaLabel="three-circles-loading"
                        wrapperStyle={{}}
                        wrapperClass="loader"
                      />
                    </td>
                  </tr>
                ) : (
                  <>
                    {Array.isArray(volunteersList) &&
                    volunteersList.length > 0 ? (
                      volunteersList.map((item) => (
                        <tr key={item.id}>
                          <td>{item.assembly}</td>
                          <td>{item.taluka}</td>
                          <td>{item.booth}</td>
                          <td>
                            <button
                              type="button"
                              className="btn"
                              onClick={() => handleViewDetails(item)}
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">
                          No data exits that need to be approved.
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <MobileModal
        isOpen={isMobModalOpen}
        onClose={closeMobModal}
      ></MobileModal>
      <VolunteerDetailsCard
        isOpen={isVDCOpen}
        onClose={() => setIsVDCOpen(false)}
        fetchVolunteersData={() => fetchVolunteersData()}
      ></VolunteerDetailsCard>
    </>
  );
};

export default SurHistory;
