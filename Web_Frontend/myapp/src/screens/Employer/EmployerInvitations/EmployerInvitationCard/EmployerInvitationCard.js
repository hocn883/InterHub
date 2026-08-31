import {
  FiBriefcase,
  FiCalendar,
  FiChevronRight,
  FiMail,
  FiUser,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import "./EmployerInvitationCard.css";

function EmployerInvitationCard({
  invitation,
}) {
  const navigate =
    useNavigate();

  const getTitle = () => {
    if (invitation.title) {
      return invitation.title;
    }

    if (
      invitation.job?.title
    ) {
      return `Thư mời ứng tuyển vị trí ${invitation.job.title}`;
    }

    return "Thư mời tuyển dụng";
  };

  const getStatusText = (
    status
  ) => {
    switch (status) {
      case "PENDING":
        return "Chờ phản hồi";

      case "ACCEPTED":
        return "Đã chấp nhận";

      case "REJECTED":
        return "Đã từ chối";

      default:
        return "Không xác định";
    }
  };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Chưa cập nhật";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "vi-VN"
    );
  };

  const handleViewDetail =
    () => {
      navigate(
        `/employer/invitations/${invitation.id}`,
        {
          state: {
            invitation,
          },
        }
      );
    };

  return (
    <article className="employer-invitation-card">
      <div className="employer-invitation-card-main">
        <div className="employer-invitation-card-icon">
          <FiMail />
        </div>

        <div className="employer-invitation-card-content">
          <div className="employer-invitation-card-header">
            <div>
              <span className="employer-invitation-card-code">
                THƯ MỜI #
                {invitation.id}
              </span>

              <h3>
                {getTitle()}
              </h3>
            </div>

            <span
              className={`employer-invitation-status employer-invitation-status-${invitation.status?.toLowerCase()}`}
            >
              {getStatusText(
                invitation.status
              )}
            </span>
          </div>

          <div className="employer-invitation-card-meta">
            <div>
              <FiUser />

              <div>
                <span>
                  Gửi đến
                </span>

                <strong>
                  {invitation.student
                    ?.fullName ||
                    "Ứng viên"}
                </strong>
              </div>
            </div>

            <div>
              <FiBriefcase />

              <div>
                <span>
                  Công việc
                </span>

                <strong>
                  {invitation.job
                    ?.title ||
                    "Chưa cập nhật"}
                </strong>
              </div>
            </div>

            <div>
              <FiCalendar />

              <div>
                <span>
                  Ngày gửi
                </span>

                <strong>
                  {formatDate(
                    invitation.createdDate ||
                      invitation.createdAt
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="employer-invitation-detail-button"
        onClick={
          handleViewDetail
        }
      >
        Xem chi tiết
        <FiChevronRight />
      </button>
    </article>
  );
}

export default EmployerInvitationCard;