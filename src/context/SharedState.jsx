import React, { useState, useEffect } from 'react'
import SharedContext from './SharedContext'

const SharedState = (props) => {

    const [volunteerData, setVolunteerData] = useState("");

    const [isMobModalOpen, setIsMobModalOpen] = useState(false);

    const openMobModal = () => {
        setIsMobModalOpen(true);
    };

    const closeMobModal = () => {
        setIsMobModalOpen(false);
    };


    return (
        <SharedContext.Provider value={{ volunteerData, setVolunteerData, isMobModalOpen, openMobModal, closeMobModal }}>{
            props.children
        }</SharedContext.Provider>
    )
}

export default SharedState