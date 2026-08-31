import "./CvCard.css";

function CvCard({
  cv,
  currentUser,
  lecturer,
  onDelete,
  deleting,
}) {
  const getStatusInfo = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          text: "Đã duyệt",
          className: "approved",
        };

      case "REJECTED":
        return {
          text: "Cần chỉnh sửa",
          className: "rejected",
        };

      default:
        return {
          text: "Đang chờ",
          className: "pending",
        };
    }
  };

  const statusInfo = getStatusInfo(cv.status);

  return (
    <article className="cv-review-card">
      <div className="cv-review-icon">
        CV
      </div>

      <div className="cv-review-content">
        <div className="cv-review-top">
          <div>
            <h3>
              {cv.fileName || "CV thực tập"}
            </h3>

            <p>
              Gửi ngày {cv.createdDate}
            </p>
          </div>

          <span
            className={`cv-review-status ${statusInfo.className}`}
          >
            {statusInfo.text}
          </span>
        </div>

        <div className="cv-review-information">
          <div>
            <span>Sinh viên</span>

            <strong>
              {cv.studentName ||
                currentUser?.fullName ||
                "Chưa cập nhật"}
            </strong>
          </div>

          <div>
            <span>Mã sinh viên</span>

            <strong>
              {currentUser?.mssv ||
                cv.studentId ||
                "Chưa cập nhật"}
            </strong>
          </div>

          <div>
            <span>Ngày gửi</span>

            <strong>
              {cv.createdDate}
            </strong>
          </div>

          <div>
            <span>Giảng viên</span>

            <strong>
              {lecturer?.fullName ||
                "Chưa cập nhật"}
            </strong>
          </div>
        </div>

        <div className="cv-review-feedback">
          <span className="feedback-label">
            PHẢN HỒI GIẢNG VIÊN
          </span>

          {cv.lecturerFeedback ? (
            <p>
              {cv.lecturerFeedback}
            </p>
          ) : (
            <p className="waiting-feedback">
              Chưa có phản hồi từ giảng viên.
            </p>
          )}
        </div>

        <div className="cv-review-actions">
          <a
            href={cv.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            Xem CV
          </a>

          {cv.status === "PENDING" && (
            <button
              type="button"
              className="btn btn-delete"
              disabled={deleting}
              onClick={() => onDelete(cv)}
            >
              {deleting
                ? "Đang xóa..."
                : "Xóa CV"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default CvCard;