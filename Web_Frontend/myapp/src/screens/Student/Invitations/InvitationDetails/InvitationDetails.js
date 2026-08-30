import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCheck,
  FiFileText,
  FiMail,
  FiX,
} from "react-icons/fi";
import { authApi, endpoints } from "../../../../utils/api";
import "./InvitationDetails.css";

function InvitationDetails() {
  const { invitationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [invitation, setInvitation] = useState(
    location.state?.invitation || null
  );

  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("access-token");

      await authApi(token).post(
        endpoints.acceptJobInvitation(invitationId)
      );

      setInvitation((prev) => ({
        ...prev,
        status: "ACCEPTED",
      }));

      alert("Đã chấp nhận lời mời");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Không thể chấp nhận lời mời"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("access-token");

      await authApi(token).post(
        endpoints.rejectJobInvitation(invitationId)
      );

      setInvitation((prev) => ({
        ...prev,
        status: "REJECTED",
      }));

      alert("Đã từ chối lời mời");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Không thể từ chối lời mời"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!invitation) {
    return (
      <div className="invitation-detail-page">
        Không tìm thấy lời mời.
      </div>
    );
  }

  return (
    <div className="invitation-detail-page">
      <div className="invitation-detail-container">
        <button
          className="invitation-back"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          Quay lại
        </button>

        <article className="invitation-letter">
          <div className="invitation-letter-icon">
            <FiMail />
          </div>

          <span className="invitation-letter-label">
            THƯ MỜI TUYỂN DỤNG
          </span>

          <h1>{invitation.jobTitle}</h1>

          <p className="invitation-letter-intro">
            Xin chào{" "}
            <strong>{invitation.studentName}</strong>,
          </p>

          <div className="invitation-letter-content">
            <p>
              {invitation.message ||
                "Nhà tuyển dụng nhận thấy hồ sơ của bạn phù hợp với vị trí này và mong muốn mời bạn tham gia quy trình tuyển dụng."}
            </p>
          </div>

          <div className="invitation-detail-info">
            <div>
              <FiBriefcase />
              <span>Công việc</span>
              <strong>{invitation.jobTitle}</strong>
            </div>

            <div>
              <FiFileText />
              <span>Mã CV</span>
              <strong>#{invitation.cvId}</strong>
            </div>

            <div>
              <FiMail />
              <span>Mã lời mời</span>
              <strong>#{invitation.id}</strong>
            </div>
          </div>

          {invitation.fileCv && (
            <a
              href={invitation.fileCv}
              target="_blank"
              rel="noopener noreferrer"
              className="invitation-cv-link"
            >
              <FiFileText />
              Xem CV
            </a>
          )}

          {invitation.status === "PENDING" ? (
            <div className="invitation-detail-actions">
              <button
                className="invitation-accept"
                disabled={loading}
                onClick={handleAccept}
              >
                <FiCheck />
                Chấp nhận lời mời
              </button>

              <button
                className="invitation-reject"
                disabled={loading}
                onClick={handleReject}
              >
                <FiX />
                Từ chối lời mời
              </button>
            </div>
          ) : (
            <div className={`invitation-result ${invitation.status.toLowerCase()}`}>
              {invitation.status === "ACCEPTED"
                ? "Bạn đã chấp nhận lời mời này."
                : invitation.status === "REJECTED"
                ? "Bạn đã từ chối lời mời này."
                : "Lời mời này đã được xử lý."}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

export default InvitationDetails;