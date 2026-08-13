import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("LOGIN:", formData);

    // Sau này gọi API:
    // POST /api/auth/login

    // Đăng nhập thành công:
    // navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one"></div>
      <div className="auth-decoration auth-decoration-two"></div>

      <div className="auth-container">

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
              Hệ thống hỗ trợ
              <span>sinh viên thực tập</span>
            </h1>

            <p className="auth-description">
              Nền tảng kết nối sinh viên, giảng viên và doanh nghiệp,
              hỗ trợ toàn bộ quá trình tìm kiếm, ứng tuyển và quản lý
              thực tập.
            </p>

            <div className="auth-school">
              <div className="auth-school-logo">
                OU
              </div>

              <div>
                <span>TRƯỜNG ĐẠI HỌC MỞ TP.HCM</span>
                <strong>Khoa Công nghệ Thông tin</strong>
              </div>
            </div>

            <div className="auth-features">

              <div className="auth-feature">
                <div className="auth-feature-icon">✓</div>

                <div>
                  <strong>Tìm kiếm cơ hội thực tập</strong>
                  <span>
                    Khám phá các vị trí phù hợp từ doanh nghiệp đối tác
                  </span>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">✓</div>

                <div>
                  <strong>Kết nối doanh nghiệp</strong>
                  <span>
                    Ứng tuyển và kết nối trực tiếp với doanh nghiệp
                  </span>
                </div>
              </div>

              <div className="auth-feature">
                <div className="auth-feature-icon">✓</div>

                <div>
                  <strong>Quản lý quá trình thực tập</strong>
                  <span>
                    Theo dõi CV, ứng tuyển và tiến trình thực tập
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
        <section className="auth-form-area">

          <div className="auth-card">

            <div className="auth-mobile-brand">
              <div className="auth-brand-logo">
                IH
              </div>

              <strong>InternHub</strong>
            </div>

            <div className="auth-card-header">
              <span className="auth-label">
                CHÀO MỪNG TRỞ LẠI
              </span>

              <h2>Đăng nhập</h2>

              <p>
                Đăng nhập để tiếp tục sử dụng hệ thống InternHub
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="auth-form-group">
                <label>Tên đăng nhập</label>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    👤
                  </span>

                  <input
                    type="text"
                    name="username"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group">

                <div className="auth-label-row">
                  <label>Mật khẩu</label>

                  <Link
                    to="/forgot-password"
                    className="auth-forgot"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    🔒
                  </span>

                  <input
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <label className="auth-checkbox">
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <button
                type="submit"
                className="auth-submit"
              >
                Đăng nhập
                <span>→</span>
              </button>

            </form>

            <div className="auth-divider">
              <span>hoặc</span>
            </div>

            <button
              type="button"
              className="auth-google"
            >
              <div className="auth-google-icon">
                G
              </div>

              Đăng nhập với Google
            </button>

            <div className="auth-switch">
              Chưa có tài khoản?

              <Link to="/register">
                Đăng ký ngay
              </Link>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Login;