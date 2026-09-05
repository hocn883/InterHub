import {useContext} from "react";
import {Navigate,Outlet} from "react-router-dom";
import {UserContext} from "../contexts/UserContext";

function ProtectedRoute(){
  const {currentUser,loading}=useContext(UserContext);

  if(loading){
    return null;
  }

  if(!currentUser){
    return <Navigate to="/login" replace/>;
  }

  return <Outlet/>;
}

export default ProtectedRoute;