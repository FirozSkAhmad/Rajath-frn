import React, { useState, useEffect } from "react";
import "./pollingBooth.css";
import MobHeader from "../header/MobHeader";
import MobileModal from "../menu/MobileModal";
import { pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import PdfGenerator from "../admin/PdfGenerator";

import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import BASEURL from "../../data/baseurl";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";
import Loader from "../Loader";

const PollingBooth = () => {
  const { isMobModalOpen, closeMobModal, setLoader } =
    useContext(sharedContext);

  let [searchParams] = useSearchParams();

  const [pollingBooths, setPollingBooths] = useState("");
  const [totalBooths, setTotalBooths] = useState("");
  const [boothStatusCount, setBoothStatusCount] = useState("");

  const [buttonText, setButtonText] = useState("Download");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Token
  const token = localStorage.getItem("accessToken");

  const role_type = localStorage.getItem("role_type");

  // queryParam
  const assembly = searchParams.get("assembly");
  const taluka = searchParams.get("taluka");

  const getBoothDetailsByATB = async (booth) => {
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

  const downloadPDF = async (pollingBooths) => {
    try {
      setButtonText("Downloading..."); // Change button text to 'Downloading...'
      setIsButtonDisabled(true); // Disable button
      const zip = new JSZip();
      const mainFolder = zip.folder("Booths");

      for (let i = 0; i < pollingBooths.length; i++) {
        // Declare `i` properly
        if (pollingBooths[i].status !== "RED") {
          // Assuming `getBoothDetailsByATB` is asynchronous and returns a promise
          const volunteerData = await getBoothDetailsByATB(
            pollingBooths[i].boothName
          );

          const BoothFolder = mainFolder.folder(pollingBooths[i].boothName);
          for (const [key, value] of Object.entries(volunteerData)) {
            if (
              typeof value === "object" &&
              value !== null &&
              key !== "volunteers"
            ) {
              if (value.photo_url) {
                value.img_url = await convertImageToBase64(value.photo_url);
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
                volunteer.img_url = await convertImageToBase64(
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

      // Generate the ZIP file and trigger the download, use a generic name or derive from a valid variable
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "documents.zip"); // Changed to a generic name
      setButtonText("Download"); // Reset button text to 'Download'
      setIsButtonDisabled(false); // Enable button
    } catch (error) {
      console.error("An error occurred while generating the PDF/ZIP:", error);
    }
  };

  function countStatus(objects) {
    let statusCount = {
      RED: 0,
      YELLOW: 0,
      GREEN: 0,
    };

    // Iterate through each object in the array
    objects.forEach((obj) => {
      // Increment the count for the corresponding status
      if (obj.status === "RED") {
        statusCount.RED += 1;
      } else if (obj.status === "YELLOW") {
        statusCount.YELLOW += 1;
      } else if (obj.status === "GREEN") {
        statusCount.GREEN += 1;
      }
    });

    return statusCount;
  }

  useEffect(() => {
    const getPollingBooths = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        setLoader(true);
        const response = await fetch(
          `${BASEURL.url}/auth/getBoothsByAT?assembly=${assembly}&taluka=${taluka}`,
          requestOptions
        );
        const data = await response.json();
        const pollingBoothsData = data.data.booths;
        const boothStatusCount = countStatus(pollingBoothsData);
        const totalBooths = pollingBoothsData.length;
        setPollingBooths(pollingBoothsData);
        setBoothStatusCount(boothStatusCount);
        setTotalBooths(totalBooths);
        setLoader(false);
      } catch (error) {
        console.log("error", error);
        setLoader(false);
      }
    };
    getPollingBooths();
  }, []);

  const veiwPollingBooths = (data) => {
    if (!data) {
      // return <div>Data is loading...</div>;
      return <Loader />;
    }

    return (
      <ul>
        {data.length > 0 ? (
          data.map((item, index) => (
            <li key={index}>
              <Link
                to={`/booth-address?assembly=${assembly}&taluka=${taluka}&booth=${item.boothName}`}
              >
                {item.boothName}
              </Link>
              {renderStatusIcon(item.status)}
            </li>
          ))
        ) : (
          <li>Data is loading...</li>
        )}
      </ul>
    );
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
      <Loader />
      <div className="pg__Wrap">
        <MobHeader></MobHeader>
        {role_type === "SUPER ADMIN" ? (
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
              onClick={() => downloadPDF(pollingBooths)}
              disabled={isButtonDisabled}
            >
              {buttonText}
            </button>
          </div>
        ) : (
          null
        )}
        <div className="pl_Bth-sec">
          <div className="pl_booths-info">
            <div className="pl-bt-in-row1">
              <span>List of Polling booths in {taluka}</span>
            </div>
            <div className="pl-bt-in-row2">
              <span>No of poling booths - {totalBooths}</span>
            </div>
            <div className="pl-bt-in-row3">
              <div className="pl_bths-sts-m">
                <span>poling booths status</span>
              </div>
              <div className="pl_Rem-sec">
                <div className="pl-remark_sec pl-remark_sec-g">
                  <span className="sr-red">
                    <i className="fa-solid fa-xmark"></i>
                  </span>
                  <span>{boothStatusCount.RED}</span>
                </div>
                <div className="pl-remark_sec pl-remark_sec-y">
                  <span className="sr-yellow">
                    <i className="fa-solid fa-check"></i>
                  </span>
                  <span>{boothStatusCount.YELLOW}</span>
                </div>
                <div className="pl-remark_sec pl-remark_sec-r">
                  <span className="sr-green">
                    <i className="fa-solid fa-check"></i>
                  </span>
                  <span>{boothStatusCount.GREEN}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pl_Booths-table">
            <div className="pl_booths-ttl">
              <div className="pl_Bt-nm">
                <span>Booth</span>
              </div>
              <div className="pl_Bt-sts">
                <span>Status</span>
              </div>
            </div>
            <div className="pl__Bt-data-lst">
              <ul>{veiwPollingBooths(pollingBooths)}</ul>
            </div>
          </div>
        </div>
        <div className="sr_back-btn">
          <Link to="/surveyor/dashboard">Back</Link>
        </div>
      </div>
      <MobileModal
        isOpen={isMobModalOpen}
        onClose={closeMobModal}
      ></MobileModal>
    </>
  );
};

export default PollingBooth;
