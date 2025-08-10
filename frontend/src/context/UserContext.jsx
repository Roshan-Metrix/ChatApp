import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify'
import axios from 'axios'

export const UserContent = createContext();

export const UserContentProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = async () => {
        try{
          const {data} = await axios.get(backendUrl + '/api/user/data');
          
         data.success ? setUserData(data.userData) : toast.error(data.message);

        }catch(error){
            toast.error("!Ops You need to login")
        }
    }

   const getAuthState = async () => {
    try{
        const { data } = await axios.get(backendUrl + '/auth/api/is-auth')
        if(data.success){
            setIsLoggedin(true)
            getUserData()
        }
    }catch(error){
        toast.error("!Ops You need to login")
    }
   }

   useEffect(() => {
    getAuthState();
   },[])

    const value = {
        backendUrl,
        isLoggedin,setIsLoggedin,
        setUserData,userData,
        getUserData,
        getAuthState
    }

    return(
        <UserContent.Provider value={value}>
            {props.children}
        </UserContent.Provider>
    )
}