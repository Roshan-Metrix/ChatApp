import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate('/')} className="w-full flex justify-between items-center sm:px-15 absolute top-0 cursor-pointer">
      <div className="flex items-center gap-2 sm:gap-2 ">
        <img src={assets.logo} alt="" className="w-13 sm:w-15 sm:pt-2" />
        <span className=" text-gray-800 font-semibold sm:text-3xl text-2xl pt-3">
          MiChat
        </span>
      </div>
    </div>
  );
};

export default NavBar;
