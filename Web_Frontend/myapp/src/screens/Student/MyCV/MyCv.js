import './MyCv.css'
import CvReviewCard from './ReviewCv/ReviewCv'

function MyCv() {

  // ================================
  // DỮ LIỆU GIẢ GIẢNG VIÊN
  // Sau này lấy từ user/student API
  // ================================
  const lecturer = {
    id: 1,
    fullName: 'Nguyễn Văn Minh',
    lecturerCode: 'GV001',
    email: 'minh.nguyen@ou.edu.vn',
    department: 'Khoa Công nghệ thông tin',
  }


  // ================================
  // DỮ LIỆU CV GIẢ
  // Sau này gọi:
  // GET /api/student/cvs
  // ================================
  const cvList = [
    {
      id: 1,
      fileName: 'CV_NguyenThaiHoc_Backend.pdf',
      fileUrl: '#',
      sentDate: '10/08/2026',
      status: 'APPROVED',
      feedback:
        'CV trình bày khá tốt. Em nên bổ sung thêm phần mô tả dự án Spring Boot và làm rõ công nghệ đã sử dụng.',
    },

    {
      id: 2,
      fileName: 'CV_NguyenThaiHoc_Frontend.pdf',
      fileUrl: '#',
      sentDate: '08/08/2026',
      status: 'PENDING',
      feedback: null,
    },

    {
      id: 3,
      fileName: 'CV_NguyenThaiHoc_Old.pdf',
      fileUrl: '#',
      sentDate: '01/08/2026',
      status: 'REJECTED',
      feedback:
        'CV còn thiếu thông tin dự án và kỹ năng chuyên môn. Em chỉnh sửa lại rồi gửi bản mới.',
    },
  ]


  // ================================
  // GỬI CV
  // Sau này có thể mở modal upload
  // ================================
  const handleUploadCv = () => {
    console.log('Upload CV')
  }


  return (
    <div className="lecturer-workspace-page">

      {/* ================================
          HERO
      ================================= */}
      <section className="lecturer-workspace-hero">

        <div className="page-container lecturer-workspace-hero-content">

          <div>
            <span className="lecturer-workspace-badge">
              🎓 HỖ TRỢ THỰC TẬP
            </span>

            <h1>
              Làm việc với
              <span> giảng viên</span>
            </h1>

            <p>
              Gửi CV cho giảng viên phụ trách,
              nhận đánh giá và chỉnh sửa hồ sơ
              trước khi ứng tuyển doanh nghiệp.
            </p>
          </div>


          <button
            className="btn btn-primary"
            onClick={handleUploadCv}
          >
            + Gửi CV cho giảng viên
          </button>

        </div>

      </section>


      {/* ================================
          MAIN
      ================================= */}
      <main className="page-container lecturer-workspace-main">


        {/* ================================
            GIẢNG VIÊN PHỤ TRÁCH
        ================================= */}
        <section className="lecturer-information-section">

          <div className="lecturer-section-heading">
            <div>
              <span>GIẢNG VIÊN PHỤ TRÁCH</span>

              <h2>Giảng viên hướng dẫn của bạn</h2>
            </div>
          </div>


          <div className="lecturer-information-card">

            <div className="lecturer-avatar">
              GV
            </div>


            <div className="lecturer-information">

              <h3>
                {lecturer.fullName}
              </h3>

              <p>
                {lecturer.department}
              </p>


              <div className="lecturer-meta">

                <div>
                  <span>Mã giảng viên</span>
                  <strong>
                    {lecturer.lecturerCode}
                  </strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    {lecturer.email}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            DANH SÁCH CV
        ================================= */}
        <section className="lecturer-cv-section">

          <div className="lecturer-section-heading">

            <div>
              <span>CV ĐÃ GỬI</span>

              <h2>
                Phản hồi từ giảng viên
              </h2>

              <p>
                Theo dõi trạng thái xét duyệt
                và nhận góp ý cho từng CV.
              </p>
            </div>


            <div className="cv-total">
              <strong>{cvList.length}</strong>
              <span>CV đã gửi</span>
            </div>

          </div>


          <div className="lecturer-cv-list">

            {cvList.map((cv) => (
              <CvReviewCard
                key={cv.id}
                cv={cv}
              />
            ))}

          </div>

        </section>

      </main>

    </div>
  )
}

export default MyCv