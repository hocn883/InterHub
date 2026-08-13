import { useState } from 'react'
import './LecturerCvs.css'

function LecturerCvs() {

  const [statusFilter, setStatusFilter] =
    useState('PENDING')

  const [feedbacks, setFeedbacks] =
    useState({})


  // ==========================================
  // DỮ LIỆU GIẢ
  // ==========================================

  const cvs = [
    {
      id: 1,
      studentName: 'Nguyễn Thái Học',
      mssv: '2251012034',
      className: 'DH22IT01',
      fileName: 'CV_NguyenThaiHoc_Backend.pdf',
      fileUrl: '#',
      createdDate: '11/08/2026',
      status: 'PENDING',
      feedback: '',
    },
    {
      id: 2,
      studentName: 'Trần Minh Khang',
      mssv: '2251012041',
      className: 'DH22IT01',
      fileName: 'CV_TranMinhKhang_Frontend.pdf',
      fileUrl: '#',
      createdDate: '10/08/2026',
      status: 'PENDING',
      feedback: '',
    },
    {
      id: 3,
      studentName: 'Lê Hoàng Nam',
      mssv: '2251012056',
      className: 'DH22IT02',
      fileName: 'CV_LeHoangNam_Java.pdf',
      fileUrl: '#',
      createdDate: '08/08/2026',
      status: 'APPROVED',
      feedback:
        'CV trình bày tốt, nội dung phù hợp. Có thể sử dụng để ứng tuyển.',
    },
    {
      id: 4,
      studentName: 'Phạm Gia Huy',
      mssv: '2251012062',
      className: 'DH22IT02',
      fileName: 'CV_PhamGiaHuy.pdf',
      fileUrl: '#',
      createdDate: '07/08/2026',
      status: 'REJECTED',
      feedback:
        'Cần bổ sung kỹ năng chuyên môn và mô tả rõ hơn các project đã thực hiện.',
    },
  ]


  const pendingCount =
    cvs.filter(cv => cv.status === 'PENDING').length

  const approvedCount =
    cvs.filter(cv => cv.status === 'APPROVED').length

  const rejectedCount =
    cvs.filter(cv => cv.status === 'REJECTED').length


  const filteredCvs =
    statusFilter === 'ALL'
      ? cvs
      : cvs.filter(
          cv => cv.status === statusFilter
        )


  const getStatus = status => {

    switch (status) {

      case 'PENDING':
        return 'Chờ duyệt'

      case 'APPROVED':
        return 'Đã duyệt'

      case 'REJECTED':
        return 'Cần chỉnh sửa'

      default:
        return status
    }
  }


  const handleFeedbackChange = (cvId, value) => {

    setFeedbacks(prev => ({
      ...prev,
      [cvId]: value
    }))
  }


  return (
    <div className="lecturer-cvs-page">


      {/* ==============================
          HERO
      ============================== */}

      <section className="lecturer-cvs-hero">

        <div className="page-container">

          <span className="cv-page-badge">
            DUYỆT CV SINH VIÊN
          </span>

          <h1>
            Xem và đánh giá
            <span> CV sinh viên</span>
          </h1>

          <p>
            Kiểm tra CV sinh viên gửi,
            đưa ra nhận xét và xác nhận CV
            trước khi sinh viên sử dụng để ứng tuyển.
          </p>

        </div>

      </section>


      <main className="page-container lecturer-cvs-main">


        {/* ==============================
            STAT
        ============================== */}

        <section className="cv-stat-grid">

          <div className="cv-stat-card">

            <span>Tổng CV</span>

            <strong>
              {cvs.length}
            </strong>

          </div>


          <div className="cv-stat-card">

            <span>Chờ duyệt</span>

            <strong className="pending-number">
              {pendingCount}
            </strong>

          </div>


          <div className="cv-stat-card">

            <span>Đã duyệt</span>

            <strong className="approved-number">
              {approvedCount}
            </strong>

          </div>


          <div className="cv-stat-card">

            <span>Cần chỉnh sửa</span>

            <strong className="rejected-number">
              {rejectedCount}
            </strong>

          </div>

        </section>


        {/* ==============================
            CONTENT
        ============================== */}

        <section className="cv-review-section">


          <div className="cv-review-heading">

            <div>

              <span className="section-label">
                CV SINH VIÊN
              </span>

              <h2>
                Danh sách CV
              </h2>

              <p>
                Xem nội dung và gửi phản hồi
                cho sinh viên.
              </p>

            </div>

          </div>


          {/* ==============================
              FILTER
          ============================== */}

          <div className="cv-filter">

            <button
              className={
                statusFilter === 'ALL'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('ALL')
              }
            >
              Tất cả
              <span>{cvs.length}</span>
            </button>


            <button
              className={
                statusFilter === 'PENDING'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('PENDING')
              }
            >
              Chờ duyệt
              <span>{pendingCount}</span>
            </button>


            <button
              className={
                statusFilter === 'APPROVED'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('APPROVED')
              }
            >
              Đã duyệt
              <span>{approvedCount}</span>
            </button>


            <button
              className={
                statusFilter === 'REJECTED'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('REJECTED')
              }
            >
              Cần chỉnh sửa
              <span>{rejectedCount}</span>
            </button>

          </div>


          {/* ==============================
              CV LIST
          ============================== */}

          <div className="cv-review-list">

            {filteredCvs.map(cv => (

              <article
                className="cv-review-card"
                key={cv.id}
              >


                {/* ==========================
                    LEFT
                ========================== */}

                <div className="cv-file-icon">
                  PDF
                </div>


                {/* ==========================
                    CONTENT
                ========================== */}

                <div className="cv-review-content">


                  <div className="cv-review-top">

                    <div>

                      <h3>
                        {cv.fileName}
                      </h3>

                      <p>
                        {cv.studentName}
                        {' · '}
                        {cv.mssv}
                        {' · '}
                        {cv.className}
                      </p>

                    </div>


                    <span
                      className={
                        `cv-status ${cv.status.toLowerCase()}`
                      }
                    >
                      {getStatus(cv.status)}
                    </span>

                  </div>


                  <div className="cv-date">
                    Gửi ngày {cv.createdDate}
                  </div>


                  {/* ==========================
                      CV ĐÃ REVIEW
                  ========================== */}

                  {cv.status !== 'PENDING' && (

                    <div className="cv-old-feedback">

                      <span>
                        Phản hồi của giảng viên
                      </span>

                      <p>
                        {cv.feedback}
                      </p>

                    </div>

                  )}


                  {/* ==========================
                      CV CHỜ REVIEW
                  ========================== */}

                  {cv.status === 'PENDING' && (

                    <div className="cv-feedback-form">

                      <label>
                        Nhận xét CV
                      </label>

                      <textarea
                        placeholder="Nhập nhận xét, góp ý cho sinh viên..."
                        value={
                          feedbacks[cv.id] || ''
                        }
                        onChange={event =>
                          handleFeedbackChange(
                            cv.id,
                            event.target.value
                          )
                        }
                      />


                      <div className="cv-review-actions">

                        <a
                          href={cv.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline"
                        >
                          Xem CV
                        </a>


                        <button
                          className="btn cv-reject-button"
                        >
                          Yêu cầu chỉnh sửa
                        </button>


                        <button
                          className="btn btn-primary"
                        >
                          Duyệt CV
                        </button>

                      </div>

                    </div>

                  )}


                  {cv.status !== 'PENDING' && (

                    <div className="cv-reviewed-actions">

                      <a
                        href={cv.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                      >
                        Xem CV
                      </a>

                    </div>

                  )}

                </div>

              </article>

            ))}

          </div>

        </section>

      </main>

    </div>
  )
}

export default LecturerCvs