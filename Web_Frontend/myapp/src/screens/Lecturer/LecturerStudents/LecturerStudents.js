import { useState } from 'react'
import { Link } from 'react-router-dom'
import './LecturerStudents.css'

function LecturerStudents() {

  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')


  // ==========================================
  // DỮ LIỆU GIẢ
  // Sau này thay bằng API lấy sinh viên
  // của giảng viên đang đăng nhập
  // ==========================================

  const students = [
    {
      id: 1,
      fullName: 'Nguyễn Thái Học',
      mssv: '2251012034',
      className: 'DH22IT01',
      major: 'Công nghệ thông tin',
      status: 'TIM_VIEC',
      cvCount: 3,
      applicationCount: 5,
      companyName: null,
    },
    {
      id: 2,
      fullName: 'Trần Minh Khang',
      mssv: '2251012041',
      className: 'DH22IT01',
      major: 'Công nghệ thông tin',
      status: 'DANG_THUC_TAP',
      cvCount: 2,
      applicationCount: 7,
      companyName: 'FPT Software',
    },
    {
      id: 3,
      fullName: 'Lê Hoàng Nam',
      mssv: '2251012056',
      className: 'DH22IT02',
      major: 'Khoa học máy tính',
      status: 'TIM_VIEC',
      cvCount: 1,
      applicationCount: 3,
      companyName: null,
    },
    {
      id: 4,
      fullName: 'Phạm Gia Huy',
      mssv: '2251012062',
      className: 'DH22IT02',
      major: 'Công nghệ thông tin',
      status: 'HOAN_THANH',
      cvCount: 4,
      applicationCount: 8,
      companyName: 'VNG Corporation',
    },
    {
      id: 5,
      fullName: 'Võ Minh Anh',
      mssv: '2251012070',
      className: 'DH22IT03',
      major: 'Công nghệ thông tin',
      status: 'DANG_THUC_TAP',
      cvCount: 2,
      applicationCount: 6,
      companyName: 'TMA Solutions',
    },
  ]


  // ==========================================
  // ĐẾM THEO TRẠNG THÁI
  // ==========================================

  const findingCount = students.filter(
    student => student.status === 'TIM_VIEC'
  ).length

  const internshipCount = students.filter(
    student => student.status === 'DANG_THUC_TAP'
  ).length

  const completedCount = students.filter(
    student => student.status === 'HOAN_THANH'
  ).length


  // ==========================================
  // LỌC DANH SÁCH
  // ==========================================

  const filteredStudents = students.filter(student => {

    const searchText = keyword.toLowerCase()

    const matchKeyword =
      student.fullName.toLowerCase().includes(searchText) ||
      student.mssv.includes(keyword)

    const matchStatus =
      statusFilter === 'ALL' ||
      student.status === statusFilter

    return matchKeyword && matchStatus
  })


  // ==========================================
  // HIỂN THỊ STATUS
  // ==========================================

  const getStatus = (status) => {

    switch (status) {

      case 'TIM_VIEC':
        return {
          label: 'Đang tìm việc',
          className: 'finding'
        }

      case 'DANG_THUC_TAP':
        return {
          label: 'Đang thực tập',
          className: 'internship'
        }

      case 'HOAN_THANH':
        return {
          label: 'Đã hoàn thành',
          className: 'completed'
        }

      default:
        return {
          label: status,
          className: ''
        }
    }
  }


  return (
    <div className="lecturer-students-page">


      {/* ==============================
          HERO
      ============================== */}

      <section className="lecturer-students-hero">

        <div className="page-container">

          <span className="lecturer-page-badge">
            SINH VIÊN PHỤ TRÁCH
          </span>

          <h1>
            Quản lý sinh viên
            <span> thực tập</span>
          </h1>

          <p>
            Theo dõi quá trình tìm kiếm việc làm,
            ứng tuyển và thực tập của các sinh viên
            được phân công phụ trách.
          </p>

        </div>

      </section>


      <main className="page-container lecturer-students-main">


        {/* ==============================
            THỐNG KÊ
        ============================== */}

        <section className="student-stat-grid">

          <div className="student-stat-card">

            <div className="student-stat-icon">
              👨‍🎓
            </div>

            <div>
              <span>Tổng sinh viên</span>
              <strong>{students.length}</strong>
            </div>

          </div>


          <div className="student-stat-card">

            <div className="student-stat-icon finding">
              🔎
            </div>

            <div>
              <span>Đang tìm việc</span>
              <strong>{findingCount}</strong>
            </div>

          </div>


          <div className="student-stat-card">

            <div className="student-stat-icon internship">
              💼
            </div>

            <div>
              <span>Đang thực tập</span>
              <strong>{internshipCount}</strong>
            </div>

          </div>


          <div className="student-stat-card">

            <div className="student-stat-icon completed">
              ✓
            </div>

            <div>
              <span>Đã hoàn thành</span>
              <strong>{completedCount}</strong>
            </div>

          </div>

        </section>


        {/* ==============================
            DANH SÁCH
        ============================== */}

        <section className="student-list-card">


          {/* HEADER */}

          <div className="student-list-heading">

            <div>

              <span className="section-label">
                DANH SÁCH SINH VIÊN
              </span>

              <h2>
                Sinh viên được phân công
              </h2>

              <p>
                {filteredStudents.length} sinh viên
                đang được hiển thị
              </p>

            </div>


            {/* SEARCH */}

            <div className="student-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Tìm tên hoặc MSSV..."
                value={keyword}
                onChange={
                  event =>
                    setKeyword(event.target.value)
                }
              />

            </div>

          </div>


          {/* ==============================
              FILTER
          ============================== */}

          <div className="student-filter">

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
              <span>{students.length}</span>
            </button>


            <button
              className={
                statusFilter === 'TIM_VIEC'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('TIM_VIEC')
              }
            >
              Đang tìm việc
              <span>{findingCount}</span>
            </button>


            <button
              className={
                statusFilter === 'DANG_THUC_TAP'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('DANG_THUC_TAP')
              }
            >
              Đang thực tập
              <span>{internshipCount}</span>
            </button>


            <button
              className={
                statusFilter === 'HOAN_THANH'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('HOAN_THANH')
              }
            >
              Hoàn thành
              <span>{completedCount}</span>
            </button>

          </div>


          {/* ==============================
              TABLE
          ============================== */}

          <div className="student-table">

            <div className="student-table-header">

              <span>Sinh viên</span>
              <span>MSSV / Lớp</span>
              <span>Trạng thái</span>
              <span>CV</span>
              <span>Ứng tuyển</span>
              <span>Nơi thực tập</span>
              <span></span>

            </div>


            {filteredStudents.map(student => {

              const status =
                getStatus(student.status)

              return (

                <div
                  className="student-table-row"
                  key={student.id}
                >


                  {/* SINH VIÊN */}

                  <div className="student-user">

                    <div className="student-avatar">
                      {student.fullName.charAt(0)}
                    </div>

                    <div>

                      <strong>
                        {student.fullName}
                      </strong>

                      <span>
                        {student.major}
                      </span>

                    </div>

                  </div>


                  {/* MSSV */}

                  <div className="student-school">

                    <strong>
                      {student.mssv}
                    </strong>

                    <span>
                      {student.className}
                    </span>

                  </div>


                  {/* STATUS */}

                  <div>

                    <span
                      className={
                        `student-status ${status.className}`
                      }
                    >
                      {status.label}
                    </span>

                  </div>


                  {/* CV */}

                  <div className="student-number">

                    <strong>
                      {student.cvCount}
                    </strong>

                    <span>CV</span>

                  </div>


                  {/* APPLICATION */}

                  <div className="student-number">

                    <strong>
                      {student.applicationCount}
                    </strong>

                    <span>đơn</span>

                  </div>


                  {/* COMPANY */}

                  <div className="student-company">

                    {student.companyName ? (

                      <>
                        <strong>
                          {student.companyName}
                        </strong>

                        <span>
                          Đang thực tập
                        </span>
                      </>

                    ) : (

                      <span className="no-company">
                        Chưa có
                      </span>

                    )}

                  </div>


                  {/* DETAIL */}

                  <Link
                    to={`/lecturer/students/${student.id}`}
                    className="student-detail-link"
                  >
                    Chi tiết →
                  </Link>

                </div>

              )
            })}


            {filteredStudents.length === 0 && (

              <div className="student-empty">

                <h3>
                  Không tìm thấy sinh viên
                </h3>

                <p>
                  Không có sinh viên phù hợp
                  với điều kiện tìm kiếm.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  )
}

export default LecturerStudents