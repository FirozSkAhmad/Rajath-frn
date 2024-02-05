import React, { useState, useEffect } from "react";
import MobHeader from "../header/MobHeader";
// import { useMobHeaderContext } from "../../context/MobHeader";
import MobileModal from "../menu/MobileModal";

import BASEURL from "../../data/baseurl";
import "./approval.css";
import SurveyorCustomModel from "./SurveyorCustomModel";

import { TextField, Autocomplete } from "@mui/material";

import { ThreeCircles } from "react-loader-spinner";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";

const SurveyorList = () => {
  const { isMobModalOpen, closeMobModal } = useContext(sharedContext);

  const [surveyorList, setSurveyorList] = useState(null);

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
      // handleUserList(users);
      // console.log(users)
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

  const fetchData = () => {
    fetchSurveyorList();
    fetchSurveyorNames();
  };

  useEffect(() => {
    fetchData();
  }, [selectedSurveyorName]);

  return (
    <>
      <div className="pg__Wrap">
        <MobHeader></MobHeader>
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
                {surveyorList === null ? (
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
      <SurveyorCustomModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        fetchUserList={() => fetchUserList()}
      ></SurveyorCustomModel>
    </>
  );
};

export default SurveyorList;
