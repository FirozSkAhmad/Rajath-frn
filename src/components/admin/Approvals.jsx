import React, { useState, useEffect } from 'react';
import MobHeader from "../header/MobHeader";
// import { useMobHeaderContext } from '../../context/MobHeader';
import MobileModal from '../menu/MobileModal';

import BASEURL from '../../data/baseurl';
import "./approval.css";
import ApprovalCustomModal from './ApprovalCustomModal';

import { ThreeCircles } from 'react-loader-spinner';

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";

const Approvals = () => {
    const { isMobModalOpen, closeMobModal } = useContext(sharedContext);

    const [userList, setUserList] = useState(null);

    const [selectedItem, setSelectedItem] = useState(null);
    const [serialNumber, setSerialNumber] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);


    // Function to handle input change and update filtered items
    const handleInputChange = (e) => {
        e.preventDefault();
    };


    const token = localStorage.getItem("accessToken");
    // console.log(token);

    const fetchUserList = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        try {
            const response = await fetch(`${BASEURL.url}/admin/getUsersList`, requestOptions);
            const data = await response.json();
            console.log("users", data);
            const users = data.data;
            setUserList(users);
            // handleUserList(users);
            // console.log(users)
        } catch (error) {
            console.log('error', error);
        }
    }


    const handleUserList = (data) => {
        if (data) {
            return data.map((item, index) => {
                const createdAtDate = new Date(item.createdAt);
                const serialNumber = index + 1;
                return (
                    <tr className='' key={item.id}>
                        <td className=''>{item.user_name}</td>
                        <td>{createdAtDate.toLocaleDateString()}</td>
                        <td>{item.phn_no}</td>
                        <td className=''>
                            <div className='sh_btn' >
                                <button type="button" class="btn"
                                    // data-bs-toggle="modal"
                                    //  data-bs-target={`#${item.user_name}`}
                                    data-bs-target="#exampleModal"
                                    onClick={() => handleViewDetails(item, serialNumber)}
                                >
                                    <i className="fa-solid fa-eye"></i>
                                </button>
                            </div>

                        </td>
                    </tr>
                )
            })
        }
    }

    // const handleViewDetails = (data, serialNumber) => {
    //     setSelectedItem({ ...data, serialNumber });
    // };

    const handleViewDetails = (data) => {
        setModalData(data);
        setIsModalOpen(true);
    };

    // const closeModal = () => {
    //     setSelectedItem(null);
    // };








    useEffect(() => {
        fetchUserList();
    }, [])

    return (
        <>
            <div className='pg__Wrap'>
                <MobHeader></MobHeader>
                <div className='approval__Sec'>
                    <div className='app_Row1'>
                        <div className='app_fl-dt'>
                            <div className='input-group'>
                                <span className="input-group-text sc-icn" id="basic-addon1">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </span>
                                <input
                                    type='date'
                                    className="form-control"
                                    list="datalistOptions"
                                    id="exampleDataList"
                                    placeholder="Type to search..." />
                            </div>
                        </div>
                        <div className='app_ref-btn'>
                            <button className='btn' onClick={() => fetchUserList(userList)}>
                                <i className="fa-solid fa-rotate-right"></i>
                            </button>
                        </div>
                    </div>
                    <div className='app_Table'>
                        <table className="table align-middle">
                            <thead className='align-middle table-primary'>
                                <tr className='align-middle'>
                                    <th scope="col">Surveyor</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Phone no</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle">
                                {userList === null ? (
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
                                    </>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
            <MobileModal isOpen={isMobModalOpen} onClose={closeMobModal}></MobileModal>
            <ApprovalCustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={modalData}
            ></ApprovalCustomModal>

            {/* <div className="modal fade app_m-modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    {selectedItem && (

                        <div className="modal-content">
                            <div className="modal-header">
                                <span className='ad_si-no'>{selectedItem?.serialNumber}</span>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className='ad_M-cnt'>
                                    <div className='ad_lst'>
                                        <span>Surveyor Name: {selectedItem?.user_name}</span>
                                    </div>
                                    <div className='ad_lst'>
                                        <span>Date: {new Date(selectedItem?.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className='ad_lst'>
                                        <span>Phone no: {selectedItem.phn_no}</span>
                                    </div>
                                    <div className='ad_lst'>
                                        <span>Address: {selectedItem.address}</span>
                                    </div>
                                    <div className='app_btn'>
                                        <button className='btn btn-success' onClick={handleAccept}>Accept</button>&nbsp;
                                        <button className='btn btn-danger' onClick={handleReject}>Reject</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div> */}


            {/* <span>Date: {new Date(selectedItem.createdAt).toLocaleDateString()}</span> */}


        </>
    )
}

export default Approvals