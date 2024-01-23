import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Routing from "./Routing";
// import Surveyor from './components/surveyor/Surveyor';
import Admin from './components/admin/Admin';
import { MobHeaderProvider } from './context/MobHeader';
import Approvals from './components/admin/Approvals';
import History from './components/admin/History';
import Surveyor from './components/surveyor/Surveyor';
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import SurHistory from './components/surveyor/SurHistory';
import PollingBooth from './components/surveyor/PollingBooth';
import BoothAddress from './components/surveyor/BoothAddress';
import OnBoard from './components/surveyor/OnBoard';
function App() {

  return (
    <>
      <MobHeaderProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Routing />} />
            <Route index element={<Login />} />
            <Route path="admin/dashboard" element={<Admin />} />
            <Route path="admin/approvals" element={<Approvals />} />
            <Route path="admin/history" element={<History />} />
            <Route path="surveyor/dashboard" element={<Surveyor />} />
            <Route path="surveyor/history" element={<SurHistory />} />
            <Route path="polling-booths" element={<PollingBooth />} />
            <Route path="booth-address" element={<BoothAddress />} />
            <Route path="onboard/:designation" element={<OnBoard />} />
            {/* <Route path="login" element={<Login />} /> */}
            <Route path="signup" element={<Signup />} />
            {/* <Route path="post" element={<Post />} />
          <Route path="post/:topic" element={<PostDetails />} />
          <Route path="profile" element={<Profile />} /> */}
            <Route />
          </Routes>
        </BrowserRouter>
      </MobHeaderProvider>
    </>
  )
}

export default App
