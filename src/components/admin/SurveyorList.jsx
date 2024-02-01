import React, { useState, useEffect } from 'react';
import MobHeader from "../header/MobHeader";
import { useMobHeaderContext } from '../../context/MobHeader';
import MobileModal from '../menu/MobileModal';

import BASEURL from '../../data/baseurl';
import "./approval.css";
import SurveyorCustomModel from './SurveyorCustomModel';

import { ThreeCircles } from 'react-loader-spinner';

const SurveyorList = () => {
    const { isMobModalOpen, closeMobModal } = useMobHeaderContext();

    const [surveyorList, setSurveyorList] = useState(null);

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
            const response = await fetch(`${BASEURL.url}/admin/getAllSurveyorDetails`, requestOptions);
            const data = await response.json();
            console.log("users", data);
            const surveyors = data.data;
            setSurveyorList(surveyors);
            // handleUserList(users);
            // console.log(users)
        } catch (error) {
            console.log('error', error);
        }
    }

    const handleViewDetails = (data) => {
        setModalData(data);
        setIsModalOpen(true);
    };

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
                                                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
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
            <SurveyorCustomModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={modalData}
                fetchUserList={()=>fetchUserList()}
            ></SurveyorCustomModel>
        </>
    )
}

export default SurveyorList