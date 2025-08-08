import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { UserContent } from "../context/UserContext";
import Profile from "../pages/Profile";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
    const { userData } = useContext(UserContent);

  return (
    //
    <>
      {userData ? (
        <Profile />
      ) : (
        <div className="flex flex-col items-center m-20 px-4 text-center text-black">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 mt-4 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer absolute top-0 right-10"
          >
            Login <img src={assets.arrow_icon} alt="" />
          </button>
          <div className="bg-white w-70 h-66 rounded-full flex justify-center items-center mb-5 overflow-hidden shadow-2xl shadow-gray-200">
            <img
              src={assets.header_img}
              alt=""
              className="w-50 h-52 hover:-scale-x-125 transition duration-700"
            />
          </div>
          <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
            Hey Connector !
            <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
          </h1>

          <h2 className="text-3xl sm:text-5xl  font-semibold mb-4">
            Welcome To Our ChatApp
          </h2>

          <p className="mb-8 max-w-md">
            Explore the features and enjoy a seamless experience with our
            platform!
          </p>

          <button onClick={() => navigate('/login')} className="border border-grey-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all cursor-pointer">
            Get Started
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
