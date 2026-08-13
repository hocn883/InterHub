import { useState } from 'react'
import { Link } from 'react-router-dom'
import './EmployerJobs.css'

function EmployerJobs() {

  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('ALL')


  // ==========================================
  // DỮ LIỆU GIẢ
  // Sau này:
  // GET /api/jobs/employer/myjobs
  // ==========================================
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Java Spring Boot Intern',
      location: 'TP. Hồ Chí Minh',
      salary: '5 - 7 triệu',
      quantity: 3,
      deadline: '30/08/2026',
      status: 'OPEN',
      applicationCount: 16,
      createdDate: '05/08/2026',
    },
    {
      id: 2,
      title: 'Frontend ReactJS Intern',
      location: 'TP. Hồ Chí Minh',
      salary: '4 - 6 triệu',
      quantity: 2,
      deadline: '28/08/2026',
      status: 'OPEN',
      applicationCount: 21,
      createdDate: '01/08/2026',
    },
    {
      id: 3,
      title: 'Mobile Developer Intern',
      location: 'Quận 3, TP. Hồ Chí Minh',
      salary: '4 - 5 triệu',
      quantity: 2,
      deadline: '15/08/2026',
      status: 'CLOSED',
      applicationCount: 8,
      createdDate: '20/07/2026',
    },
    {
      id: 4,
      title: 'QA Tester Intern',
      location: 'Quận 1, TP. Hồ Chí Minh',
      salary: '3 - 5 triệu',
      quantity: 4,
      deadline: '20/08/2026',
      status: 'COMPLETED',
      applicationCount: 12,
      createdDate: '18/07/2026',
    },
  ])


  // ==========================================
  // COUNT
  // ==========================================
  const openCount =
    jobs.filter(
      job => job.status === 'OPEN'
    ).length


  const closedCount =
    jobs.filter(
      job => job.status === 'CLOSED'
    ).length


  const completedCount =
    jobs.filter(
      job => job.status === 'COMPLETED'
    ).length


  const totalApplications =
    jobs.reduce(
      (total, job) =>
        total + job.applicationCount,
      0
    )


  // ==========================================
  // FILTER
  // ==========================================
  const filteredJobs =
    jobs.filter(job => {

      const matchKeyword =
        job.title
          .toLowerCase()
          .includes(keyword.toLowerCase())


      const matchStatus =
        statusFilter === 'ALL'
        ||
        job.status === statusFilter


      return matchKeyword && matchStatus
    })


  // ==========================================
  // STATUS
  // ==========================================
  const getStatusInfo = status => {

    switch (status) {

      case 'OPEN':
        return {
          label: 'Đang tuyển',
          className: 'open',
        }

      case 'CLOSED':
        return {
          label: 'Đã đóng',
          className: 'closed',
        }

      case 'COMPLETED':
        return {
          label: 'Hoàn thành',
          className: 'completed',
        }

      default:
        return {
          label: status,
          className: '',
        }
    }
  }


  // ==========================================
  // DELETE
  // Sau này:
  // DELETE /api/jobs/{jobId}
  // ==========================================
  const handleDelete = jobId => {

    const confirmed =
      window.confirm(
        'Bạn có chắc muốn xóa tin tuyển dụng này?'
      )


    if (!confirmed) {
      return
    }


    setJobs(
      jobs.filter(
        job => job.id !== jobId
      )
    )
  }


  return (
    <div className="employer-jobs-page">


      {/* ======================================
          HERO
      ====================================== */}

      <section className="employer-jobs-hero">

        <div className="page-container employer-jobs-hero-content">

          <div>

            <span className="employer-jobs-badge">
              💼 TUYỂN DỤNG
            </span>


            <h1>
              Quản lý tin
              <span> tuyển dụng</span>
            </h1>


            <p>
              Theo dõi các vị trí đã đăng,
              quản lý ứng viên và cập nhật
              thông tin tuyển dụng.
            </p>

          </div>


          <Link
            to="/employer/jobs/create"
            className="btn btn-primary"
          >
            + Đăng tin mới
          </Link>

        </div>

      </section>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="page-container employer-jobs-main">


        {/* ======================================
            STATISTICS
        ====================================== */}

        <section className="employer-job-statistics">


          <div className="employer-job-stat">

            <span>
              Tổng tin tuyển dụng
            </span>

            <strong>
              {jobs.length}
            </strong>

          </div>


          <div className="employer-job-stat">

            <span>
              Đang tuyển
            </span>

            <strong className="job-stat-open">
              {openCount}
            </strong>

          </div>


          <div className="employer-job-stat">

            <span>
              Đã hoàn thành
            </span>

            <strong className="job-stat-completed">
              {completedCount}
            </strong>

          </div>


          <div className="employer-job-stat">

            <span>
              Tổng ứng viên
            </span>

            <strong className="job-stat-application">
              {totalApplications}
            </strong>

          </div>

        </section>


        {/* ======================================
            CONTENT
        ====================================== */}

        <section className="employer-job-content">


          {/* HEADING */}

          <div className="employer-job-heading">

            <div>

              <span className="section-label">
                TIN ĐÃ ĐĂNG
              </span>

              <h2>
                Danh sách tuyển dụng
              </h2>

              <p>
                {filteredJobs.length} tin
                đang được hiển thị
              </p>

            </div>


            {/* SEARCH */}

            <div className="employer-job-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Tìm tin tuyển dụng..."
                value={keyword}
                onChange={
                  event =>
                    setKeyword(
                      event.target.value
                    )
                }
              />

            </div>

          </div>


          {/* ======================================
              FILTER
          ====================================== */}

          <div className="employer-job-filter">

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
              <span>{jobs.length}</span>
            </button>


            <button
              className={
                statusFilter === 'OPEN'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('OPEN')
              }
            >
              Đang tuyển
              <span>{openCount}</span>
            </button>


            <button
              className={
                statusFilter === 'CLOSED'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('CLOSED')
              }
            >
              Đã đóng
              <span>{closedCount}</span>
            </button>


            <button
              className={
                statusFilter === 'COMPLETED'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setStatusFilter('COMPLETED')
              }
            >
              Hoàn thành
              <span>{completedCount}</span>
            </button>

          </div>


          {/* ======================================
              JOB LIST
          ====================================== */}

          <div className="employer-job-list">

            {filteredJobs.map(job => {

              const status =
                getStatusInfo(job.status)


              return (

                <article
                  className="employer-job-card"
                  key={job.id}
                >


                  {/* ==========================
                      TOP
                  ========================== */}

                  <div className="employer-job-card-top">

                    <div>

                      <div className="employer-job-title-row">

                        <Link
                          to={`/jobs/${job.id}`}
                          className="employer-job-title"
                        >
                          {job.title}
                        </Link>


                        <span
                          className={
                            `employer-job-status ${status.className}`
                          }
                        >
                          {status.label}
                        </span>

                      </div>


                      <p>
                        Đăng ngày {job.createdDate}
                      </p>

                    </div>


                    <div className="job-application-summary">

                      <strong>
                        {job.applicationCount}
                      </strong>

                      <span>
                        ứng viên
                      </span>

                    </div>

                  </div>


                  {/* ==========================
                      JOB INFO
                  ========================== */}

                  <div className="employer-job-info">

                    <div>

                      <span>
                        Địa điểm
                      </span>

                      <strong>
                        {job.location}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Mức lương
                      </span>

                      <strong>
                        {job.salary}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Số lượng
                      </span>

                      <strong>
                        {job.quantity} sinh viên
                      </strong>

                    </div>


                    <div>

                      <span>
                        Hạn ứng tuyển
                      </span>

                      <strong>
                        {job.deadline}
                      </strong>

                    </div>

                  </div>


                  {/* ==========================
                      ACTION
                  ========================== */}

                  <div className="employer-job-actions">


                    {/* Xem job ngoài public */}

                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn btn-outline"
                    >
                      Xem tin
                    </Link>


                    {/* Xem Application */}

                    <Link
                      to={`/employer/jobs/${job.id}/applications`}
                      className="btn btn-primary"
                    >
                      Ứng viên
                      <span>
                        {job.applicationCount}
                      </span>
                    </Link>


                    {/* EDIT */}

                    <Link
                      to={`/employer/jobs/${job.id}/edit`}
                      className="job-edit-button"
                    >
                      ✎ Sửa
                    </Link>


                    {/* DELETE */}

                    <button
                      type="button"
                      className="job-delete-button"
                      onClick={() =>
                        handleDelete(job.id)
                      }
                    >
                      🗑 Xóa
                    </button>

                  </div>

                </article>

              )
            })}


            {filteredJobs.length === 0 && (

              <div className="employer-job-empty">

                <h3>
                  Không có tin tuyển dụng
                </h3>

                <p>
                  Không tìm thấy tin phù hợp
                  với điều kiện hiện tại.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  )
}

export default EmployerJobs