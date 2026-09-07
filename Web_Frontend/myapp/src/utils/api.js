import axios from "axios";

const BASE_URL="https://interhub1611.onrender.com/api";

const api=axios.create({
  baseURL:BASE_URL,
  withCredentials:true,
});

export const endpoints={
  // Auth
  login:"/auth/login",
  register:"/auth/register",
  refresh:"/auth/refresh",

  // Employer
  employer:"/employer",
  employerReview:(employerId)=>`/employer/${employerId}/reviews`,
  employerDetails:(employerId)=>`/employer/${employerId}`,
  employerJobs:(employerId)=>`/employer/${employerId}/jobs`,
  employerStudentApproved:"/employer/student-apply/approved",
  employerStudentRejected:"/employer/student-apply/reject",

  // Employer Job
  employerJob:"/employer/jobs",
  employerDeleteJob:(jobId)=>`/employer/jobs/${jobId}`,

  // Student
  student:"/students",

  // User
  currentUser:"/auth/me",
  updateUser:"/update-profile",

  // Jobs
  jobs:"/jobs",
  searchJobs:"/jobs/search",
  jobDetail:(jobId)=>`/jobs/${jobId}`,
  jobReview:(jobId)=>`/jobs/${jobId}/reviews`,
  deleteJob:(jobId)=>`/employer/jobs/${jobId}`,
  closeJob:(jobId)=>`/employer/jobs/${jobId}/close`,

  // Student Applications
  applyJob:(jobId)=>`/jobs/${jobId}/apply`,
  myapplications:"/student/applications",
  deleteApplication:(applicationId)=>`/student/applications/${applicationId}`,

  // CV
  sendCv:"/student/cvs",
  myCvs:"/student/cvs",
  myCv:(cvId)=>`/student/cvs/${cvId}`,

  // Follow
  followed:"/student/follows",
  followEmployer:(employerId)=>`/student/follows/${employerId}`,

  // Employer Application
  listapply:(jobId)=>`/employer/jobs/${jobId}/applications`,
  approveApplication:(applicationId)=>`/employer/application/${applicationId}/approve`,
  rejectApplication:(applicationId)=>`/employer/application/${applicationId}/reject`,

  // Invitation
  invitation:(jobId)=>`/employer/job-invitations/${jobId}`,
  employerInvitation:"/employer/job-invitations",
  acceptInvitation:(invitationId)=>`/student/job-invitations/${invitationId}/accept`,
  rejectInvitation:(invitationId)=>`/student/job-invitations/${invitationId}/reject`,

  // Lecturer
  lecturer:"/lecturer/students",

  // Lecturer CV
  lecturerCv:"/lecturer/cvs",
  lecturerCvApproved:(cvId)=>`/lecturer/cvs/${cvId}/approved`,
  lecturerCvRejected:(cvId)=>`/lecturer/cvs/${cvId}/rejected`,

  // CV Suggested
  suggestedCv:"/cvs-suggested",

  // Student Invitations
  myinvitations:"/student/job-invitations",
  studentAccept:(invitationId)=>`/student/job-invitations/${invitationId}/accept`,
  studentReject:(invitationId)=>`/student/job-invitations/${invitationId}/reject`,
  //AI
  generateCv:"/ai/generate-cv",
  cvScore:"/ai/cv/score",
};

let refreshPromise=null;

export const authApi=(token)=>{
  const instance=axios.create({
    baseURL:BASE_URL,
    withCredentials:true,
    headers:{
      Authorization:`Bearer ${token}`,
    },
  });

  instance.interceptors.request.use(
    (config)=>{
      const currentToken=localStorage.getItem("access-token");

      if(currentToken){
        config.headers.Authorization=`Bearer ${currentToken}`;
      }

      return config;
    },
    (error)=>Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response)=>response,
    async(error)=>{
      const originalRequest=error.config;
      if(
        error.response?.status!==401||
        originalRequest?._retry
      ){
        return Promise.reject(error);
      }
      originalRequest._retry=true;
      try{
        if(!refreshPromise){
          refreshPromise=api.post(endpoints.refresh);
        }
        const refreshResponse=await refreshPromise;
        const newToken=
          refreshResponse.data?.result?.accessToken;
        if(!newToken){
          throw new Error("Không nhận được access token mới");
        }
        localStorage.setItem("accessToken",newToken);
        originalRequest.headers=
          originalRequest.headers||{};
        originalRequest.headers.Authorization=
          `Bearer ${newToken}`;
        return instance(originalRequest);
      }catch(refreshError){
        localStorage.removeItem("accessToken");
        window.location.href="/login";
        return Promise.reject(refreshError);
      }finally{
        refreshPromise=null;
      }
    }
  );

  return instance;
};

export default api;