import './profile.css'

function Profile({ currentUser }) {

  // =========================================
  // ROLE LABEL
  // =========================================
  const getRoleLabel = (role) => {
    switch (role) {
      case 'STUDENT':
        return 'Sinh viên'

      case 'LECTURER':
        return 'Giảng viên'

      case 'EMPLOYER':
        return 'Nhà tuyển dụng'

      case 'ADMIN':
        return 'Quản trị viên'

      default:
        return 'Người dùng'
    }
  }


  // =========================================
  // GENDER LABEL
  // =========================================
  const getGenderLabel = (gender) => {
    switch (gender) {
      case 'MALE':
        return 'Nam'

      case 'FEMALE':
        return 'Nữ'

      default:
        return 'Khác'
    }
  }


  // =========================================
  // STUDENT STATUS
  // =========================================
  const getStudentStatus = (status) => {
    switch (status) {
      case 'TIM_VIEC':
        return 'Đang tìm việc'

      case 'DANG_THUC_TAP':
        return 'Đang thực tập'

      case 'HOAN_THANH':
        return 'Đã hoàn thành'

      default:
        return status
    }
  }


  // =========================================
  // EMPLOYER STATUS
  // =========================================
  const getEmployerStatus = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'Đã được duyệt'

      case 'PENDING':
        return 'Chờ duyệt'

      case 'REJECTED':
        return 'Không được duyệt'

      default:
        return status
    }
  }


  // =========================================
  // AVATAR TEXT
  // =========================================
  const getAvatarText = () => {
    if (!currentUser?.fullName) {
      return 'U'
    }

    return currentUser.fullName
      .charAt(0)
      .toUpperCase()
  }


  return (
    <div className="profile-page">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="profile-hero">

        <div className="page-container">

          <span className="profile-badge">
            👤 TÀI KHOẢN CỦA TÔI
          </span>

          <h1>
            Hồ sơ
            <span> cá nhân</span>
          </h1>

          <p>
            Quản lý thông tin tài khoản và hồ sơ
            cá nhân trên hệ thống InternHub.
          </p>

        </div>

      </section>


      {/* =====================================
          MAIN
      ====================================== */}

      <main className="page-container profile-main">


        {/* =====================================
            OVERVIEW
        ====================================== */}

        <section className="profile-overview">

          <div className="profile-avatar">

            {currentUser?.avatarUrl ? (

              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
              />

            ) : (

              <span>
                {getAvatarText()}
              </span>

            )}

          </div>


          <div className="profile-overview-content">

            <div className="profile-name-row">

              <div>

                <h2>
                  {currentUser?.fullName}
                </h2>

                <span className="profile-role">
                  {getRoleLabel(currentUser?.role)}
                </span>

              </div>


              <button className="btn btn-primary">
                Chỉnh sửa hồ sơ
              </button>

            </div>


            <div className="profile-contact-row">

              <span>
                ✉ {currentUser?.email}
              </span>

              <span>
                ☎ {currentUser?.phone}
              </span>

              <span>
                👤 @{currentUser?.username}
              </span>

            </div>

          </div>

        </section>


        {/* =====================================
            THÔNG TIN CHUNG
        ====================================== */}

        <section className="profile-card">

          <div className="profile-section-heading">

            <span>
              THÔNG TIN CHUNG
            </span>

            <h2>
              Thông tin tài khoản
            </h2>

            <p>
              Các thông tin cơ bản của tài khoản.
            </p>

          </div>


          <div className="profile-info-grid">

            <div className="profile-info-item">

              <span>
                Họ và tên
              </span>

              <strong>
                {currentUser?.fullName}
              </strong>

            </div>


            <div className="profile-info-item">

              <span>
                Tên đăng nhập
              </span>

              <strong>
                {currentUser?.username}
              </strong>

            </div>


            <div className="profile-info-item">

              <span>
                Email
              </span>

              <strong>
                {currentUser?.email}
              </strong>

            </div>


            <div className="profile-info-item">

              <span>
                Số điện thoại
              </span>

              <strong>
                {currentUser?.phone}
              </strong>

            </div>


            <div className="profile-info-item">

              <span>
                Giới tính
              </span>

              <strong>
                {getGenderLabel(currentUser?.gender)}
              </strong>

            </div>


            <div className="profile-info-item">

              <span>
                Vai trò
              </span>

              <strong>
                {getRoleLabel(currentUser?.role)}
              </strong>

            </div>

          </div>

        </section>


        {/* =====================================
            STUDENT
        ====================================== */}

        {currentUser?.role === 'STUDENT' && (

          <section className="profile-card">

            <div className="profile-section-heading">

              <span>
                THÔNG TIN SINH VIÊN
              </span>

              <h2>
                Thông tin học tập
              </h2>

            </div>


            <div className="profile-info-grid">

              <div className="profile-info-item">

                <span>
                  MSSV
                </span>

                <strong>
                  {currentUser.mssv}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Chuyên ngành
                </span>

                <strong>
                  {currentUser.major}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Lớp
                </span>

                <strong>
                  {currentUser.className}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Trạng thái thực tập
                </span>

                <strong className="profile-green-text">
                  {getStudentStatus(
                    currentUser.status
                  )}
                </strong>

              </div>

            </div>


            {/* =================================
                GIẢNG VIÊN PHỤ TRÁCH
            ================================= */}

            {currentUser.lecturer && (

              <div className="profile-lecturer-card">

                <div className="profile-lecturer-avatar">
                  GV
                </div>


                <div className="profile-lecturer-content">

                  <span>
                    Giảng viên phụ trách
                  </span>

                  <strong>
                    {
                      currentUser
                        .lecturer
                        .fullName
                    }
                  </strong>

                  <p>
                    {
                      currentUser
                        .lecturer
                        .lecturerCode
                    }
                  </p>

                </div>


                <a
                  href="/myCv"
                  className="btn btn-outline"
                >
                  Làm việc với giảng viên
                </a>

              </div>

            )}

          </section>

        )}


        {/* =====================================
            LECTURER
        ====================================== */}

        {currentUser?.role === 'LECTURER' && (

          <section className="profile-card">

            <div className="profile-section-heading">

              <span>
                THÔNG TIN GIẢNG VIÊN
              </span>

              <h2>
                Thông tin giảng viên
              </h2>

            </div>


            <div className="profile-info-grid">

              <div className="profile-info-item">

                <span>
                  Mã giảng viên
                </span>

                <strong>
                  {currentUser.lecturerCode}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Sinh viên phụ trách
                </span>

                <strong>
                  {currentUser.studentCount ?? 0}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  CV đang chờ duyệt
                </span>

                <strong>
                  {currentUser.pendingCvCount ?? 0}
                </strong>

              </div>

            </div>


            <div className="profile-role-actions">

              <a
                href="/lecturer/students"
                className="btn btn-primary"
              >
                Quản lý sinh viên
              </a>


              <a
                href="/lecturer/cvs"
                className="btn btn-outline"
              >
                Duyệt CV
              </a>

            </div>

          </section>

        )}


        {/* =====================================
            EMPLOYER
        ====================================== */}

        {currentUser?.role === 'EMPLOYER' && (

          <section className="profile-card">

            <div className="profile-section-heading">

              <span>
                THÔNG TIN DOANH NGHIỆP
              </span>

              <h2>
                Hồ sơ doanh nghiệp
              </h2>

            </div>


            <div className="profile-info-grid">

              <div className="profile-info-item">

                <span>
                  Tên doanh nghiệp
                </span>

                <strong>
                  {currentUser.companyName}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Mã số thuế
                </span>

                <strong>
                  {currentUser.taxCode}
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Trạng thái
                </span>

                <strong
                  className={
                    `employer-profile-status ${
                      currentUser.status
                        ?.toLowerCase()
                    }`
                  }
                >
                  {
                    getEmployerStatus(
                      currentUser.status
                    )
                  }
                </strong>

              </div>


              <div className="profile-info-item">

                <span>
                  Tin tuyển dụng
                </span>

                <strong>
                  {currentUser.jobCount ?? 0}
                </strong>

              </div>

            </div>


            <div className="profile-role-actions">

              <a
                href="/employer/jobs"
                className="btn btn-outline"
              >
                Quản lý tin tuyển dụng
              </a>

            </div>

          </section>

        )}


        {/* =====================================
            ADMIN
        ====================================== */}

        {currentUser?.role === 'ADMIN' && (

          <section className="profile-card">

            <div className="profile-section-heading">

              <span>
                QUẢN TRỊ VIÊN
              </span>

              <h2>
                Thông tin quản trị
              </h2>

            </div>


            <div className="profile-info-grid">

              <div className="profile-info-item">

                <span>
                  Quyền hệ thống
                </span>

                <strong>
                  Quản trị viên
                </strong>

              </div>

            </div>

          </section>

        )}


        {/* =====================================
            SECURITY
        ====================================== */}

        <section className="profile-card">

          <div className="profile-section-heading">

            <span>
              BẢO MẬT
            </span>

            <h2>
              Tài khoản và mật khẩu
            </h2>

          </div>


          <div className="profile-security">

            <div>

              <strong>
                Mật khẩu
              </strong>

              <span>
                ••••••••••••
              </span>

            </div>


            <button className="btn btn-outline">
              Đổi mật khẩu
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Profile