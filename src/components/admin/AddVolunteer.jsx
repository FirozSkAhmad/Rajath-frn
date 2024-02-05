import React, { useState, useEffect } from "react";
import "./style.css";
import MobHeader from "../header/MobHeader";
import MobileModal from "../menu/MobileModal";
// import { useMobHeaderContext } from '../../context/MobHeader';
import PdfGenerator from "./PdfGenerator";

import { Link } from "react-router-dom";
import BASEURL from "../../data/baseurl";

import { ThreeCircles } from "react-loader-spinner";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";

const AddVolunteer = () => {
  const { isMobModalOpen, closeMobModal } = useContext(sharedContext);

  const [atsList, setAtsList] = useState("");

  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    const getAtsList = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          `${BASEURL.url}/auth/getATS`,
          requestOptions
        );
        const data = await response.json();
        const atsData = data.data;
        console.log("ATS", data);
        setAtsList(atsData);
      } catch (error) {
        console.log("error", error);
      }
    };

    getAtsList();
  }, []);

  const viewAtsList = (data) => {
    if (!data) {
      // return <div>Data is loading...</div>;
      return (
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass="loader"
        />
      );
    }

    return Object.entries(data).map(([location, items]) => (
      <div className="sr_dt-card" key={location}>
        <div className="sr_dt-as">
          <span>{location}</span>
        </div>
        <div className="sr-dt-tlk_lst">
          {Array.isArray(items) ? (
            items.map((item, index) => (
              <div className="sr_dt-tlk-list" key={index}>
                <div className="sr_dt-tlk">
                  <div className="sr_tlk-n">
                    <Link
                      to={`/polling-booths?assembly=${location}&taluka=${item.taluka}`}
                    >
                      {item.taluka}
                    </Link>
                  </div>
                  <div className="sr_tlk-sts">
                    {renderStatusIcon(item.status)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Data is loading...</div>
          )}
        </div>
      </div>
    ));
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case "RED":
        return (
          <span className="sr-red">
            <i className="fa-solid fa-xmark"></i>
          </span>
        );
      case "YELLOW":
        return (
          <span className="sr-yellow">
            <i className="fa-solid fa-check"></i>
          </span>
        );
      case "GREEN":
        return (
          <span className="sr-green">
            <i className="fa-solid fa-check"></i>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="pg__Wrap">
        <MobHeader></MobHeader>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
            marginRight: "10px",
          }}
        >
          <button
            style={{
              border: "none",
              backgroundColor: "#6B46C1",
              color: "white",
              fontSize: "14px",
              borderRadius: "7px",
              padding: "5px 10px",
            }}
          >
            <PDFDownloadLink
              document={
                <PdfGenerator
                  userData={{
                    title: "Booth President",
                    name: "Naga",
                    phone: "123456789",
                    address: "dummy address",
                    imageSrc: "https://pab-volunteer-imgs.s3.ap-south-1.amazonaws.com/SurveyorImgs/dummy_profile.jpeg", // This should be a base64 or URL to an image
                  }}
                />
              }
              fileName="mypdf.pdf"
            >
              {({ blob, url, loading, error }) =>
                loading ? "Loading document..." : "Download now!"
              }
            </PDFDownloadLink>
          </button>
        </div>
        <div className="sur__Sec-wrap">
          <div className="sur_mn-ttl">
            <div className="sr_mn-as">
              <span>Assembly</span>
            </div>
            <div className="sr_mn-tlk">
              <span>Thaluka</span>
              <span>Status</span>
            </div>
          </div>
          <div className="sr_dt-div">{viewAtsList(atsList)}</div>
        </div>
      </div>
      <MobileModal
        isOpen={isMobModalOpen}
        onClose={closeMobModal}
      ></MobileModal>
    </>
  );
};

export default AddVolunteer;
