import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import AdminDash from './pages/admin/AdminDash';
import AdminNavbar from './components/AdminNavbar';
import ManageUsers from './pages/admin/ManageUsers';
import Settings from './pages/admin/Settings';
import Home from './pages/User/Home';
import About from './pages/User/About';
import ManageFeedback from './pages/admin/ManageFeedback';

import Feedback from './pages/User/Feedback';
import RequestService from './pages/User/RequestService';
import ManageVehicle from './pages/admin/ManageVehicle';
import CustomerDetails from './pages/admin/CustomersDetails';
import RohanVehicles from './pages/admin/RohanVehicles';
import Reports from './pages/admin/Reports';


import EmployDash from './pages/employee/EmployDash';
import EmployNavbar from './components/EmployNavbar';
import ViewFeedback from './pages/employee/ViewFeedback';
import Setting from './pages/employee/Setting';
import Service from './pages/employee/Service';
import JobCard from './pages/employee/JobCard';
import ViewStatus from './pages/User/ViewStatus';
import OnlinePayment from './pages/User/OnlinePayment';
import Invoice from './pages/User/Invoice';
import UserSettings from './pages/User/UserSettings';

function App() {

  return (
    <>
   <BrowserRouter>
   <Routes>
    <Route path='/register' element={<Register />} />
    <Route path='/' element={<Login />} />
    <Route path='/forgot-password' element={<ForgotPassword />} />
    <Route path='/admin/AdminDash' element={<AdminDash/>}/>
    <Route path='/components/AdminNavbar' element={<AdminNavbar/>}/>
    <Route path='/admin/ManageUsers' element={<ManageUsers/>}/>
    <Route path='/admin/settings'element={<Settings />}/>
    <Route path='/User/Home'element={<Home/>}/>
    <Route path='/User/ViewStatus'element={<ViewStatus/>}/>
    <Route path='/User/OnlinePayment'element={<OnlinePayment/>}/>
    <Route path='/User/Invoice'element={<Invoice/>}/>
    <Route path='/User/UserSettings'element={<UserSettings/>}/>
    <Route path='/User/About' element={<About/>}/>

    <Route path='/admin/ManageFeedback'element={<ManageFeedback/>}/>
    <Route path='/User/Feedback'element={<Feedback/>}/>
    <Route path='/User/RequestService'element={<RequestService/>}/>
    <Route path='/admin/ManageVehicle' element={<ManageVehicle/>}/>
    <Route path='/admin/CustomersDetails' element={<CustomerDetails/>}/>
    <Route path='/admin/RohanVehicle' element={<RohanVehicles/>}/>
    <Route path='/admin/ViewFeedback' element={<ViewFeedback/>}/>
    <Route path='/admin/Reports' element={<Reports/>}/>

    <Route path='/employee/EmployDash' element={<EmployDash/>}/>
    <Route path='/components/EmployNavbar' element={<EmployNavbar/>}/>
    <Route path='/employee/Service' element={<Service/>}/>
    <Route path='/employee/JobCard' element={<JobCard/>}/>
    <Route path='/employee/ViewFeedback' element={<ViewFeedback/>}/>
    <Route path='/employee/Setting' element={<Setting/>}/>
    







   </Routes>
   </BrowserRouter>
    </>
  );
}

export default App;
  