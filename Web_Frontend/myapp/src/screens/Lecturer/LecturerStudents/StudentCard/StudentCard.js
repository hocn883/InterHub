import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiHash,
  FiArrowRight,
  FiBriefcase,
  FiLayers,
} from "react-icons/fi";
import "./StudentCard.css";

function StudentCard({ student }) {
  const getInitial = () => {
    if (!student.fullName) return "S";

    return student.fullName
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  const getStudentStatus = () => {
    switch (student.status) {
      case "TIM_VIEC":
        return {
          label: "Đang tìm việc",
          className: "status-looking",
        };

      case "DA_CO_VIEC":
        return {
          label: "Đã có việc",
          className: "status-employed",
        };

      default:
        return {
          label: "Chưa cập nhật",
          className: "status-unknown",
        };
    }
  };

  const status = getStudentStatus();

  return (
    <article className="student-horizontal-card">

      {/* AVATAR */}
      <div className="student-horizontal-avatar">
        {student.avatarUrl ? (
          <img
            src={student.avatarUrl}
            alt={student.fullName || "Student"}
          />
        ) : (
          <span>{getInitial()}</span>
        )}
      </div>

      {/* MAIN INFORMATION */}
      <div className="student-horizontal-main">

        <div className="student-horizontal-heading">

          <div className="student-horizontal-name">
            <h3>
              {student.fullName || "Chưa cập nhật"}
            </h3>

            <span>
              @{student.username || "unknown"}
            </span>
          </div>

          <span className="student-horizontal-role">
            Sinh viên
          </span>

        </div>

        <div className="student-horizontal-info">

          <div className="student-horizontal-info-item">
            <div className="student-horizontal-info-icon">
              <FiHash />
            </div>

            <div>
              <span>MSSV</span>

              <strong>
                {student.mssv || "Chưa cập nhật"}
              </strong>
            </div>
          </div>

          <div className="student-horizontal-info-item">
            <div className="student-horizontal-info-icon">
              <FiLayers />
            </div>

            <div>
              <span>Lớp</span>

              <strong>
                {student.className || "Chưa cập nhật"}
              </strong>
            </div>
          </div>

          <div className="student-horizontal-info-item major">
            <div className="student-horizontal-info-icon">
              <FiBookOpen />
            </div>

            <div>
              <span>Chuyên ngành</span>

              <strong>
                {student.major || "Chưa cập nhật"}
              </strong>
            </div>
          </div>

        </div>

      </div>

      {/* ACTION */}
      <div className="student-horizontal-action">

        <span
          className={`student-horizontal-status ${status.className}`}
        >
          <FiBriefcase />
          {status.label}
        </span>

        <Link
          to={`/lecturer/students/${student.id}`}
          className="student-horizontal-detail"
        >
          Xem chi tiết
          <FiArrowRight />
        </Link>

      </div>

    </article>
  );
}

export default StudentCard;