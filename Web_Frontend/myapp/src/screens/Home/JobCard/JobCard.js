import "./JobCard.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";

import {
  GeoAlt,
  People,
  Calendar3,
  Briefcase,
  ArrowRight,
} from "react-bootstrap-icons";

function JobCard({ job }) {
  const { currentUser } = useContext(UserContext);

  const companyName =
    job.employer?.companyName ||
    job.employer?.fullName ||
    "Chưa cập nhật";

  const companyAvatar = job.employer?.avatarUrl;

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";

    return `${Number(salary).toLocaleString("vi-VN")} VNĐ`;
  };

  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";

    return new Date(date).toLocaleDateString("vi-VN");
  };

  const getStatus = () => {
    switch (job.status) {
      case "OPEN":
        return {
          text: "Đang tuyển",
          className: "job-status-open",
        };

      case "CLOSED":
        return {
          text: "Đã đóng",
          className: "job-status-closed",
        };

      default:
        return {
          text: job.status,
          className: "job-status-default",
        };
    }
  };

  const status = getStatus();

  return (
    <article className="job-card">

      {/* HEADER */}
      <div className="job-card-header">

        <div className="job-company-logo">
          {companyAvatar ? (
            <img
              src={companyAvatar}
              alt={companyName}
            />
          ) : (
            <Briefcase size={24} />
          )}
        </div>

        <div className="job-heading">

          <div className="job-heading-top">

            <Link
              to={`/jobs/${job.id}`}
              className="job-title"
            >
              {job.title}
            </Link>

            <span className={`job-status ${status.className}`}>
              {status.text}
            </span>

          </div>

          <p className="job-company-name">
            {companyName}
          </p>

        </div>

      </div>


      {/* DESCRIPTION */}
      {job.description && (
        <p className="job-description">
          {job.description}
        </p>
      )}


      {/* MAIN INFO */}
      <div className="job-info">

        <div className="job-info-block salary-block">
          <span className="job-info-label">
            Mức lương
          </span>

          <strong className="job-salary">
            {formatSalary(job.salary)}
          </strong>
        </div>


        <div className="job-info-block">

          <span className="job-info-label">
            <GeoAlt size={15} />
            Địa điểm
          </span>

          <strong>
            {job.location || "Chưa cập nhật"}
          </strong>

        </div>


        <div className="job-info-block">

          <span className="job-info-label">
            <People size={15} />
            Số lượng
          </span>

          <strong>
            {job.quantity || 1} vị trí
          </strong>

        </div>

      </div>


      {/* DATE */}
      <div className="job-time-info">

        <div>
          <span>Bắt đầu</span>
          <strong>{formatDate(job.startDate)}</strong>
        </div>

        <div>
          <span>Kết thúc</span>
          <strong>{formatDate(job.endDate)}</strong>
        </div>

      </div>


      {/* FOOTER */}
      <div className="job-card-footer">

        <div className="job-deadline">
          <Calendar3 size={16} />

          <span>
            Hạn ứng tuyển:
            <strong>
              {formatDate(job.deadline)}
            </strong>
          </span>
        </div>


        <div className="job-actions">

          <Link
            to={`/jobs/${job.id}`}
            className="job-detail-btn"
          >
            Xem chi tiết
            <ArrowRight size={16} />
          </Link>

          {currentUser?.role === "STUDENT" &&
            job.status === "OPEN" && (
              <Link
                to={`/jobs/${job.id}/apply`}
                className="job-apply-btn"
              >
                Ứng tuyển ngay
              </Link>
            )}

        </div>

      </div>

    </article>
  );
}

export default JobCard;