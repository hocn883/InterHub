import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    role: "STUDENT",

    // Student
    mssv: "",
    major: "",
    className: "",

    // Lecturer
    lecturerCode: "",

    // Employer
    companyName: "",
    taxCode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("REGISTER:", formData);

    // Sau này:
    // POST /api/auth/register

    // Thành công:
    // navigate("/login");
  };

  return (
    <div className="auth-page auth-register-page">

      <div className="auth-decoration auth-decoration-one"></div>
      <div className="auth-decoration auth-decoration-two"></div>

      <div className="auth-container auth-register-container">

        {/* ================= LEFT ================= */}

        <section className="auth-introduction">

          <Link to="/" className="auth-brand">

            <div className="auth-brand-logo">
              IH
            </div>

            <div className="auth-brand-name">
              <strong>InternHub</strong>
              <span>OU - Faculty of Information Technology</span>
            </div>

          </Link>


          <div className="auth-intro-content">

            <div className="auth-badge">
              🎓 KHOA CÔNG NGHỆ THÔNG TIN
            </div>

            <h1>
              Bắt đầu hành trình
              <span>thực tập của bạn</span>
            </h1>

            <p className="auth-description">
              Tạo tài khoản InternHub để kết nối sinh viên,
              giảng viên và doanh nghiệp trên một nền tảng
              hỗ trợ thực tập thống nhất.
            </p>


            <div className="auth-school">

              <div className="auth-school-logo">
                OU
              </div>

              <div>
                <span>
                  TRƯỜNG ĐẠI HỌC MỞ TP.HCM
                </span>

                <strong>
                  Khoa Công nghệ Thông tin
                </strong>
              </div>

            </div>


            <div className="auth-features">

              <div className="auth-feature">

                <div className="auth-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Sinh viên
                  </strong>

                  <span>
                    Tìm việc, quản lý CV và ứng tuyển
                  </span>
                </div>

              </div>


              <div className="auth-feature">

                <div className="auth-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Giảng viên
                  </strong>

                  <span>
                    Theo dõi và hỗ trợ sinh viên thực tập
                  </span>
                </div>

              </div>


              <div className="auth-feature">

                <div className="auth-feature-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Doanh nghiệp
                  </strong>

                  <span>
                    Đăng tuyển và tiếp cận sinh viên phù hợp
                  </span>
                </div>

              </div>

            </div>

          </div>


          <div className="auth-footer-text">
            © 2026 InternHub · Khoa Công nghệ Thông tin · OU
          </div>

        </section>


        {/* ================= RIGHT ================= */}

        <section className="auth-form-area auth-register-form-area">

          <div className="auth-card auth-register-card">

            <div className="auth-mobile-brand">

              <div className="auth-brand-logo">
                IH
              </div>

              <strong>
                InternHub
              </strong>

            </div>


            <div className="auth-card-header">

              <span className="auth-label">
                THAM GIA INTERNHUB
              </span>

              <h2>
                Tạo tài khoản
              </h2>

              <p>
                Điền thông tin để bắt đầu sử dụng hệ thống
              </p>

            </div>


            <form onSubmit={handleSubmit}>

              {/* ROLE */}

              <div className="auth-form-group">

                <label>
                  Bạn đăng ký với vai trò
                </label>

                <div className="auth-role-selector">

                  <label
                    className={`auth-role-item ${
                      formData.role === "STUDENT"
                        ? "active"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="role"
                      value="STUDENT"
                      checked={formData.role === "STUDENT"}
                      onChange={handleChange}
                    />

                    <span className="auth-role-icon">
                      🎓
                    </span>

                    <span>
                      Sinh viên
                    </span>

                  </label>


                  <label
                    className={`auth-role-item ${
                      formData.role === "LECTURER"
                        ? "active"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="role"
                      value="LECTURER"
                      checked={formData.role === "LECTURER"}
                      onChange={handleChange}
                    />

                    <span className="auth-role-icon">
                      👨‍🏫
                    </span>

                    <span>
                      Giảng viên
                    </span>

                  </label>


                  <label
                    className={`auth-role-item ${
                      formData.role === "EMPLOYER"
                        ? "active"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="role"
                      value="EMPLOYER"
                      checked={formData.role === "EMPLOYER"}
                      onChange={handleChange}
                    />

                    <span className="auth-role-icon">
                      🏢
                    </span>

                    <span>
                      Doanh nghiệp
                    </span>

                  </label>

                </div>

              </div>


              {/* BASIC */}

              <div className="auth-form-grid">

                <div className="auth-form-group">

                  <label>
                    Họ và tên
                  </label>

                  <input
                    className="auth-input"
                    type="text"
                    name="fullName"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="auth-form-group">

                  <label>
                    Tên đăng nhập
                  </label>

                  <input
                    className="auth-input"
                    type="text"
                    name="username"
                    placeholder="nguyenvana"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="auth-form-grid">

                <div className="auth-form-group">

                  <label>
                    Email
                  </label>

                  <input
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="auth-form-group">

                  <label>
                    Số điện thoại
                  </label>

                  <input
                    className="auth-input"
                    type="text"
                    name="phone"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* STUDENT */}

              {formData.role === "STUDENT" && (

                <div className="auth-extra">

                  <div className="auth-extra-title">
                    Thông tin sinh viên
                  </div>


                  <div className="auth-form-grid">

                    <div className="auth-form-group">

                      <label>
                        Mã số sinh viên
                      </label>

                      <input
                        className="auth-input"
                        type="text"
                        name="mssv"
                        placeholder="2251012345"
                        value={formData.mssv}
                        onChange={handleChange}
                      />

                    </div>


                    <div className="auth-form-group">

                      <label>
                        Lớp
                      </label>

                      <input
                        className="auth-input"
                        type="text"
                        name="className"
                        placeholder="DH22IT01"
                        value={formData.className}
                        onChange={handleChange}
                      />

                    </div>

                  </div>


                  <div className="auth-form-group">

                    <label>
                      Chuyên ngành
                    </label>

                    <input
                      className="auth-input"
                      type="text"
                      name="major"
                      placeholder="Công nghệ thông tin"
                      value={formData.major}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              )}


              {/* LECTURER */}

              {formData.role === "LECTURER" && (

                <div className="auth-extra">

                  <div className="auth-extra-title">
                    Thông tin giảng viên
                  </div>

                  <div className="auth-form-group">

                    <label>
                      Mã giảng viên
                    </label>

                    <input
                      className="auth-input"
                      type="text"
                      name="lecturerCode"
                      placeholder="GV001"
                      value={formData.lecturerCode}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              )}


              {/* EMPLOYER */}

              {formData.role === "EMPLOYER" && (

                <div className="auth-extra">

                  <div className="auth-extra-title">
                    Thông tin doanh nghiệp
                  </div>


                  <div className="auth-form-grid">

                    <div className="auth-form-group">

                      <label>
                        Tên doanh nghiệp
                      </label>

                      <input
                        className="auth-input"
                        type="text"
                        name="companyName"
                        placeholder="Công ty ABC"
                        value={formData.companyName}
                        onChange={handleChange}
                      />

                    </div>


                    <div className="auth-form-group">

                      <label>
                        Mã số thuế
                      </label>

                      <input
                        className="auth-input"
                        type="text"
                        name="taxCode"
                        placeholder="0312345678"
                        value={formData.taxCode}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                </div>

              )}


              {/* PASSWORD */}

              <div className="auth-form-grid">

                <div className="auth-form-group">

                  <label>
                    Mật khẩu
                  </label>

                  <input
                    className="auth-input"
                    type="password"
                    name="password"
                    placeholder="Ít nhất 6 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="auth-form-group">

                  <label>
                    Nhập lại mật khẩu
                  </label>

                  <input
                    className="auth-input"
                    type="password"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <label className="auth-checkbox auth-agreement">

                <input type="checkbox" />

                <span>
                  Tôi đồng ý với Điều khoản sử dụng và
                  Chính sách bảo mật
                </span>

              </label>


              <button
                type="submit"
                className="auth-submit"
              >
                Tạo tài khoản
                <span>→</span>
              </button>

            </form>


            <div className="auth-switch">

              Đã có tài khoản?

              <Link to="/login">
                Đăng nhập
              </Link>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Register;