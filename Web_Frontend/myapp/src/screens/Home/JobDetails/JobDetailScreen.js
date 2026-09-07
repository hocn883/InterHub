import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {authApi} from "../../../utils/api";
import "./JobDetailScreen.css";

function JobDetailScreen() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const tokken=localStorage.getItem("access-token");
        const response = await authApi(tokken).get(
          `/job/${jobId}`
        );
        setJob(response.data.result);
      } catch (error) {
        console.error("Không thể lấy chi tiết công việc:", error);

        setError(
          error.response?.data?.message ||
          "Không thể tải thông tin công việc."
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetail();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="job-detail-loading">
        Đang tải thông tin công việc...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-not-found">
        <h2>Không tìm thấy công việc</h2>

        <p>
          {error ||
            "Công việc này có thể đã bị xóa hoặc không còn tồn tại."}
        </p>

        <Link
          to="/"
          className="back-to-jobs-button"
        >
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const companyName =
    job.employer?.companyName ||
    job.employer?.fullName ||
    "Chưa cập nhật";

  const salary = job.salary
    ? `${Number(job.salary).toLocaleString("vi-VN")} VNĐ`
    : "Thỏa thuận";

  return (
    <main className="job-detail-page">
      <div className="job-detail-container">

        {/* BREADCRUMB */}
        <nav className="job-breadcrumb">
          <Link to="/">
            Trang chủ
          </Link>

          <span>/</span>

          <span>
            {job.title}
          </span>
        </nav>


        {/* JOB HEADER */}
        <section className="job-detail-hero">

          <div className="job-detail-heading">

            {/* COMPANY AVATAR */}
            <div className="job-detail-company-logo">
              {job.employer?.avatarUrl ? (
                <img
                  src={job.employer.avatarUrl}
                  alt={companyName}
                />
              ) : (
                companyName.charAt(0).toUpperCase()
              )}
            </div>


            {/* JOB TITLE */}
            <div className="job-detail-title-group">

              <h1>
                {job.title}
              </h1>

              <p className="job-detail-company-name">
                {companyName}
              </p>

              <div className="job-detail-tags">

                <span>
                  {job.location || "Chưa cập nhật địa điểm"}
                </span>

                <span>
                  {job.status || "OPEN"}
                </span>

              </div>

            </div>

          </div>


          {/* JOB SUMMARY */}
          <div className="job-detail-summary">

            <div className="summary-item">
              <div>
                <small>Mức lương</small>

                <strong>
                  {salary}
                </strong>
              </div>
            </div>


            <div className="summary-item">
              <div>
                <small>Hạn ứng tuyển</small>

                <strong>
                  {job.deadline || "Chưa cập nhật"}
                </strong>
              </div>
            </div>


            <div className="summary-item">
              <div>
                <small>Số lượng tuyển</small>

                <strong>
                  {job.quantity || 1} vị trí
                </strong>
              </div>
            </div>


            <div className="summary-item">
              <div>
                <small>Trạng thái</small>

                <strong>
                  {job.status || "Chưa cập nhật"}
                </strong>
              </div>
            </div>

          </div>

        </section>


        <div className="job-detail-layout">

          {/* MAIN CONTENT */}
          <section className="job-detail-main">


            {/* DESCRIPTION */}
            <article className="job-detail-section">

              <h2>
                Mô tả công việc
              </h2>

              <div className="job-detail-text">
                <p>
                  {job.description ||
                    "Chưa cập nhật mô tả công việc."}
                </p>
              </div>

            </article>


            {/* REQUIREMENTS */}
            <article className="job-detail-section">

              <h2>
                Yêu cầu ứng viên
              </h2>

              <div className="job-detail-text">
                <p>
                  {job.requirements ||
                    "Chưa cập nhật yêu cầu ứng viên."}
                </p>
              </div>

            </article>


            {/* JOB PERIOD */}
            <article className="job-detail-section">

              <h2>
                Thời gian thực tập
              </h2>

              <div className="job-detail-text">

                <p>
                  <strong>Ngày bắt đầu: </strong>
                  {job.startDate || "Chưa cập nhật"}
                </p>

                <p>
                  <strong>Ngày kết thúc: </strong>
                  {job.endDate || "Chưa cập nhật"}
                </p>

              </div>

            </article>


            {/* LOCATION */}
            <article className="job-detail-section">

              <h2>
                Địa điểm làm việc
              </h2>

              <div className="job-location-box">

                <div>
                  <strong>
                    {job.location || "Chưa cập nhật"}
                  </strong>

                  <p>
                    Địa chỉ cụ thể sẽ được doanh nghiệp cung cấp
                    trong quá trình tuyển dụng.
                  </p>
                </div>

              </div>

            </article>

          </section>


          {/* SIDEBAR */}
          <aside className="job-detail-sidebar">


            {/* APPLY CARD */}
            <div className="apply-card">

              <div className="apply-card-header">

                <span>
                  Hạn nộp hồ sơ
                </span>

                <strong>
                  {job.deadline || "Chưa cập nhật"}
                </strong>

              </div>


              <Link
                to={`/applications/${jobId}`}
                className="apply-now-button"
              >
                Ứng tuyển ngay
              </Link>


              <p className="application-note">
                Hãy kiểm tra kỹ CV và thông tin cá nhân trước khi
                ứng tuyển.
              </p>

            </div>


            {/* COMPANY CARD */}
            <div className="company-card">

              <h3>
                Thông tin công ty
              </h3>

              <div className="company-card-heading">

                <div className="company-card-logo">

                  {job.employer?.avatarUrl ? (
                    <img
                      src={job.employer.avatarUrl}
                      alt={companyName}
                    />
                  ) : (
                    companyName.charAt(0).toUpperCase()
                  )}

                </div>


                <div>

                  <strong>
                    {companyName}
                  </strong>

                  <span>
                    Nhà tuyển dụng đã xác thực
                  </span>

                </div>

              </div>


              <div className="company-card-info">

                <p>
                  Địa điểm:{" "}
                  {job.location || "Đang cập nhật"}
                </p>

              </div>

            </div>


            {/* WARNING */}
            <div className="job-warning-card">

              <h3>
                Lưu ý an toàn
              </h3>

              <p>
                Không cung cấp thông tin tài khoản ngân hàng hoặc
                chuyển tiền cho nhà tuyển dụng.
              </p>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}

export default JobDetailScreen;