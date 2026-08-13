import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './screens/Home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import JobDetailScreen from './screens/Home/JobDetails/JobDetailScreen'
import CompanyDetails from './screens/Home/CompaniesDetails/CompanyDetails'
import Login from './screens/Auth/Login'
import Register from './screens/Auth/Register'
import MainLayout from './Layout/MainLayout'
import MyApplications from './screens/Student/MyApplications/MyApplications'
import FollowedCompanies from './screens/Student/FollowedCompanies/FollowedCompanies'
import MyCv from './screens/Student/MyCV/MyCv'
import Profile from './screens/profiles/profile'
import LecturerStudents from './screens/Lecturer/LecturerStudents/LecturerStudents'
import LecturerCvs from './screens/Lecturer/LecturerCvs/LecturerCvs'
import CreateJob from './screens/Employer/PostJob/CreateJob'
import EmployerJobs from './screens/Employer/EmployerJobs/EmployerJobs'

function App() {
  const currentUser = {
    fullName: 'Nguyễn Thái Học',
    role: 'STUDENT',
    avatarUrl: '',
  }

  return (
    <div
      className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/1" element={<JobDetailScreen />} />
            <Route path="/companies/1" element={<CompanyDetails />} />
            <Route path="/myapplications" element={<MyApplications />} />
            <Route path="/followedcompanies" element={<FollowedCompanies />} />
            <Route path="/myCv" element={<MyCv />} />
            <Route path="lecturer/students" element={<LecturerStudents />} />
            <Route path="lecturer/cvs" element={<LecturerCvs/>} />
            <Route path="employer/jobs" element={<EmployerJobs/>} />
            <Route path="employer/applications" element={<CreateJob/>} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <Profile currentUser={currentUser} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App