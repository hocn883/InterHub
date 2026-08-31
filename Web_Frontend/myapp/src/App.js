import "./App.css";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import { useContext } from "react";
import MainLayout from "./Layout/MainLayout";
import Home from "./screens/Home/Home";
import Login from "./screens/Auth/Login/Login";
import Register from "./screens/Auth/Register/Register";
import JobDetailScreen from "./screens/Home/JobDetails/JobDetailScreen";
import CompanyDetails from "./screens/Home/CompaniesDetails/CompanyDetails";
import MyApplications from "./screens/Student/MyApplications/MyApplications";
import FollowedCompanies from "./screens/Student/FollowedCompanies/FollowedCompanies";
import MyCv from "./screens/Student/MyCV/MyCv";
import CvTemplate from "./screens/Student/MyCV/CvTemplate/CvTemplate";
import CvScoring from "./screens/Student/MyCV/CvScoring/CvScoring";
import LecturerStudents from "./screens/Lecturer/LecturerStudents/LecturerStudents";
import LecturerCvs from "./screens/Lecturer/LecturerCvs/LecturerCvs";
import CreateJob from "./screens/Employer/PostJob/CreateJob";
import EmployerJobs from "./screens/Employer/EmployerJobs/EmployerJobs";
import MyApplyJob from "./screens/Employer/MyApplyJob/MyApplyJob";
import Profile from "./screens/profiles/profile";
import ProtectedRoute from "./components/ProtectedRoute";
import SendCv from "./screens/Student/MyCV/SendCv/SendCv";
import SuggestedCv from "./screens/Employer/SuggestedCv/SuggestedCv";
import EmployerInvite from "./screens/Employer/SuggestedCv/EmployerInvite/EmployerInvite";
import ReviewJob from "./screens/Student/MyApplications/ReviewJob/ReviewJob";
import MyInvitations from "./screens/Student/Invitations/MyInvitations";
import Applications   from "./screens/Student/Applications/Applications";
import EmployerInvitations from "./screens/Employer/EmployerInvitations/EmployerInvitations";
import EmployerInvitationDetails from "./screens/Employer/EmployerInvitations/EmployerInvitationDetails/EmployerInvitationDetails";
function App() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute currentUser={currentUser} />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/myinvitations" element={<MyInvitations />} />
            <Route path="/jobs/:jobId" element={<JobDetailScreen />} />
            <Route path="/myapplications" element={<MyApplications />} />
            <Route path="/followedcompanies" element={<FollowedCompanies />} />
            <Route path="/myCv" element={<MyCv />} />
            <Route path="/lecturer/students" element={<LecturerStudents />} />
            <Route path="/lecturer/cvs" element={<LecturerCvs />} />
            <Route path="/employer/invite-cv/:cvId" element={<EmployerInvite />} />
            <Route path="/employer/jobs/:jobId/applications" element={<MyApplyJob />} />
            <Route path="/employer/jobs" element={<EmployerJobs />} />
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/cv/templates" element={<CvTemplate />} />
            <Route path="/cv/scoring" element={<CvScoring />} />
            <Route path="/jobs/:jobId/review" element={<ReviewJob />} />
            <Route path="/companies/:employerId" element={<CompanyDetails />} />
            <Route path="/cv/suggestedCv" element={<SuggestedCv />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} />} />
            <Route path="/mycv/send" element={<SendCv />} />
            <Route path="/jobs/:jobId/apply" element={<Applications />} />
            <Route path="/employer/invitations" element={<EmployerInvitations/>} />
             <Route path="/employer/invitations/:invitationId" element={<EmployerInvitationDetails/>} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;