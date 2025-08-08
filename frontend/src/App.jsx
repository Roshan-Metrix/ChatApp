import React from 'react';
import { Routes, Route} from 'react-router-dom'
import EmailVerify from "./pages/EmailVerify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const App = () => {
  return (
      <div>
        <ToastContainer/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/email-verify' element={<EmailVerify/>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
          <Route path='/settings' element={<Settings/>} />
          <Route path='/profile' element={<Profile/>} />
        </Routes>
      </div>
  );
}

export default App;
