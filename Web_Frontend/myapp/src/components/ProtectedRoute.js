import { Navigate, Outlet } from "react-router-dom";
function ProtectedRoute({ currentUser}) 
{
  if (!currentUser) 
  {
    return <Navigate to="/login" replace/>;
  }
  return <Outlet/>;
}
export default ProtectedRoute;