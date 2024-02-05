import React, { useState, useEffect } from 'react';
import "./pollingBooth.css";
import MobHeader from "../header/MobHeader";
import MobileModal from '../menu/MobileModal';
// import { useMobHeaderContext } from '../../context/MobHeader';

import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BASEURL from '../../data/baseurl';

import { ThreeCircles } from 'react-loader-spinner';

import sharedContext from "../../context/SharedContext";
import { useContext } from "react";

const PollingBooth = () => {
    const { isMobModalOpen, closeMobModal } = useContext(sharedContext);

    let [searchParams] = useSearchParams();

    const [pollingBooths, setPollingBooths] = useState('');
    const [totalBooths, setTotalBooths] = useState('');


    // Token
    const token = localStorage.getItem("accessToken");

    // queryParam
    const assembly = searchParams.get('assembly');
    const taluka = searchParams.get('taluka');

    useEffect(() => {
        const getPollingBooths = async () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`)
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            try {
                const response = await fetch(`${BASEURL.url}/auth/getBoothsByAT?assembly=${assembly}&taluka=${taluka}`, requestOptions);
                const data = await response.json();
                const pollingBoothsData = data.data.booths;
                const totalBooths = pollingBoothsData.length;
                setPollingBooths(pollingBoothsData);
                setTotalBooths(totalBooths);
            } catch (error) {
                console.log('error', error);
            }
        }
        getPollingBooths()
    }, [])


    const veiwPollingBooths = (data) => {
        if (!data) {
            // return <div>Data is loading...</div>;
            return (<ThreeCircles
                visible={true}
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="three-circles-loading"
                wrapperStyle={{}}
                wrapperClass="loader"
            />)
        }

        return (
            <ul>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <li key={index}>
                            <Link to={`/booth-address?assembly=${assembly}&taluka=${taluka}&booth=${item.boothName}`}>
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
                return <span className='sr-red'><i className="fa-solid fa-xmark"></i></span>;
            case "YELLOW":
                return <span className='sr-yellow'><i className="fa-solid fa-check"></i></span>;
            case "GREEN":
                return <span className='sr-green'><i className="fa-solid fa-check"></i></span>;
            default:
                return null;
        }
    };

    return (
        <>
            <div className='pg__Wrap'>
                <MobHeader></MobHeader>
                <div className='pl_Bth-sec'>


                    <div className='pl_booths-info'>
                        <div className='pl-bt-in-row1'>
                            <span>List of Polling booths in {taluka}</span>
                        </div>
                        <div className='pl-bt-in-row2'>
                            <span>No of poling booths - {totalBooths}</span>
                        </div>
                        <div className='pl-bt-in-row3'>
                            <div className='pl_bths-sts-m'>
                                <span>poling booths status</span>
                            </div>
                            <div className='pl_Rem-sec'>
                                <div className='pl-remark_sec pl-remark_sec-g'>
                                    <i className="fa-solid fa-check"></i>
                                    <span>250</span>
                                </div>
                                <div className='pl-remark_sec pl-remark_sec-y'>
                                    <i className="fa-solid fa-check"></i>
                                    <span>250</span>
                                </div>
                                <div className='pl-remark_sec pl-remark_sec-r'>
                                    <i className="fa-solid fa-xmark"></i>
                                    <span>250</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='pl_Booths-table'>
                        <div className='pl_booths-ttl'>
                            <div className='pl_Bt-nm'>
                                <span>Booth</span>
                            </div>
                            <div className='pl_Bt-sts'>
                                <span>Status</span>
                            </div>
                        </div>
                        <div className='pl__Bt-data-lst'>
                            <ul>
                                {
                                    veiwPollingBooths(pollingBooths)
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='sr_back-btn'>
                    <Link to="/surveyor/dashboard">Back</Link>
                </div>
            </div>
            <MobileModal isOpen={isMobModalOpen} onClose={closeMobModal}></MobileModal>
        </>
    )
}

export default PollingBooth