import { useState } from "react";
import { Link } from "react-router-dom";
import { FiBriefcase, FiCalendar, FiEdit2, FiEye, FiLock, FiMapPin, FiTrash2, FiUsers } from "react-icons/fi";
import { authApi, endpoints } from "../../../../utils/api";
import "./MyJobCard.css";

const STATUS_CONFIG = {
  OPEN: { label: "Đang tuyển", className: "open" },
  CLOSED: { label: "Đã đóng", className: "closed" },
  COMPLETED: { label: "Hoàn thành", className: "completed" },
};

const MyJobCard = ({ job, onDelete, onStatusChange }) => {
  const initialStatus = job.status?.toUpperCase() || "OPEN";
  const [jobStatus, setJobStatus] = useState(initialStatus);
  const [closing, setClosing] = useState(false);

  const status = STATUS_CONFIG[jobStatus] || {
    label: jobStatus,
    className: "",
  };

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    return `${Number(salary).toLocaleString("vi-VN")} VNĐ`;
  };

  const handleCloseJob = async () => {
    const confirmed = window.confirm("Bạn có chắc muốn đóng tin tuyển dụng này?");
    if (!confirmed) return;
    try {
      setClosing(true);
      setJobStatus("CLOSED");
      onStatusChange?.(job.id, "CLOSED");
      const token = localStorage.getItem("access-token");
      await authApi(token).patch(endpoints.closeJob(job.id));
    } catch (error) {
      console.error("Close job error:", error);
      setJobStatus("OPEN");
      onStatusChange?.(job.id, "OPEN");
      alert(error.response?.data?.message || "Không thể đóng tin tuyển dụng");
    } finally {
      setClosing(false);
    }
  };

  return (
    <article className="myjob-card">
      <div className="myjob-header">
        <div className="myjob-header-main">
          <div className="myjob-title-row">
            <Link to={`/jobs/${job.id}`} className="myjob-title">
              {job.title}
            </Link>
            <span className={`myjob-status ${status.className}`}>
              {status.label}
            </span>
          </div>

          <div className="myjob-created">
            <FiCalendar />
            <span>Đăng ngày {job.createdDate || "Chưa cập nhật"}</span>
          </div>
        </div>

        <Link
          to={`/employer/jobs/${job.id}/applications`}
          className="myjob-applicant-box"
        >
          <FiUsers />
          <div>
            <strong>{job.applicationCount ?? 0}</strong>
            <span>Ứng viên</span>
          </div>
        </Link>
      </div>

      <div className="myjob-info-grid">
        <div className="myjob-info-item">
          <div className="myjob-info-icon">
            <FiMapPin />
          </div>
          <div>
            <span>Địa điểm</span>
            <strong>{job.location || "Chưa cập nhật"}</strong>
          </div>
        </div>

        <div className="myjob-info-item">
          <div className="myjob-info-icon">
            <FiBriefcase />
          </div>
          <div>
            <span>Mức lương</span>
            <strong>{formatSalary(job.salary)}</strong>
          </div>
        </div>

        <div className="myjob-info-item">
          <div className="myjob-info-icon">
            <FiUsers />
          </div>
          <div>
            <span>Số lượng tuyển</span>
            <strong>{job.quantity ?? 0} sinh viên</strong>
          </div>
        </div>

        <div className="myjob-info-item">
          <div className="myjob-info-icon">
            <FiCalendar />
          </div>
          <div>
            <span>Hạn ứng tuyển</span>
            <strong>{job.deadline || "Chưa cập nhật"}</strong>
          </div>
        </div>
      </div>

      <div className="myjob-footer">
        <div className="myjob-main-actions">
          <Link to={`/jobs/${job.id}`} className="myjob-button myjob-view">
            <FiEye />
            Xem tin
          </Link>

          <Link
            to={`/employer/jobs/${job.id}/applications`}
            className="myjob-button myjob-applications"
          >
            <FiUsers />
            Xem ứng viên
          </Link>
        </div>

        <div className="myjob-manage-actions">
          {jobStatus === "OPEN" && (
            <>
              <Link
                to={`/employer/jobs/${job.id}/edit`}
                className="myjob-icon-button edit"
                title="Chỉnh sửa"
              >
                <FiEdit2 />
                <span>Sửa</span>
              </Link>

              <button
                type="button"
                className="myjob-icon-button close"
                disabled={closing}
                onClick={handleCloseJob}
              >
                <FiLock />
                <span>{closing ? "Đang đóng..." : "Đóng job"}</span>
              </button>
            </>
          )}

          <button
            type="button"
            className="myjob-icon-button delete"
            onClick={() => onDelete?.(job.id)}
          >
            <FiTrash2 />
            <span>Xóa</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default MyJobCard;