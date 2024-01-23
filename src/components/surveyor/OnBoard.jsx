import React, { useState, useEffect } from 'react';
import "./volunteerOnBoard.css";
import MobHeader from "../header/MobHeader";
import MobileModal from '../menu/MobileModal';
import { useMobHeaderContext } from '../../context/MobHeader';

import { useParams, useSearchParams } from 'react-router-dom';

import { Link } from 'react-router-dom';

const OnBoard = () => {
    const { isMobModalOpen, closeMobModal } = useMobHeaderContext();

    let params = useParams();
    let [searchParams] = useSearchParams();

    // Token
    const token = localStorage.getItem("accessToken");
    const surveyorId = localStorage.getItem("surveyor_id");


    // queryParam
    const assemblyFromQuery = searchParams.get('assembly');
    const talukaFromQuery = searchParams.get('taluka');
    const boothFromQuery = searchParams.get('booth');
    const boothAddressFromQuery = searchParams.get('boothAddress');
    const designation = params.designation;

    // Form data
    const [formData, setFormData] = useState({
        designation,
        assembly: assemblyFromQuery || '', // Prefilled data from query parameters
        taluka: talukaFromQuery || '', // Prefilled data from query parameters
        booth: boothFromQuery || '', // Prefilled data from query parameters
        booth_address: boothAddressFromQuery || '', // Prefilled data from query parameters
        volunteer_name: '',
        phn_no: '',
        emailId: '',
        gender: '',
        volunteer_address: '',
        age: '',
        caste: '',
        occupation: '',
        profileImage: null,
        // Other form fields...
    });

    useEffect(() => {
        // Use the parsed query parameters to prefill the form fields
        // This effect will run whenever the URL or query parameters change
        setFormData(prevData => ({
            ...prevData,
            assembly: assemblyFromQuery || '',
            booth: boothFromQuery || '',
        }));
    }, [assemblyFromQuery, talukaFromQuery, boothFromQuery, boothAddressFromQuery]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, profileImage: file });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement your logic for form submission
        console.log('Form data submitted:', formData);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var formdata = new FormData();
        formdata.append("surveyor_id", surveyorId);
        formdata.append("assembly", formData.assembly);
        formdata.append("taluka", formData.taluka);
        formdata.append("booth", formData.booth);
        formdata.append("booth_address", formData.booth_address);
        formdata.append("volunteer_name", formData.volunteer_name);
        formdata.append("phn_no", formData.phn_no);
        formdata.append("emailId", formData.emailId);
        formdata.append("gender", formData.gender);
        formdata.append("age", formData.age);
        formdata.append("caste", formData.caste);
        formdata.append("occupation", formData.occupation);
        formdata.append("volunteer_address", formData.volunteer_address);
        formdata.append("designation", formData.designation);
        formdata.append("profileImage", formData.profileImage);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://13.235.80.103:5200/auth/volunteerOnboard", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    };


    const clearForm = () => {
        setFormData({
            designation,
            assembly: assemblyFromQuery || '', // Prefilled data from query parameters
            taluka: talukaFromQuery || '', // Prefilled data from query parameters
            booth: boothFromQuery || '', // Prefilled data from query parameters
            booth_address: boothAddressFromQuery || '', // Prefilled data from query parameters
            volunteer_name: '',
            phn_no: '',
            emailId: '',
            gender: '',
            volunteer_address: '',
            age: '',
            caste: '',
            occupation: '',
            profileImage: null,
        })
    }


    return (
        <>
            <div className='pg__Wrap'>
                <MobHeader></MobHeader>
                <div className='on__Board-sec'>
                    <div className='on_Board-form'>
                        <form onSubmit={handleSubmit}>
                            <div className='onBoard_cnt'>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Assembly
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="assembly"
                                            value={formData.assembly}
                                            readonly
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Thaluka
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="taluka"
                                            value={formData.taluka}
                                            readonly
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Booth
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="booth"
                                            value={formData.booth}
                                            readonly
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Booth Address
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="booth_address"
                                            value={formData.booth_address}
                                            readonly
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Volunteer Name*
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="volunteer_name"
                                            value={formData.volunteer_name}
                                            onChange={handleChange}
                                            autoComplete="off"
                                            required
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Phone No*
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type='tel'
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="phn_no"
                                            value={formData.phn_no}
                                            onChange={handleChange}
                                            autoComplete="off"
                                            required
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Email ID
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type='email'
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="emailId"
                                            value={formData.emailId}
                                            onChange={handleChange}
                                            autoComplete="off"
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Gender*
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <select
                                            class="form-select"
                                            // aria-label="Default select example"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHERS">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Address*
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="volunteer_address"
                                            value={formData.volunteer_address}
                                            onChange={handleChange}
                                            autoComplete="off"
                                            required
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Age*
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            autoComplete="off"
                                            required
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Caste*
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="caste"
                                            value={formData.caste}
                                            onChange={handleChange}
                                            autoComplete="off"
                                            required
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Occupation
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="occupation"
                                            value={formData.occupation}
                                            onChange={handleChange}
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Designation*
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="text"
                                            class="form-control"
                                            id=""
                                            aria-describedby=""
                                            name="designation"
                                            value={formData.designation}
                                            readonly
                                        ></input>
                                    </div>
                                </div>
                                <div className='onBoard_input-box'>
                                    <span className='onBoard_inp-n'>
                                        Upload Image
                                    </span>
                                    <div className='onBoard_inp-fld'>
                                        <input
                                            type="file"
                                            class="form-control"
                                            id=""
                                            name="profileImage"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                                <div className='sur_vl-btn'>
                                    <button type="button" class="btn btn-secondary" onClick={clearForm}>Clear</button>&nbsp;&nbsp;&nbsp;
                                    <button type="submit" class="btn btn-success">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='sr_back-btn'>
                    <Link to={`/booth-address?assembly=${assemblyFromQuery}&taluka=${talukaFromQuery}&booth=${boothFromQuery}`}>Back</Link>
                </div>

            </div>
            <MobileModal isOpen={isMobModalOpen} onClose={closeMobModal}></MobileModal>
        </>
    )
}

export default OnBoard;