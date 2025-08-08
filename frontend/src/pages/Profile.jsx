import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { UserContent } from '../context/UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Profile = () => {

  const navigate = useNavigate();
   
  const { userData,backendUrl, setUserData, setIsLoggedin } = useContext(UserContent)

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/auth/api/logout");
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/auth/api/send-verify-otp"
      );
      if (data.success) {
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return (
    <>
   {userData ? (
        <div className="w-11 h-11 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-19 text-black rounded pt-10">
            <ul className="list-none m-1 py-5 px-3 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer font-semibold"
                >
                  Verify email
                </li>
              )}
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10 font-semibold"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div>login</div>
      )}
      </>
  )
}

export default Profile