import { FiBriefcase, FiCheck, FiFileText, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./InvitationCard.css";

function InvitationCard({ invitation, onAccept, onReject, loading }) {
  const navigate = useNavigate();

  const getStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ";
      case "ACCEPTED":
        return "Đã chấp nhận";
      case "REJECTED":
        return "Đã từ chối";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <article className="invitation-card">
      <div className="invitation-card-header">
        <div>
          <span className="invitation-label">THƯ MỜI TUYỂN DỤNG</span>
          <h3>{invitation.jobTitle}</h3>
        </div>

        <span className={`invitation-status ${invitation.status.toLowerCase()}`}>
          {getStatus(invitation.status)}
        </span>
      </div>

      <div className="invitation-card-info">
        <span>
          <FiBriefcase />
          Mã công việc #{invitation.jobId}
        </span>

        <span>
          <FiFileText />
          CV #{invitation.cvId}
        </span>
      </div>

      <p className="invitation-message">
        {invitation.message || "Nhà tuyển dụng đã gửi cho bạn một lời mời tuyển dụng."}
      </p>

      <div className="invitation-card-actions">
        {invitation.status === "PENDING" && (
          <>
            <button
              className="invitation-accept"
              disabled={loading}
              onClick={() => onAccept(invitation.id)}
            >
              <FiCheck />
              Chấp nhận
            </button>

            <button
              className="invitation-reject"
              disabled={loading}
              onClick={() => onReject(invitation.id)}
            >
              <FiX />
              Từ chối
            </button>
          </>
        )}

        <button
          className="invitation-detail"
          onClick={() =>
            navigate(`/employer/invitations/${invitation.id}`, {
              state: { invitation },
            })
          }
        >
          Xem chi tiết
        </button>
      </div>
    </article>
  );
}

export default InvitationCard;