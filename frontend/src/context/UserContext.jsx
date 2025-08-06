import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify'
import axios from 'axios'

export const UserContent = createContext();

export const UserContentProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendUrl ='http://localhost:3000'

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = async () => {
        try{
          const {data} = await axios.get(backendUrl + '/api/user/data');
          
         data.success ? setUserData(data.userData) : toast.error(data.message)

        }catch(error){
            toast.error(error.message)
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
        toast.error(error.message)
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