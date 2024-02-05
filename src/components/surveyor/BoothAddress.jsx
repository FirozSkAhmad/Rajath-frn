import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pollingBooth.css";
import MobHeader from "../header/MobHeader";
import MobileModal from "../menu/MobileModal";
// import { useMobHeaderContext } from "../../context/MobHeader";

import VolunteerDetailsCard from "./VolunteerDetailsCard";

import { Link, useSearchParams } from "react-router-dom";
import BASEURL from "../../data/baseurl";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";

const BoothAddress = () => {
  // const navigate = useNavigate();
  const { isMobModalOpen, closeMobModal, setVolunteerData } =
    useContext(sharedContext);

  let [searchParams] = useSearchParams();

  const [boothData, setBoothData] = useState("");
  const [boothAddress, setBoothAddress] = useState("");
  const [volunteersData, setVolunteersData] = useState([]);

  const [isVDCOpen, setIsVDCOpen] = useState(false);

  // Token
  const token = localStorage.getItem("accessToken");

  // queryParam
  const assembly = searchParams.get("assembly");
  const taluka = searchParams.get("taluka");
  const booth = searchParams.get("booth");

  const getBoothDetailsByATB = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${BASEURL.url}/auth/getBoothDetailsByATB?assembly=${assembly}&taluka=${taluka}&booth=${booth}`,
        requestOptions
      );
      const data = await response.json();
      const boothData = data.data;
      const boothAddress = boothData.address;

      setBoothData(boothData);
      setBoothAddress(boothAddress);
      if (boothData.volunteers) {
        setVolunteersData(boothData.volunteers);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getBoothDetailsByATB();
  }, []);

  const handleClick = (data) => {
    setVolunteerData(data);
    // navigate("/VolunteerDetailsCard");
    setIsVDCOpen(true);
  };

  return (
    <>
      <div className="pg__Wrap">
        <MobHeader></MobHeader>
        <div className="booth__Ad-sec">
          <div className="bt_Top-ad">
            <span>{boothAddress}</span>
          </div>
          <div className="bt_Category-table">
            <div className="bt_ad-top-hd">
              <span>Category</span>
              <span>Status</span>
            </div>
            <div className="bt_cat-data">
              <ul>
                <li>
                  <span>President</span>
                  <span>
                    {boothData.PRESIDENT === "NOT FILLED" ? (
                      <Link
                        to={`/onboard/PRESIDENT?assembly=${assembly}&taluka=${taluka}&booth=${booth}&boothAddress=${boothAddress}`}
                        className="btn_cr"
                      >
                        Create
                      </Link>
                    ) : (
                      <div
                        className="bt_prs-filled"
                        onClick={() => handleClick(boothData.PRESIDENT)}
                      >
                        Filled
                      </div>
                    )}
                  </span>
                </li>
                <li>
                  <span>BLA 1</span>
                  <span>
                    {boothData.BLA1 === "NOT FILLED" ? (
                      <Link
                        to={`/onboard/BLA1?assembly=${assembly}&taluka=${taluka}&booth=${booth}&boothAddress=${boothAddress}`}
                        className="btn_cr"
                      >
                        Create
                      </Link>
                    ) : (
                      <div
                        className="bt_prs-filled"
                        onClick={() => handleClick(boothData.BLA1)}
                      >
                        Filled
                      </div>
                    )}
                  </span>
                </li>
                <li>
                  <span>BLA 2</span>
                  <span>
                    {boothData.BLA2 === "NOT FILLED" ? (
                      <Link
                        to={`/onboard/BLA2?assembly=${assembly}&taluka=${taluka}&booth=${booth}&boothAddress=${boothAddress}`}
                        className="btn_cr"
                      >
                        Create
                      </Link>
                    ) : (
                      <div
                        className="bt_prs-filled"
                        onClick={() => handleClick(boothData.BLA2)}
                      >
                        Filled
                      </div>
                    )}
                  </span>
                </li>
                {volunteersData && volunteersData.length > 0
                  ? volunteersData.map((volunteerData, index) => (
                      <li key={index}>
                        <span>Volunteer {index + 1}</span>
                        <span
                          className="bt_prs-filled"
                          onClick={() => handleClick(volunteerData)}
                        >
                          Filled
                        </span>
                      </li>
                    ))
                  : ""}
              </ul>
            </div>
            <div className="bt_Add-vol">
              <Link
                to={`/onboard/VOLUNTEER?assembly=${assembly}&taluka=${taluka}&booth=${booth}&boothAddress=${boothAddress}`}
              >
                <span className="bt_vol-txt">Add Volunteer</span>
                <span className="bt_vol_icn">
                  <i className="fa-solid fa-plus"></i>
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="sr_back-btn">
          <Link to={`/polling-booths?assembly=${assembly}&taluka=${taluka}`}>
            Back
          </Link>
        </div>
      </div>
      <MobileModal
        isOpen={isMobModalOpen}
        onClose={closeMobModal}
      ></MobileModal>
      <VolunteerDetailsCard
        isOpen={isVDCOpen}
        onClose={() => setIsVDCOpen(false)}
        getBoothDetailsByATB={() => getBoothDetailsByATB()}
      ></VolunteerDetailsCard>
    </>
  );
};

export default BoothAddress;
