import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints, authApi } from "../../../utils/api";

import "./CreateJob.css";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    quantity: 1,
    location: "",
    deadline: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("access-token");

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }

    const data = {
      ...formData,
      salary: Number(formData.salary),
      quantity: Number(formData.quantity),
    };

    try {
      const res = await authApi(token).post(
        endpoints.employerJob,
        data
      );

      console.log("Job created:", res.data);

      alert("Tạo công việc thành công!");

      navigate("/employer/jobs");

    } catch (error) {
      console.error("Create job error:", error);

      console.log(
        "Server error:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Tạo công việc thất bại!"
      );
    }
  };

  return (
    <div className="create-job-page">

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
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/employer/jobs")}
          >
            ← Quản lý tin
          </button>

        </div>
      </section>


      <main className="page-container create-job-main">

        <form
          className="create-job-form"
          onSubmit={handleSubmit}
        >

          {/* THÔNG TIN CƠ BẢN */}

          <section className="create-job-card">

            <div className="create-job-heading">
              <span>THÔNG TIN CƠ BẢN</span>

              <h2>
                Thông tin việc làm
              </h2>

              <p>
                Nhập những thông tin chính của
                vị trí đang tuyển.
              </p>
            </div>


            {/* TITLE */}

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

              {/* LOCATION */}

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


              {/* SALARY */}

              <div className="job-form-group">

                <label>
                  Mức lương
                  <span>*</span>
                </label>

                <input
                  type="number"
                  name="salary"
                  placeholder="5000000"
                  min="0"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="job-form-row">

              {/* QUANTITY */}

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


              {/* DEADLINE */}

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


          {/* MÔ TẢ */}

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


            {/* DESCRIPTION */}

            <div className="job-form-group">

              <label>
                Mô tả công việc
                <span>*</span>
              </label>

              <textarea
                name="description"
                rows="8"
                placeholder={`Ví dụ:
- Tham gia phát triển hệ thống Backend
- Xây dựng REST API
- Làm việc với MySQL
- Hỗ trợ kiểm thử và sửa lỗi`}
                value={formData.description}
                onChange={handleChange}
                required
              />

            </div>


            {/* REQUIREMENTS */}

            <div className="job-form-group">

              <label>
                Yêu cầu ứng viên
              </label>

              <textarea
                name="requirements"
                rows="8"
                placeholder={`Ví dụ:
- Sinh viên ngành CNTT
- Có kiến thức Java
- Biết Spring Boot là lợi thế
- Có khả năng làm việc nhóm`}
                value={formData.requirements}
                onChange={handleChange}
              />

            </div>

          </section>


          {/* THỜI GIAN */}

          <section className="create-job-card">

            <div className="create-job-heading">

              <span>THỜI GIAN</span>

              <h2>
                Thời gian thực tập
              </h2>

            </div>


            <div className="job-form-row">

              {/* START DATE */}

              <div className="job-form-group">

                <label>
                  Ngày bắt đầu
                  <span>*</span>
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* END DATE */}

              <div className="job-form-group">

                <label>
                  Ngày kết thúc
                  <span>*</span>
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </section>


          {/* BUTTON */}

          <div className="create-job-actions">

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/employer/jobs")}
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
  );
}

export default CreateJob;