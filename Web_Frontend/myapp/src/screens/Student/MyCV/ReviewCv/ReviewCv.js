import './ReviewCv.css'

function CvReviewCard({ cv }) {
  const getStatusInfo = (status) => {

    switch (status) {

      case 'APPROVED':
        return {
          text: 'Đã duyệt',
          className: 'approved',
        }

      case 'REJECTED':
        return {
          text: 'Cần chỉnh sửa',
          className: 'rejected',
        }

      default:
        return {
          text: 'Chờ phản hồi',
          className: 'pending',
        }
    }
  }


  const statusInfo = getStatusInfo(cv.status)


  return (
    <article className="cv-review-card">
      <div className="cv-review-icon">
        PDF
      </div>
      <div className="cv-review-content">
        <div className="cv-review-top">

          <div>
            <h3>
              {cv.fileName}
            </h3>

            <p>
              Gửi ngày {cv.sentDate}
            </p>
          </div>


          <span
            className={`cv-review-status ${statusInfo.className}`}
          >
            {statusInfo.text}
          </span>

        </div>
        <div className="cv-review-feedback">

          <span className="feedback-label">
            Nhận xét của giảng viên
          </span>


          {cv.feedback ? (

            <p>
              {cv.feedback}
            </p>

          ) : (

            <p className="waiting-feedback">
              Giảng viên chưa phản hồi CV này.
            </p>

          )}

        </div>


        {/* ================================
            ACTIONS
        ================================= */}
        <div className="cv-review-actions">

          <a
            href={cv.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            Xem CV
          </a>


          {cv.status === 'REJECTED' && (
            <button className="btn btn-primary">
              Gửi bản cập nhật
            </button>
          )}

        </div>

      </div>

    </article>
  )
}

export default CvReviewCard