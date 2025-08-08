import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";
import { UserContent } from "../context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets";

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(UserContent);

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
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center sm:px-15 absolute top-0">
      <div className="flex items-center gap-2 sm:gap-2 ">
        <img src={assets.logo} alt="" className="w-13 sm:w-15 sm:pt-2" />
        <span className=" text-gray-800 font-semibold sm:text-3xl text-2xl pt-3">
          MiChat
        </span>
      </div>

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
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 mt-4 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default NavBar;
