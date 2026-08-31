import { FiArrowLeft,FiBriefcase,FiCalendar,FiClock,FiFileText,FiMail,FiMapPin,FiUser,} from "react-icons/fi";
import {useLocation, useNavigate,  useParams,} from "react-router-dom";
import "./EmployerInvitationDetails.css";

function InvitationDetails() {
  const { invitationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const invitation = location.state?.invitation;

  const formatDate = (date) => {
    if (!date) {
      return "Chưa cập nhật";
    }

    return new Date(date).toLocaleDateString(
      "vi-VN"
    );
  };

  const formatMoney = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "Thỏa thuận";
    }

    return `${Number(
      value
    ).toLocaleString("vi-VN")} VNĐ`;
  };

  const getStatusText = (status) => {
    if (status === "PENDING") {
      return "Chờ phản hồi";
    }

    if (status === "ACCEPTED") {
      return "Đã chấp nhận";
    }

    if (status === "REJECTED") {
      return "Đã từ chối";
    }

    return "Không xác định";
  };

  const getTitle = () => {
    if (invitation?.title) {
      return invitation.title;
    }

    if (invitation?.job?.title) {
      return `Thư mời ứng tuyển vị trí ${invitation.job.title}`;
    }

    return "Thư mời tuyển dụng";
  };

  if (!invitation) {
    return (
      <div className="invitation-details-page">
        <div className="invitation-details-container">
          <button
            className="invitation-back"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
            Quay lại
          </button>

          <div className="invitation-empty">
            <FiMail />
            <h3>Không tìm thấy thư mời</h3>
            <p>
              Vui lòng quay lại danh sách thư mời.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="invitation-details-page">
      <div className="invitation-details-container">
        <button
          className="invitation-back"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          Quay lại
        </button>

        <article className="invitation-mail">
          <div className="invitation-mail-top">
            <div className="invitation-mail-icon">
              <FiMail />
            </div>

            <div>
              <span>THƯ MỜI TUYỂN DỤNG</span>
              <p>
                #{invitationId || invitation.id}
              </p>
            </div>

            <span
              className={`invitation-status ${invitation.status?.toLowerCase()}`}
            >
              {getStatusText(
                invitation.status
              )}
            </span>
          </div>

          <div className="invitation-mail-info">
            <div className="invitation-person">
              <span>Từ</span>

              <div className="invitation-person-content">
                {invitation.employer
                  ?.avatarUrl ? (
                  <img
                    src={
                      invitation.employer
                        .avatarUrl
                    }
                    alt=""
                  />
                ) : (
                  <div className="invitation-avatar">
                    <FiBriefcase />
                  </div>
                )}

                <div>
                  <strong>
                    {invitation.employer
                      ?.companyName ||
                      "Nhà tuyển dụng"}
                  </strong>

                  <p>
                    {invitation.employer
                      ?.fullName ||
                      ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="invitation-person">
              <span>Đến</span>

              <div className="invitation-person-content">
                {invitation.student
                  ?.avatarUrl ? (
                  <img
                    src={
                      invitation.student
                        .avatarUrl
                    }
                    alt=""
                  />
                ) : (
                  <div className="invitation-avatar">
                    <FiUser />
                  </div>
                )}

                <div>
                  <strong>
                    {invitation.student
                      ?.fullName ||
                      "Ứng viên"}
                  </strong>

                  <p>
                    {invitation.student
                      ?.email || ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="invitation-date">
              {formatDate(
                invitation.createdDate ||
                  invitation.createdAt
              )}
            </div>
          </div>

          <div className="invitation-subject">
            <span>Tiêu đề</span>
            <h1>{getTitle()}</h1>
          </div>

          <div className="invitation-message">
            <p>
              Xin chào{" "}
              <strong>
                {invitation.student
                  ?.fullName || "bạn"}
              </strong>
              ,
            </p>

            <p>
              {invitation.message ||
                "Chúng tôi nhận thấy hồ sơ của bạn phù hợp với vị trí tuyển dụng và mong muốn gửi đến bạn lời mời này."}
            </p>
          </div>

          <div className="invitation-job">
            <div className="invitation-job-title">
              <FiBriefcase />

              <div>
                <span>Vị trí tuyển dụng</span>

                <h2>
                  {invitation.job?.title ||
                    "Chưa cập nhật"}
                </h2>
              </div>
            </div>

            <div className="invitation-job-info">
              <InvitationInfo
                icon={<FiMapPin />}
                label="Địa điểm"
                value={
                  invitation.job
                    ?.location ||
                  "Chưa cập nhật"
                }
              />

              <InvitationInfo
                icon={<FiCalendar />}
                label="Bắt đầu"
                value={formatDate(
                  invitation.job
                    ?.startDate
                )}
              />

              <InvitationInfo
                icon={<FiClock />}
                label="Kết thúc"
                value={formatDate(
                  invitation.job
                    ?.endDate
                )}
              />

              <InvitationInfo
                icon={<FiBriefcase />}
                label="Mức lương"
                value={formatMoney(
                  invitation.job?.salary
                )}
              />
            </div>

            {invitation.job
              ?.description && (
              <div className="invitation-job-content">
                <strong>
                  Mô tả công việc
                </strong>

                <p>
                  {
                    invitation.job
                      .description
                  }
                </p>
              </div>
            )}

            {invitation.job
              ?.requirements && (
              <div className="invitation-job-content">
                <strong>
                  Yêu cầu
                </strong>

                <p>
                  {
                    invitation.job
                      .requirements
                  }
                </p>
              </div>
            )}
          </div>

          {invitation.cvId && (
            <div className="invitation-cv">
              <div>
                <FiFileText />

                <div>
                  <span>CV ứng viên</span>
                  <strong>
                    CV #{invitation.cvId}
                  </strong>
                </div>
              </div>

              {invitation.fileCv && (
                <a
                  href={
                    invitation.fileCv
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xem CV
                </a>
              )}
            </div>
          )}

          <div className="invitation-signature">
            <p>Trân trọng,</p>

            <strong>
              {invitation.employer
                ?.fullName ||
                "Nhà tuyển dụng"}
            </strong>

            <span>
              {invitation.employer
                ?.companyName || ""}
            </span>
          </div>
        </article>
      </div>
    </div>
  );
}

function InvitationInfo({
  icon,
  label,
  value,
}) {
  return (
    <div className="invitation-info">
      <span className="invitation-info-icon">
        {icon}
      </span>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default InvitationDetails;