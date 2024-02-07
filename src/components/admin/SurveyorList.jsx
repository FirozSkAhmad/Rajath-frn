import React, { useState, useEffect } from "react";
import MobHeader from "../header/MobHeader";
// import { useMobHeaderContext } from "../../context/MobHeader";
import MobileModal from "../menu/MobileModal";

import BASEURL from "../../data/baseurl";
import "./approval.css";
import SurveyorCustomModel from "./SurveyorCustomModel";

import { TextField, Autocomplete } from "@mui/material";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";
import Loader from "../Loader";

const SurveyorList = () => {
  const { isMobModalOpen, closeMobModal, setLoader } =
    useContext(sharedContext);

  const [surveyorList, setSurveyorList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [listOfSurveyorNames, setListOfSurveyorNames] = useState([]);
  const [selectedSurveyorName, setSelectedSurveyorName] = useState(null);

  const token = localStorage.getItem("accessToken");
  // console.log(token);

  const fetchSurveyorList = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${BASEURL.url}/admin/getAllSurveyorDetails`,
        requestOptions
      );
      const data = await response.json();

      const surveyors = data.data;

      // Filter data based on the selectedDate, selectedAssembly, and selectedTaluka
      const filteredData = surveyors.filter((item) => {
        const surveyorNameFilter =
          selectedSurveyorName === null ||
          item.surveyor_name === selectedSurveyorName;

        return surveyorNameFilter;
      });

      setSurveyorList(filteredData);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchSurveyorNames = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${BASEURL.url}/admin/getAllSurveyorNames`,
        requestOptions
      );
      const Response = await response.json();

      const surveyorNames = Response.data;

      setListOfSurveyorNames(surveyorNames);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleViewDetails = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    setLoader(true); // Start loading before any async operation

    try {
      // Await all necessary fetch operations
      await fetchSurveyorList();
      await fetchSurveyorNames();
    } catch (error) {
      // Handle any errors that might occur during the fetch operations
      console.error("An error occurred while fetching data:", error);
      setLoader(false);
    } finally {
      // This will always run after all awaits are resolved/rejected
      setLoader(false); // Stop loading after all async operations are done
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSurveyorName]);

  return (
    <>
      <Loader />
      <div className="pg__Wrap">
        <MobHeader></MobHeader>
        <div className="hs_sh-as">
              <Autocomplete
                className="auto__Fld"
                autoHighlight
                options={listOfSurveyorNames}
                value={selectedSurveyorName}
                onChange={(event, newValue) => {
                  setSelectedSurveyorName(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Surveyor Name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
        <div className="approval__Sec">
          <div className="app_Table">
            <table className="table align-middle">
              <thead className="align-middle table-primary">
                <tr className="align-middle">
                  <th scope="col">Surveyor Name</th>
                  <th scope="col">Phone no</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                    {Array.isArray(surveyorList) && surveyorList.length > 0 ? (
                      surveyorList.map((item) => (
                        <tr key={item.id}>
                          <td>{item.surveyor_name}</td>
                          <td>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <MobileModal
        isOpen={isMobModalOpen}
        onClose={closeMobModal}
      ></MobileModal>
      <SurveyorCustomModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        fetchUserList={() => fetchData()}
      ></SurveyorCustomModel>
    </>
  );
};

export default SurveyorList;
