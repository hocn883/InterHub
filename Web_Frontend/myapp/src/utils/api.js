import axios from "axios";
const BASE_URL = "http://localhost:8080/api";
const api = axios.create({
  baseURL: BASE_URL,
});

export const endpoints = {
  // Auth
  login: "/auth/login",
  register: "/auth/register",
  // employer
  employer: "/employer",
  employerReview:(employerId)=> `/employer/${employerId}/reviews`,
  employerDetails: (employerId) => `/employer/${employerId}`,
  employerJobs: (employerId)=>`/employer/${employerId}/jobs`,
  //EmployerJob
  employerJob:"/employer/jobs",
  employerDeleteJob:(jobId) => `/employer/jobs/${jobId}`,
  // User
  currentUser: "/auth/me",
  // Jobs
  jobs: "/jobs",
  jobDetail: (jobId) => `/jobs/${jobId}`,
  jobReview:(jobId) => `/jobs/${jobId}/reviews`,
  // students
  applyJob: (jobId) => `/jobs/${jobId}/apply`,
  myapplications:"/student/applications",
  deleteApplication:(applicationId)=>`/student/applications/${applicationId}`,
  //cv
  sendCv:"/student/cvs",
  myCvs:"/student/cvs",
  myCv:(cvId)=>`/student/cvs/${cvId}`,
  //followe
  followed:"/student/follows",
  followEmployer:(employerId)=>`/student/follows/${employerId}`,
  //employerApplication
  listapply:(jobId)=>`/employer/jobs/${jobId}/applications`,//employer/jobs/
  closeJob:(jobId)=>`/employer/jobs/${jobId}/close`,
  approveApplication:(applicationId) => `/employer/application/${applicationId}/approve`,
  rejectApplication:(applicationId) => `/employer/application/${applicationId}/reject`,
  //Invitation
  invitation:(jobId)=>`/employer/job-invitations/${jobId}`,
  employerInvitation:"/employer/job-invitations",
  acceptInvitation:(invitationId) => `/student/job-invitations/${invitationId}/accept`,
  rejectInvitation:(invitationId) => `/student/job-invitations/${invitationId}/reject`,
  //lecturer
  lecturer:"/lecturer/students",
  //lecturerCv
  lecturerCv:"/lecturer/cvs",
  lecturerCvApproved:(cvId)=>`/lecturer/cvs/${cvId}/approved`,
  lecturerCvRejected:(cvId)=>`/lecturer/cvs/${cvId}/rejected`,
  //CvSuggested
  suggestedCv:"/cvs-suggested",
  //students
  myinvitations:"/student/job-invitations",
  studentAccept:(invitationId) => `/student/job-invitations/${invitationId}/accept`,
  studentReject:(invitationId) => `/student/job-invitations/${invitationId}/reject`,
};
export const authApi = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export default api;