import {
  FiBookOpen,
  FiBriefcase,
  FiDollarSign,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import "./StudentApplyCard.css";

function StudentApplyCard({ application, type }) {
  const student = application.student || application;
  const job = application.job;
  console.log("student:", application.student);
  console.log("job:", application.job);
  console.log("application:", application);
  const getGender = (gender) => {
    if (gender === "MALE") return "Nam";
    if (gender === "FEMALE") return "Nữ";
    return "Chưa cập nhật";
  };

  const getStatus = () => {
    if (type === "APPLIED") {
      return {
        label: "Đang ứng tuyển",
        className: "applied",
      };
    }

    if (type === "INTERNSHIP") {
      return {
        label: "Đang thực tập",
        className: "internship",
      };
    }

    return {
      label: "Đã từ chối",
      className: "rejected",
    };
  };

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    return `${Number(salary).toLocaleString("vi-VN")} VNĐ`;
  };

  const status = getStatus();

  return (
    <article className="student-application-card">
      <div className="student-application-header">
        <div className="student-application-profile">
          <div className="student-application-avatar">
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt={student.fullName} />
            ) : (
              <FiUser />
            )}
          </div>

          <div className="student-application-name">
            <div className="student-application-title-row">
              <h3>{student.fullName || "Chưa cập nhật"}</h3>

              <span className={`student-application-status ${status.className}`}>
                {status.label}
              </span>
            </div>

            <p>
              MSSV: {student.mssv || "Chưa cập nhật"}
              {student.className && ` • ${student.className}`}
            </p>
          </div>
        </div>
      </div>

      <div className="student-application-info-grid">
        <div className="student-application-info-item">
          <div className="student-application-info-icon">
            <FiBookOpen />
          </div>

          <div>
            <span>Chuyên ngành</span>
            <strong>{student.major || "Chưa cập nhật"}</strong>
          </div>
        </div>

        <div className="student-application-info-item">
          <div className="student-application-info-icon">
            <FiMail />
          </div>

          <div>
            <span>Email</span>
            <strong>{student.email || "Chưa cập nhật"}</strong>
          </div>
        </div>

        <div className="student-application-info-item">
          <div className="student-application-info-icon">
            <FiPhone />
          </div>

          <div>
            <span>Số điện thoại</span>
            <strong>{student.phone || "Chưa cập nhật"}</strong>
          </div>
        </div>

        <div className="student-application-info-item">
          <div className="student-application-info-icon">
            <FiUser />
          </div>

          <div>
            <span>Giới tính</span>
            <strong>{getGender(student.gender)}</strong>
          </div>
        </div>
      </div>

      <div className="student-application-job">
        <div className="student-application-job-heading">
          <div>
            <span>CÔNG VIỆC ỨNG TUYỂN</span>

            {job ? (
              <Link to={`/jobs/${job.id}`}>
                {job.title || "Chưa cập nhật"}
              </Link>
            ) : (
              <strong>Chưa có thông tin công việc</strong>
            )}
          </div>
          <FiBriefcase />
        </div>

        {job && (
          <div className="student-application-job-info">
            <div>
              <FiMapPin />
              <span>{job.location || "Chưa cập nhật"}</span>
            </div>
            <div>
              <FiDollarSign />
              <span>{formatSalary(job.salary)}</span>
            </div>
            <div>
              <span>Thời gian thực tập :{job.startDate} đến {job.endDate}</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default StudentApplyCard;