import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateJob.css'

function CreateJob() {

  const navigate = useNavigate()

  // ==========================================
  // FORM ĐĂNG TIN
  // Sau này gửi POST /api/jobs
  // ==========================================
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    deadline: '',
    salary: '',
    startDate: '',
    endDate: '',
    quantity: 1,
    location: '',
  })


  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleChange = (event) => {

    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }


  // ==========================================
  // SUBMIT
  // ==========================================
  const handleSubmit = (event) => {

    event.preventDefault()

    console.log('Job request:', formData)

    /*
      Sau này:

      axios.post(
        '/api/jobs',
        formData
      )
      .then(() => {
        navigate('/employer/jobs')
      })
    */
  }


  return (
    <div className="create-job-page">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="create-job-hero">

        <div className="page-container create-job-hero-content">

          <div>

            <span className="create-job-badge">
              💼 TUYỂN DỤNG
            </span>

            <h1>
              Đăng tin
              <span> tuyển dụng</span>
            </h1>

            <p>
              Tạo vị trí thực tập mới và tiếp cận
              sinh viên phù hợp trên hệ thống InternHub.
            </p>

          </div>


          <button
            className="btn btn-outline"
            onClick={() =>
              navigate('/employer/jobs')
            }
          >
            ← Quản lý tin
          </button>

        </div>

      </section>


      {/* =====================================
          MAIN
      ====================================== */}

      <main className="page-container create-job-main">

        <form
          className="create-job-form"
          onSubmit={handleSubmit}
        >


          {/* =====================================
              THÔNG TIN CƠ BẢN
          ====================================== */}

          <section className="create-job-card">

            <div className="create-job-heading">

              <span>
                THÔNG TIN CƠ BẢN
              </span>

              <h2>
                Thông tin việc làm
              </h2>

              <p>
                Nhập những thông tin chính của
                vị trí đang tuyển.
              </p>

            </div>


            <div className="job-form-group">

              <label>
                Tên vị trí tuyển dụng
                <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                placeholder="Ví dụ: Java Spring Boot Intern"
                value={formData.title}
                onChange={handleChange}
                required
              />

            </div>


            <div className="job-form-row">

              <div className="job-form-group">

                <label>
                  Địa điểm làm việc
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="TP. Hồ Chí Minh"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="job-form-group">

                <label>
                  Mức lương
                </label>

                <input
                  type="number"
                  name="salary"
                  placeholder="5000000"
                  value={formData.salary}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="job-form-row">

              <div className="job-form-group">

                <label>
                  Số lượng tuyển
                  <span>*</span>
                </label>

                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="job-form-group">

                <label>
                  Hạn ứng tuyển
                  <span>*</span>
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </section>


          {/* =====================================
              NỘI DUNG
          ====================================== */}

          <section className="create-job-card">

            <div className="create-job-heading">

              <span>
                MÔ TẢ CÔNG VIỆC
              </span>

              <h2>
                Mô tả và yêu cầu
              </h2>

              <p>
                Giúp sinh viên hiểu rõ công việc
                và yêu cầu của doanh nghiệp.
              </p>

            </div>


            <div className="job-form-group">

              <label>
                Mô tả công việc
                <span>*</span>
              </label>

              <textarea
                name="description"
                rows="8"
                placeholder={
                  `Ví dụ:
- Tham gia phát triển hệ thống Backend
- Xây dựng REST API
- Làm việc với MySQL
- Hỗ trợ kiểm thử và sửa lỗi`
                }
                value={formData.description}
                onChange={handleChange}
                required
              />

            </div>


            <div className="job-form-group">

              <label>
                Yêu cầu ứng viên
                <span>*</span>
              </label>

              <textarea
                name="requirements"
                rows="8"
                placeholder={
                  `Ví dụ:
- Sinh viên ngành CNTT
- Có kiến thức Java
- Biết Spring Boot là lợi thế
- Có khả năng làm việc nhóm`
                }
                value={formData.requirements}
                onChange={handleChange}
                required
              />

            </div>

          </section>


          {/* =====================================
              THỜI GIAN THỰC TẬP
          ====================================== */}

          <section className="create-job-card">

            <div className="create-job-heading">

              <span>
                THỜI GIAN
              </span>

              <h2>
                Thời gian thực tập
              </h2>

            </div>


            <div className="job-form-row">

              <div className="job-form-group">

                <label>
                  Ngày bắt đầu
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />

              </div>


              <div className="job-form-group">

                <label>
                  Ngày kết thúc
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>


          {/* =====================================
              ACTION
          ====================================== */}

          <div className="create-job-actions">

            <button
              type="button"
              className="btn btn-outline"
              onClick={() =>
                navigate('/employer/jobs')
              }
            >
              Hủy
            </button>


            <button
              type="submit"
              className="btn btn-primary"
            >
              Đăng tin tuyển dụng
            </button>

          </div>

        </form>

      </main>

    </div>
  )
}

export default CreateJob