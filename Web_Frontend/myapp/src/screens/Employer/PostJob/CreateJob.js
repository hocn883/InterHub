import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBriefcase, FiMapPin, FiSend, FiX } from "react-icons/fi";
import { authApi, endpoints } from "../../../utils/api";
import LocationPicker from "../../../screens/Maps/LocationPicker";
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
    latitude: null,
    longitude: null,
    deadline: "",
    startDate: "",
    endDate: "",
  });

  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationConfirm = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      location: locationData.location,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location || formData.latitude === null || formData.longitude === null) {
      alert("Vui lòng chọn địa điểm làm việc trên bản đồ");
      setShowLocationPicker(true);
      return;
    }

    const token = localStorage.getItem("access-token");

    if (!token) {
      navigate("/login");
      return;
    }

    const data = {
      ...formData,
      salary: Number(formData.salary),
      quantity: Number(formData.quantity),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

    console.log("CREATE JOB REQUEST:", data);

    try {
      await authApi(token).post(endpoints.employerJob, data);
      alert("Tạo công việc thành công!");
      navigate("/employer/jobs");
    } catch (err) {
      console.error(err.response);
      alert(err.response?.data?.message || "Không thể tạo công việc");
    }
  };

  return (
    <div className="create-job-page">
      <section className="create-job-hero">
        <div className="page-container create-job-hero-content">
          <div>
            <span className="create-job-badge">
              <FiBriefcase />
              TUYỂN DỤNG
            </span>

            <h1>
              Đăng tin <span>tuyển dụng</span>
            </h1>

            <p>
              Tạo vị trí thực tập mới và tiếp cận sinh viên phù hợp trên hệ thống InternHub.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/employer/jobs")}
          >
            <FiArrowLeft />
            Quản lý tin
          </button>
        </div>
      </section>

      <main className="page-container create-job-main">
        <form className="create-job-form" onSubmit={handleSubmit}>
          <section className="create-job-card">
            <div className="create-job-heading">
              <span>THÔNG TIN CƠ BẢN</span>
              <h2>Thông tin việc làm</h2>
              <p>Nhập những thông tin chính của vị trí đang tuyển.</p>
            </div>

            <div className="job-form-group">
              <label>
                Tên vị trí tuyển dụng <span>*</span>
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
                  Địa điểm làm việc <span>*</span>
                </label>

                <div className="job-location-field">
                  <div
                    className={
                      formData.location
                        ? "job-location-display selected"
                        : "job-location-display"
                    }
                  >
                    <FiMapPin />
                    <span>{formData.location || "Chưa chọn địa điểm"}</span>
                  </div>

                  <button
                    type="button"
                    className="job-map-button"
                    onClick={() => setShowLocationPicker(true)}
                  >
                    <FiMapPin />
                    {formData.location ? "Đổi địa điểm" : "Chọn bản đồ"}
                  </button>
                </div>

                {formData.location && (
                  <div className="job-location-coordinates">
                    <span>Lat: {formData.latitude}</span>
                    <span>Lng: {formData.longitude}</span>
                  </div>
                )}
              </div>

              <div className="job-form-group">
                <label>
                  Mức lương <span>*</span>
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
              <div className="job-form-group">
                <label>
                  Số lượng tuyển <span>*</span>
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
                  Hạn ứng tuyển <span>*</span>
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

          <section className="create-job-card">
            <div className="create-job-heading">
              <span>MÔ TẢ CÔNG VIỆC</span>
              <h2>Mô tả và yêu cầu</h2>
              <p>Giúp sinh viên hiểu rõ công việc và yêu cầu của doanh nghiệp.</p>
            </div>

            <div className="job-form-group">
              <label>
                Mô tả công việc <span>*</span>
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

            <div className="job-form-group">
              <label>Yêu cầu ứng viên</label>

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

          <section className="create-job-card">
            <div className="create-job-heading">
              <span>THỜI GIAN</span>
              <h2>Thời gian thực tập</h2>
            </div>

            <div className="job-form-row">
              <div className="job-form-group">
                <label>
                  Ngày bắt đầu <span>*</span>
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="job-form-group">
                <label>
                  Ngày kết thúc <span>*</span>
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

          <div className="create-job-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/employer/jobs")}
            >
              <FiX />
              Hủy
            </button>

            <button type="submit" className="btn btn-primary">
              <FiSend />
              Đăng tin tuyển dụng
            </button>
          </div>
        </form>
      </main>

      <LocationPicker
        open={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        value={{
          location: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }}
        onConfirm={handleLocationConfirm}
      />
    </div>
  );
}

export default CreateJob;