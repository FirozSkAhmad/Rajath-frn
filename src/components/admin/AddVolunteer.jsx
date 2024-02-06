import React, { useState, useEffect } from "react";
import "./style.css";
import MobHeader from "../header/MobHeader";
import MobileModal from "../menu/MobileModal";
import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import PdfGenerator from "./PdfGenerator";

import { Link } from "react-router-dom";
import BASEURL from "../../data/baseurl";

import { ThreeCircles } from "react-loader-spinner";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";
// import { PDFDownloadLink } from "@react-pdf/renderer";

const AddVolunteer = () => {
  const { isMobModalOpen, closeMobModal } = useContext(sharedContext);

  const [atsList, setAtsList] = useState("");

  const token = localStorage.getItem("accessToken");

  const getPollingBooths = async (assembly, taluka) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${BASEURL.url}/auth/getBoothsByAT?assembly=${assembly}&taluka=${taluka}`,
        requestOptions
      );
      const data = await response.json();
      const pollingBoothsData = data.data.booths;

      return pollingBoothsData;
    } catch (error) {
      console.log("error", error);
    }
  };

  const getBoothDetailsByATB = async (assembly, taluka, booth) => {
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

      return boothData;
    } catch (error) {
      console.log("error", error);
    }
  };

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

  const downloadPDF = async (atsList) => {
    try {
      const zip = new JSZip();
      const mainFolder = zip.folder("Assemblies");

      for (const [key, value] of Object.entries(atsList)) {
        for (let i = 0; i < Object.keys(atsList).length; i++) {
          if (value[i].status !== "RED") {
            const pollingBooths = await getPollingBooths(key, value[i].taluka);

            const AssemblyFolder = mainFolder.folder(key);

            for (let j = 0; j < pollingBooths.length; j++) {
              // Declare `i` properly
              if (pollingBooths[j].status !== "RED") {
                console.log(key, value[i].taluka, pollingBooths[j].boothName);
                // Assuming `getBoothDetailsByATB` is asynchronous and returns a promise
                const volunteerData = await getBoothDetailsByATB(
                  key,
                  value[i].taluka,
                  pollingBooths[j].boothName
                );

                const BoothFolder = AssemblyFolder.folder(
                  pollingBooths[j].boothName
                );
                for (const [key, value] of Object.entries(volunteerData)) {
                  if (
                    typeof value === "object" &&
                    value !== null &&
                    key !== "volunteers"
                  ) {
                    if (value.photo_url) {
                      value.photo_url = await convertImageToBase64(
                        value.photo_url
                      );
                    }

                    const doc = <PdfGenerator volunteerData={value} />;
                    const asPdf = pdf([]);
                    asPdf.updateContainer(doc);
                    const blob = await asPdf.toBlob();
                    BoothFolder.file(`${key}.pdf`, blob, { binary: true });
                  }
                }

                if (
                  volunteerData.volunteers &&
                  Array.isArray(volunteerData.volunteers)
                ) {
                  const volunteersFolder = BoothFolder.folder("volunteers");
                  let counter = 1;
                  for (const volunteer of volunteerData.volunteers) {
                    if (volunteer.photo_url) {
                      volunteer.photo_url = await convertImageToBase64(
                        volunteer.photo_url
                      );
                    }
                    const doc = <PdfGenerator volunteerData={volunteer} />;
                    const asPdf = pdf([]);
                    asPdf.updateContainer(doc);
                    const blob = await asPdf.toBlob();
                    volunteersFolder.file(`volunteer${counter}.pdf`, blob, {
                      binary: true,
                    });
                    counter++;
                  }
                }
              }
            }
          }
        }
      }

      // Generate the ZIP file and trigger the download, use a generic name or derive from a valid variable
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "documents.zip"); // Changed to a generic name
    } catch (error) {
      console.error("An error occurred while generating the PDF/ZIP:", error);
    }
  };

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
            onClick={() => downloadPDF(atsList)}
          >
            Download
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
