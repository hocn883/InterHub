import "./CompanyDetails.css";
import { useContext,useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api,{ authApi,endpoints } from "../../../utils/api";
import { UserContext } from "../../../contexts/UserContext";
import JobCard from "../JobCard/JobCard";
function CompanyDetails() {
  const { currentUser }=useContext(UserContext);
  const { employerId }=useParams();
  const navigate=useNavigate();
  const [company,setCompany]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [follow,setFollow]=useState(false);
  const [followLoading,setFollowLoading]=useState(false);
  const [activeTab,setActiveTab]=useState("JOBS");
  const [jobs,setJobs]=useState([]);
  const [jobLoading,setJobLoading]=useState(false);
  const [jobPage,setJobPage]=useState(0);
  const [jobHasMore,setJobHasMore]=useState(true);
  const [reviews,setReviews]=useState([]);
  const [reviewLoading,setReviewLoading]=useState(false);
  const [reviewPage,setReviewPage]=useState(0);
  const [reviewHasMore,setReviewHasMore]=useState(true);
  const [reviewTotalElements,setReviewTotalElements]=useState(0);
  const [reviewInitialized,setReviewInitialized]=useState(false);

  const loadJobPage=async(pageNumber=0)=>{
    try{
      setJobLoading(true);
      const response=await api.get(
        endpoints.employerJobs(employerId),
        {
          params:{
            page:pageNumber,
            size:5
          }
        }
      );
      const result=response.data?.result;
      const openJobs=(result?.content||[]).filter(
        (job)=>job.status==="OPEN"
      );
      setJobs((prev)=>{
        const ids=new Set(
          prev.map((job)=>job.id)
        );
        return [
          ...prev,
          ...openJobs.filter(
            (job)=>!ids.has(job.id)
          )
        ];
      });
      setJobHasMore(
        typeof result?.last==="boolean"
          ?!result.last
          :pageNumber+1<(result?.totalPages||0)
      );
      return true;
    }catch(error){
      console.error(
        "Load company jobs error:",
        error
      );
      setJobHasMore(false);
      return false;
    }finally{
      setJobLoading(false);
    }
  };

  const loadReviewPage=async(pageNumber=0)=>{
    try{
      setReviewLoading(true);
      const response=await api.get(
        endpoints.employerReview(employerId),
        {
          params:{
            page:pageNumber,
            size:5
          }
        }
      );
      const result=response.data?.result;
      const data=result?.content||[];
      setReviews((prev)=>{
        const ids=new Set(
          prev.map((review)=>review.id)
        );
        return [
          ...prev,
          ...data.filter(
            (review)=>!ids.has(review.id)
          )
        ];
      });
      setReviewTotalElements(
        result?.totalElements||0
      );
      setReviewHasMore(
        typeof result?.last==="boolean"
          ?!result.last
          :pageNumber+1<(result?.totalPages||0)
      );
      return true;
    }catch(error){
      console.error(
        "Load reviews error:",
        error
      );
      setReviewHasMore(false);
      return false;
    }finally{
      setReviewLoading(false);
    }
  };

  useEffect(()=>{
    const loadCompany=async()=>{
      try{
        setLoading(true);
        setError("");
        const response=await api.get(
          endpoints.employerDetails(employerId)
        );
        setCompany(
          response.data?.result||null
        );
      }catch(error){
        console.error(
          "Load company error:",
          error
        );
        setError(
          error.response?.data?.message||
          "Không thể tải thông tin doanh nghiệp."
        );
      }finally{
        setLoading(false);
      }
    };
    if(employerId){
      loadCompany();
    }
  },[employerId]);

  useEffect(()=>{
    setActiveTab("JOBS");
    setJobs([]);
    setJobPage(0);
    setJobHasMore(true);
    setReviews([]);
    setReviewPage(0);
    setReviewHasMore(true);
    setReviewTotalElements(0);
    setReviewInitialized(false);
    if(employerId){
      loadJobPage();
    }
    // eslint-disable-next-line
  },[employerId]);

  useEffect(()=>{
    const checkFollow=async()=>{
      try{
        const token=localStorage.getItem("access-token");
        if(!token){
          setFollow(false);
          return;
        }
        const response=await authApi(token).get(
          endpoints.followEmployer(employerId)
        );
        setFollow(response.data);
      }catch(error){
        console.error(
          "Check follow error:",
          error
        );
        setFollow(false);
      }
    };
    if(employerId&&currentUser?.role==="STUDENT"){
      checkFollow();
    }
  },[employerId,currentUser?.role]);

  const handleFollow=async()=>{
    try{
      setFollowLoading(true);
      const token=localStorage.getItem("access-token");
      await authApi(token).post(
        endpoints.followEmployer(employerId)
      );
      setFollow(true);
    }catch(error){
      console.error(
        "Follow error:",
        error
      );
      alert(
        error.response?.data?.message||
        "Không thể theo dõi doanh nghiệp."
      );
    }finally{
      setFollowLoading(false);
    }
  };

  const handleUnFollow=async()=>{
    try{
      setFollowLoading(true);
      const token=localStorage.getItem("access-token");
      await authApi(token).delete(
        endpoints.followEmployer(employerId)
      );
      setFollow(false);
    }catch(error){
      console.error(
        "Unfollow error:",
        error
      );
      alert(
        error.response?.data?.message||
        "Không thể hủy theo dõi doanh nghiệp."
      );
    }finally{
      setFollowLoading(false);
    }
  };

  const handleOpenChat=async()=>{
    if(!currentUser?.id||!employerId){
      return;
    }
    const token=localStorage.getItem("access-token");
    if(!token){
      return;
    }
    try{
      const response=await authApi(token).post(
        `https://interhub1611.onrender.com/api/chat/rooms/open/${currentUser.id}/${employerId}`
      );
      console.log(
        "OPEN ROOM RESPONSE:",
        response.data
      );
      const data=response.data;
      const roomId=
        typeof data==="object"
          ?data?.roomId??data?.id
          :data;
      if(!roomId){
        console.error(
          "Backend không trả roomId"
        );
        return;
      }
      window.dispatchEvent(
        new CustomEvent(
          "open-chat-room",
          {
            detail:{
              roomId:Number(roomId)
            }
          }
        )
      );
    }catch(error){
      console.error(
        "OPEN CHAT ERROR:",
        error.response?.data||error
      );
      alert(
        error.response?.data?.message||
        "Không thể mở cuộc trò chuyện."
      );
    }
  };

  const handleChangeTab=async(tab)=>{
    setActiveTab(tab);
    if(tab==="REVIEWS"&&!reviewInitialized){
      setReviewInitialized(true);
      const success=await loadReviewPage();
      if(!success){
        setReviewInitialized(false);
      }
    }
  };

  const handleLoadMoreJobs=async()=>{
    if(jobLoading||!jobHasMore){
      return;
    }
    const nextPage=jobPage+1;
    const success=await loadJobPage(nextPage);
    if(success){
      setJobPage(nextPage);
    }
  };

  const handleLoadMoreReviews=async()=>{
    if(reviewLoading||!reviewHasMore){
      return;
    }
    const nextPage=reviewPage+1;
    const success=await loadReviewPage(nextPage);
    if(success){
      setReviewPage(nextPage);
    }
  };

  if(loading){
    return(
      <div className="company-state">
        <div className="company-spinner"></div>
        <p>Đang tải thông tin doanh nghiệp...</p>
      </div>
    );
  }

  if(error||!company){
    return(
      <div className="company-state">
        <h2>Không thể tải thông tin</h2>
        <p>
          {error||"Không tìm thấy doanh nghiệp."}
        </p>
        <button
          type="button"
          onClick={()=>navigate(-1)}
        >
          Quay lại
        </button>
      </div>
    );
  }

  return(
    <div className="company-detail-page">
      <div className="company-detail-container">
        <button
          type="button"
          className="company-back-button"
          onClick={()=>navigate(-1)}
        >
          ← Quay lại
        </button>

        <section className="company-profile-card">
          <div className="company-profile-header">
            <div className="company-logo">
              {company.avatarUrl?(
                <img
                  src={company.avatarUrl}
                  alt={company.companyName}
                />
              ):(
                <span>
                  {company.companyName?.charAt(0).toUpperCase()||"C"}
                </span>
              )}
            </div>

            <div className="company-main-info">
              <div className="company-title">
                <h1>
                  {company.companyName||"Doanh nghiệp"}
                </h1>
                <span
                  className={
                    company.status==="APPROVED"
                      ?"company-status approved"
                      :"company-status pending"
                  }
                >
                  {company.status==="APPROVED"
                    ?"Đã xác thực"
                    :"Chờ xác thực"}
                </span>
              </div>
              <p>Nhà tuyển dụng trên InterHub</p>
            </div>

            {currentUser?.role==="STUDENT"&&(
              <div className="company-profile-actions">
                <button
                  type="button"
                  className="company-chat-button"
                  onClick={handleOpenChat}
                >
                  Nhắn tin
                </button>

                {follow?(
                  <button
                    type="button"
                    className="follow-button followed"
                    onClick={handleUnFollow}
                    disabled={followLoading}
                  >
                    {followLoading?"Đang xử lý...":"Đã theo dõi"}
                  </button>
                ):(
                  <button
                    type="button"
                    className="follow-button"
                    onClick={handleFollow}
                    disabled={followLoading}
                  >
                    {followLoading?"Đang xử lý...":"+ Theo dõi"}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="company-information">
            <div className="company-info-item">
              <span>Người đại diện</span>
              <strong>
                {company.fullName||"Chưa cập nhật"}
              </strong>
            </div>

            <div className="company-info-item">
              <span>Tên đăng nhập</span>
              <strong>
                {company.username||"Chưa cập nhật"}
              </strong>
            </div>

            <div className="company-info-item">
              <span>Mã số thuế</span>
              <strong>
                {company.taxCode||"Chưa cập nhật"}
              </strong>
            </div>

            <div className="company-info-item">
              <span>Vai trò</span>
              <strong>Nhà tuyển dụng</strong>
            </div>
          </div>
        </section>

        <section className="company-section">
          <div className="company-section-header">
            <span>GIỚI THIỆU</span>
            <h2>Về {company.companyName}</h2>
          </div>
          <p className="company-description">
            <strong>{company.companyName}</strong>{" "}
            đang tham gia nền tảng InterHub với vai trò nhà tuyển dụng, cung cấp các cơ hội thực tập và việc làm dành cho sinh viên.
          </p>
        </section>

        <div className="company-tabs">
          <button
            type="button"
            className={activeTab==="JOBS"?"active":""}
            onClick={()=>handleChangeTab("JOBS")}
          >
            Việc làm
          </button>

          <button
            type="button"
            className={activeTab==="REVIEWS"?"active":""}
            onClick={()=>handleChangeTab("REVIEWS")}
          >
            Đánh giá
            {reviewInitialized&&reviewTotalElements>0&&(
              <span>{reviewTotalElements}</span>
            )}
          </button>
        </div>

        {activeTab==="JOBS"&&(
          <section className="company-section company-tab-content">
            <div className="company-job-heading">
              <div className="company-section-header">
                <span>CƠ HỘI VIỆC LÀM</span>
                <h2>Việc làm đang tuyển</h2>
                <p>
                  Các vị trí hiện đang được{" "}
                  <strong>{company.companyName}</strong>{" "}
                  tuyển dụng.
                </p>
              </div>

              {jobs.length>0&&(
                <div className="company-job-count">
                  {jobs.length} vị trí
                </div>
              )}
            </div>

            {jobLoading&&jobs.length===0?(
              <div className="company-job-loading">
                Đang tải danh sách việc làm...
              </div>
            ):jobs.length===0&&!jobHasMore?(
              <div className="company-job-empty">
                <h3>Chưa có vị trí tuyển dụng</h3>
                <p>
                  Doanh nghiệp hiện chưa có công việc nào đang tuyển.
                </p>
              </div>
            ):(
              <>
                <div className="company-job-list">
                  {jobs.map((job)=>(
                    <JobCard
                      key={job.id}
                      job={{
                        ...job,
                        employer:job.employer||company
                      }}
                    />
                  ))}
                </div>

                {jobLoading&&jobs.length>0&&(
                  <div className="company-load-more-loading">
                    Đang tải thêm công việc...
                  </div>
                )}

                {jobHasMore&&!jobLoading&&(
                  <div className="company-load-more">
                    <button
                      type="button"
                      onClick={handleLoadMoreJobs}
                    >
                      Xem thêm công việc
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {activeTab==="REVIEWS"&&(
          <section className="company-section company-tab-content">
            <div className="company-review-heading">
              <div className="company-section-header">
                <span>ĐÁNH GIÁ</span>
                <h2>Đánh giá từ sinh viên</h2>
                <p>
                  Trải nghiệm thực tập và làm việc tại doanh nghiệp.
                </p>
              </div>

              {reviewTotalElements>0&&(
                <div className="review-count">
                  {reviewTotalElements} đánh giá
                </div>
              )}
            </div>

            {reviewLoading&&reviews.length===0?(
              <div className="company-job-loading">
                Đang tải đánh giá...
              </div>
            ):reviews.length===0?(
              <div className="company-job-empty">
                <h3>Chưa có đánh giá</h3>
                <p>
                  Doanh nghiệp hiện chưa có đánh giá từ sinh viên.
                </p>
              </div>
            ):(
              <>
                <div className="review-list">
                  {reviews.map((review)=>(
                    <div
                      className="review-card"
                      key={review.id}
                    >
                      <div className="review-top">
                        <div className="review-user">
                          <div className="review-avatar">
                            {review.studentName?.charAt(0).toUpperCase()||"S"}
                          </div>

                          <div>
                            <h3>
                              {review.studentName||"Sinh viên"}
                            </h3>
                            <span>
                              {review.createdDate
                                ?new Date(review.createdDate).toLocaleDateString("vi-VN")
                                :""}
                            </span>
                          </div>
                        </div>

                        <div className="review-stars">
                          <span>
                            {"★".repeat(review.rating||0)}
                          </span>
                          {"☆".repeat(5-(review.rating||0))}
                        </div>
                      </div>

                      <p>
                        {review.comment||"Không có nội dung đánh giá."}
                      </p>
                    </div>
                  ))}
                </div>

                {reviewLoading&&(
                  <div className="company-load-more-loading">
                    Đang tải thêm đánh giá...
                  </div>
                )}

                {reviewHasMore&&!reviewLoading&&(
                  <div className="company-load-more">
                    <button
                      type="button"
                      onClick={handleLoadMoreReviews}
                    >
                      Xem thêm đánh giá
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default CompanyDetails;