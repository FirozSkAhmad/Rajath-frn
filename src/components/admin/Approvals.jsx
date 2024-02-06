import React, { useState, useEffect } from "react";
import MobHeader from "../header/MobHeader";
// import { useMobHeaderContext } from '../../context/MobHeader';
import MobileModal from "../menu/MobileModal";

import BASEURL from "../../data/baseurl";
import "./approval.css";
import ApprovalCustomModal from "./ApprovalCustomModal";

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";
import Loader from "../Loader";

const Approvals = () => {
  const { isMobModalOpen, closeMobModal, setLoader } =
    useContext(sharedContext);

  const [userList, setUserList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const token = localStorage.getItem("accessToken");

  const fetchUserList = async () => {
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
        `${BASEURL.url}/admin/getUsersList`,
        requestOptions
      );
      const data = await response.json();
      console.log("users", data);
      const users = data.data;
      setUserList(users);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log("error", error);
    }
  };

  const handleViewDetails = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <>
      <Loader />
      <div className="pg__Wrap">
        <MobHeader></MobHeader>
        <div className="approval__Sec">
          <div className="app_Row1">
            <div className="app_fl-dt">
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
                />
              </div>
            </div>
            <div className="app_ref-btn">
              <button className="btn" onClick={() => fetchUserList(userList)}>
                <i className="fa-solid fa-rotate-right"></i>
              </button>
            </div>
          </div>
          <div className="app_Table">
            <table className="table align-middle">
              <thead className="align-middle table-primary">
                <tr className="align-middle">
                  <th scope="col">Surveyor</th>
                  <th scope="col">Date</th>
                  <th scope="col">Phone no</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {Array.isArray(userList) && userList.length > 0 ? (
                  userList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.surveyor_name}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>{item.phn_no}</td>
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
                    <td colSpan="4">No data exits that need to be approved.</td>
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
      <ApprovalCustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
      ></ApprovalCustomModal>
    </>
  );
};

export default Approvals;
