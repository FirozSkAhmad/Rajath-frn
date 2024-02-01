import React, { useState, useEffect } from "react";
import "./pollingBooth.css";
import MobHeader from "../header/MobHeader";
import MobileModal from "../menu/MobileModal";
import { useMobHeaderContext } from "../../context/MobHeader";

import { Link, useSearchParams } from "react-router-dom";
import BASEURL from "../../data/baseurl";

const BoothAddress = () => {
  const { isMobModalOpen, closeMobModal } = useMobHeaderContext();
  let [searchParams] = useSearchParams();

  const [boothData, setBoothData] = useState("");
  const [boothAddress, setBoothAddress] = useState("");
  const [volunteersData, setVolunteersData] = useState([]);

  // Token
  const token = localStorage.getItem("accessToken");

  // queryParam
  const assembly = searchParams.get("assembly");
  const taluka = searchParams.get("taluka");
  const booth = searchParams.get("booth");

  useEffect(() => {
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
        // const totalBooths = pollingBoothsData.length;
        console.log("boothData", boothData);
        console.log("boothAddress", boothAddress);
        setBoothData(boothData);
        setBoothAddress(boothAddress);
        if (boothData.volunteers) {
          console.log("I'm here in if condition");
          setVolunteersData(boothData.volunteers);
        }
        // setTotalBooths(totalBooths);
        // const users = data.data;
        // setUserList(users);
        // handleUserList(users);
        // console.log(users)
      } catch (error) {
        console.log("error", error);
      }
    };
    getBoothDetailsByATB();
  }, []);

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
                      <span className="bt_prs-filled">Filled</span>
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
                      <span className="bt_prs-filled">Filled</span>
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
                      <span className="bt_prs-filled">Filled</span>
                    )}
                  </span>
                </li>
                {volunteersData && volunteersData.length > 0
                  ? volunteersData.map((volunteerData, index) => (
                      <li key={index}>
                        <span>Volunteer {index + 1}</span>
                        <span className="bt_prs-filled">Filled</span>
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
    </>
  );
};

export default BoothAddress;