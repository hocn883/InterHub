import React, { useState } from "react";
import "./MyApplyJobCard.css";
import {
  authApi,
  endpoints,
} from "../../../../utils/api";

const MyApplyJobCard = ({
  application,
  onStatusChange,
}) => {
  const [processing, setProcessing] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";

      case "APPROVE":
        return "status-approved";

      case "REJECTED":
        return "status-rejected";

      default:
        return "status-default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ";

      case "APPROVE":
        return "Đã duyệt";

      case "REJECTED":
        return "Đã từ chối";

      default:
        return status || "Không xác định";
    }
  };

  const approveCv = async () => {
    try {
      setProcessing(true);

      const token =
        localStorage.getItem("access-token");

      if (!token) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      await authApi(token).patch(
        endpoints.approveApplication(
          application.id
        )
      );

      onStatusChange?.(
        application.id,
        "APPROVE"
      );

      alert("Đã duyệt CV");
    } catch (error) {
      console.error(
        "Approve CV error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Duyệt CV thất bại"
      );
    } finally {
      setProcessing(false);
    }
  };

  const rejectCv = async () => {
    try {
      setProcessing(true);

      const token =
        localStorage.getItem("access-token");

      if (!token) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      await authApi(token).patch(
        endpoints.rejectApplication(
          application.id
        )
      );

      onStatusChange?.(
        application.id,
        "REJECTED"
      );

      alert("Đã từ chối CV");
    } catch (error) {
      console.error(
        "Reject CV error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Từ chối CV thất bại"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <article className="application-card">
      <div className="student-avatar">
        {application.student.studentName
          ?.charAt(0)
          ?.toUpperCase() || "S"}
      </div>

      <div className="application-main">

        <div className="application-top">
          <div className="student-heading">
            <h3>
              {application.student.studentName ||
                "Chưa cập nhật"}
            </h3>

            <p className="student-id">
              <i className="bi bi-person-badge"></i>

              MSSV:
              <strong>
                {application.student.mssv ||
                  "Chưa cập nhật"}
              </strong>
            </p>
          </div>

          <span
            className={`application-status ${getStatusClass(
              application.status
            )}`}
          >
            <i
              className={
                application.status === "PENDING"
                  ? "bi bi-clock"
                  : application.status === "APPROVE"
                  ? "bi bi-check-circle-fill"
                  : application.status === "REJECTED"
                  ? "bi bi-x-circle-fill"
                  : "bi bi-info-circle"
              }
            ></i>
            {getStatusText(application.status)}
          </span>
        </div>
        <div className="application-info">
          <div className="info-item">
            <div className="info-icon">
              <i className="bi bi-briefcase-fill"></i>
            </div>
            <div className="info-content">
              <span>Vị trí ứng tuyển</span>
              <strong>
                {application.job.title ||
                  "Chưa cập nhật"}
              </strong>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <i className="bi bi-building-fill"></i>
            </div>
            <div className="info-content">
              <span>Doanh nghiệp</span>
              <strong>
                {application.job.employer.companyName ||
                  "Chưa cập nhật"}
              </strong>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <i className="bi bi-calendar-check-fill"></i>
            </div>
            <div className="info-content">
              <span>Ngày ứng tuyển</span>
              <strong>
                {application.createdDate
                  ? new Date(
                      application.createdDate
                    ).toLocaleDateString(
                      "vi-VN"
                    )
                  : "Chưa cập nhật"}
              </strong>
            </div>
          </div>
        </div>
        {application.coverLetter && (
          <div className="cover-letter">
            <div className="cover-letter-title">
              <i className="bi bi-chat-left-text-fill"></i>
              <span>Thư giới thiệu</span>
            </div>
            <p>{application.coverLetter}</p>
          </div>
        )}
        <div className="application-actions">
          <div className="application-actions-left">
            {application.fileCv && (
              <a
                href={application.fileCv}
                target="_blank"
                rel="noopener noreferrer"
                className="cv-button"
              >
                <i className="bi bi-file-earmark-pdf-fill"></i>
                Xem CV
              </a>
            )}
            <button
              type="button"
              className="view-button"
            >
              <i className="bi bi-eye-fill"></i>
              Xem chi tiết
            </button>
          </div>
          {application.status === "PENDING" && (
            <div className="application-decision-actions"> 
              <button
                type="button"
                className="reject-button"
                onClick={rejectCv}
                disabled={processing}
              >
                <i className="bi bi-x-lg"></i>
                {processing
                  ? "Đang xử lý..."
                  : "Từ chối"}
              </button>
              <button
                type="button"
                className="approve-button"
                onClick={approveCv}
                disabled={processing}
              >
                <i className="bi bi-check-lg"></i>
                {processing
                  ? "Đang xử lý..."
                  : "Duyệt CV"}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
export default MyApplyJobCard;