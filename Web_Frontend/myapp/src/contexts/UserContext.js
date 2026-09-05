import React,{createContext,useEffect,useState} from "react";
import {authApi,endpoints} from "../utils/api";

export const UserContext=createContext();

export const UserProvider=({children})=>{
  const [currentUser,setCurrentUser]=useState(null);
  const [loading,setLoading]=useState(true);

  const loadUser=async()=>{
    const token=localStorage.getItem("access-token");

    if(!token){
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try{
      setLoading(true);

      const response=await authApi(token).get(
        endpoints.currentUser
      );

      setCurrentUser(response.data.result);
    }catch(error){
      console.error("Load user error:",error);

      setCurrentUser(null);

      if(error.response?.status===401){
        localStorage.removeItem("access-token");
      }
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    loadUser();
  },[]);

  return(
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loadUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};