import { useState } from "react";

import {
  FiCheck,
  FiClock,
  FiEdit3,
  FiEye,
  FiFileText,
  FiMessageSquare,
} from "react-icons/fi";

import {
  authApi,
  endpoints,
} from "../../../../utils/api";

import "./CvReviewCard.css";

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ duyệt",
    icon: FiClock,
  },

  APPROVED: {
    label: "Đã duyệt",
    icon: FiCheck,
  },

  REJECTED: {
    label: "Cần chỉnh sửa",
    icon: FiEdit3,
  },
};

function CvReviewCard({
  cv,
  onUpdated,
}) {
  const [feedback, setFeedback] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const cvId = cv.id

  const statusConfig =
    STATUS_CONFIG[cv.status] ||
    STATUS_CONFIG.PENDING;

  const StatusIcon =
    statusConfig.icon;
  const handleApprove = async () => {
    try {
      const token =
        localStorage.getItem(
          "access-token"
        );

      if (!token) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      if (!cvId) {
        alert("Không tìm thấy ID của CV");
        return;
      }

      setProcessing(true);

      await authApi(token).patch(
        endpoints.lecturerCvApproved(cvId)
      );

      await onUpdated?.();
    } catch (err) {
      console.error(
        "Approve CV error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Không thể chấp nhận CV"
      );
    } finally {
      setProcessing(false);
    }
  };
  const handleReject = async () => {
    const content = feedback.trim();

    if (!content) {
      alert(
        "Vui lòng nhập nhận xét trước khi yêu cầu chỉnh sửa"
      );
      return;
    }

    try {
      const token =
        localStorage.getItem(
          "access-token"
        );

      if (!token) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      if (!cvId) {
        alert("Không tìm thấy ID của CV");
        return;
      }

      setProcessing(true);

      await authApi(token).patch(
        endpoints.lecturerCvRejected(cvId),
        {
          feedback: content,
        }
      );

      setFeedback("");

      await onUpdated?.();
    } catch (err) {
      console.error(
        "Reject CV error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Không thể gửi yêu cầu chỉnh sửa CV"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <article className="cv-review-card">
      {/* FILE ICON */}

      <div className="cv-file-icon">
        <FiFileText />
      </div>

      {/* CONTENT */}

      <div className="cv-review-content">
        <div className="cv-review-top">
          <div className="cv-review-info">
            <h3>
              {cv.fileName ||
                "CV sinh viên"}
            </h3>

            <div className="cv-student-info">
              {cv.studentName && (
                <span>
                  {cv.studentName}
                </span>
              )}

              {cv.mssv && (
                <span>
                  {cv.mssv}
                </span>
              )}

              {cv.className && (
                <span>
                  {cv.className}
                </span>
              )}
            </div>
          </div>

          <span
            className={`cv-status ${
              cv.status?.toLowerCase() ||
              ""
            }`}
          >
            <StatusIcon />

            {statusConfig.label}
          </span>
        </div>

        {/* DATE */}

        {cv.createdDate && (
          <div className="cv-created-date">
            <FiClock />

            <span>
              Gửi ngày{" "}
              {cv.createdDate}
            </span>
          </div>
        )}

        {/* FEEDBACK ĐÃ REVIEW */}

        {cv.status !== "PENDING" && (
          <div className="cv-old-feedback">
            <div className="cv-feedback-title">
              <FiMessageSquare />

              <span>
                Phản hồi của giảng viên
              </span>
            </div>

            <p>
              {cv.feedback ||
                "Không có nhận xét."}
            </p>
          </div>
        )}

        {/* PENDING */}

        {cv.status === "PENDING" && (
          <div className="cv-feedback-form">
            <label
              htmlFor={`cv-feedback-${cvId}`}
            >
              Nhận xét CV
            </label>

            <textarea
              id={`cv-feedback-${cvId}`}
              value={feedback}
              disabled={processing}
              placeholder="Nhập nhận xét, góp ý cho sinh viên..."
              onChange={(event) =>
                setFeedback(
                  event.target.value
                )
              }
            />

            <div className="cv-review-actions">
              {cv.fileUrl && (
                <a
                  href={cv.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cv-btn cv-btn-outline"
                >
                  <FiEye />
                  Xem CV
                </a>
              )}

              <button
                type="button"
                className="cv-btn cv-btn-reject"
                disabled={processing}
                onClick={handleReject}
              >
                <FiEdit3 />

                Yêu cầu chỉnh sửa
              </button>

              <button
                type="button"
                className="cv-btn cv-btn-approve"
                disabled={processing}
                onClick={handleApprove}
              >
                <FiCheck />

                Chấp nhận CV
              </button>
            </div>
          </div>
        )}

        {/* CV ĐÃ XỬ LÝ */}

        {cv.status !== "PENDING" &&
          cv.fileUrl && (
            <div className="cv-reviewed-actions">
              <a
                href={cv.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="cv-btn cv-btn-outline"
              >
                <FiEye />
                Xem CV
              </a>
            </div>
          )}
      </div>
    </article>
  );
}

export default CvReviewCard;