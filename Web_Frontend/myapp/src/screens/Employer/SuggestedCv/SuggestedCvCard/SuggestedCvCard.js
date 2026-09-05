import {FiCalendar,FiCheckCircle,FiEye, FiFileText,FiUser,FiUserCheck,} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./SuggestedCvCard.css";
import { useContext } from "react";
import { UserContext } from "../../../../contexts/UserContext";
const SuggestedCvCard = ({ application, rank,
}) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) {
      return "Chưa cập nhật";
    }

    return new Date(date).toLocaleDateString(
      "vi-VN"
    );
  };

  const handleSelectCandidate = () => {
    navigate(
      `/employer/invite-cv/${application.id}`,
      {
        state: {
          cv: application,
        },
      }
    );
  };
  const currentUser=useContext(UserContext).currentUser;

  return (
    <article className="suggested-card">

      <div className="suggested-rank">
        #{rank}
      </div>

      <div className="suggested-avatar">
        {application.studentName
          ?.charAt(0)
          ?.toUpperCase() || "S"}
      </div>

      <div className="suggested-main">

        <div className="suggested-card-top">
          <div>

            <div className="suggested-name-row">
              <h3>
                {application.studentName ||
                  "Chưa cập nhật"}
              </h3>

              <span className="suggested-badge">
                <FiCheckCircle />
                CV đã duyệt
              </span>
            </div>

            <p className="suggested-student-id">
              <FiUser />

              Mã sinh viên:

              <strong>
                {application.studentId ||
                  "Chưa cập nhật"}
              </strong>
            </p>

          </div>

          <span className="suggested-status">
            <FiCheckCircle />
            Đã xác nhận
          </span>
        </div>

        <div className="suggested-info-grid">

          <div className="suggested-info-item">
            <div className="suggested-info-icon">
              <FiFileText />
            </div>

            <div>
              <span>Mã CV</span>

              <strong>
                #{application.id}
              </strong>
            </div>
          </div>

          <div className="suggested-info-item">
            <div className="suggested-info-icon">
              <FiUserCheck />
            </div>

            <div>
              <span>Giảng viên duyệt</span>

              <strong>
                #{application.lecturerId ||
                  "Chưa cập nhật"}
              </strong>
            </div>
          </div>

          <div className="suggested-info-item">
            <div className="suggested-info-icon">
              <FiCalendar />
            </div>

            <div>
              <span>Ngày đăng CV</span>

              <strong>
                {formatDate(
                  application.createdDate
                )}
              </strong>
            </div>
          </div>

        </div>

        {application.lecturerFeedback && (
          <div className="suggested-feedback">
            <span>
              Nhận xét của giảng viên
            </span>

            <p>
              {application.lecturerFeedback}
            </p>
          </div>
        )}

        <div className="suggested-actions">

          <a
            href={application.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="suggested-cv-button"
          >
            <FiEye />
            Xem CV
          </a>

          {currentUser?.role === 'EMPLOYER' && (
            <button
              type="button"
              className="suggested-select-button"
              onClick={handleSelectCandidate}
            >
              <FiUserCheck />
            Tuyển dụng
          </button>)}

        </div>

      </div>
    </article>
  );
};

export default SuggestedCvCard;