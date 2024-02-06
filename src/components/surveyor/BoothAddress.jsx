import React, { useState, useEffect } from "react";
import "./pollingBooth.css";
import MobHeader from "../header/MobHeader";
import MobileModal from "../menu/MobileModal";
import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import PdfGenerator from "../admin/PdfGenerator";

import VolunteerDetailsCard from "./VolunteerDetailsCard";

import { Link, useSearchParams } from "react-router-dom";
import BASEURL from "../../data/baseurl";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";

const BoothAddress = () => {
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

  const convertImageToBase64 = async (imageUrl) => {
    try {
      const response = await fetch(
        `${BASEURL.url}/admin/convert-image-to-base64?url=${imageUrl}`,
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
      console.log(data.base64Image);
      return data.base64Image;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const downloadPDF = async (userData) => {
    try {
      const zip = new JSZip();
      // Main folder name comes from userData.address
      const mainFolder = zip.folder(userData.address);

      // Iterate over userData to process each key/value where value is an object
      for (const [key, value] of Object.entries(userData)) {
        if (
          typeof value === "object" &&
          value !== null &&
          key !== "volunteers"
        ) {
          // Assuming you have a way to convert each section to a PDF document
          // Convert image URLs to Base64 if necessary
          if (value.photo_url) {
            value.img_url = await convertImageToBase64(value.photo_url);
          }

          const doc = <PdfGenerator volunteerData={value} />;
          const asPdf = pdf([]);
          asPdf.updateContainer(doc);
          const blob = await asPdf.toBlob();

          // Add the PDF blob to the folder with the key name
          mainFolder.file(`${key}.pdf`, blob, { binary: true });
        }
      }

      // Special handling for 'volunteers' array to generate multiple PDFs
      if (userData.volunteers && Array.isArray(userData.volunteers)) {
        const volunteersFolder = mainFolder.folder("volunteers");
        let counter = 1; // Initialize counter for naming PDFs
        for (const volunteer of userData.volunteers) {
          if (volunteer.photo_url) {
            volunteer.img_url = await convertImageToBase64(
              volunteer.photo_url
            );
          }
          const doc = <PdfGenerator volunteerData={volunteer} />;
          const asPdf = pdf([]);
          asPdf.updateContainer(doc);
          const blob = await asPdf.toBlob();

          // Use the counter to name the PDF files
          volunteersFolder.file(`volunteer${counter}.pdf`, blob, {
            binary: true,
          });
          counter++; // Increment the counter for the next volunteer
        }
      }

      // Generate the ZIP file and trigger the download
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${userData.address}.zip`);
    } catch (error) {
      console.error("An error occurred while generating the PDF/ZIP:", error);
    }
  };

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
    setIsVDCOpen(true);
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
            onClick={() =>
              downloadPDF(boothData)
            }
          >
            Download
          </button>
        </div>
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
