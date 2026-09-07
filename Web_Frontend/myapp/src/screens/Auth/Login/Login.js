import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import api, {endpoints,authApi,} from "../../../utils/api";
import {FaUser,FaLock, FaEye, FaEyeSlash,} from "react-icons/fa";
import "./Login.css";
function Login() {
  const navigate = useNavigate();
  const { setCurrentUser }=useContext(UserContext);
  const [username, setUsername]=useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =useState(false);
  const [loading, setLoading] =useState(false);
  const [error, setError] =useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !username.trim() ||
      !password.trim()
    ) {
      setError(
        "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu."
      );
      return;
    }
    try {
      setLoading(true);
      const response = await api.post(
        endpoints.login,
        {
          username: username.trim(),
          password: password,
        }
      );
      const data = response.data;
      const token =
        data?.result?.acesToken;
      if (!token) {
        throw new Error(
          "Không nhận được token đăng nhập."
        );
      }
      localStorage.setItem(
        "access-token",
        token
      );
      const userResponse =
        await authApi(token).get(
          endpoints.currentUser
        );

      const currentUser =
        userResponse.data?.result;
      if (!currentUser) {
        throw new Error(
          "Không lấy được thông tin người dùng."
        );
      }
      setCurrentUser(currentUser);
      navigate("/", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Login error:",
        err.response
      );
      setError(
        err.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one"></div>
      <div className="auth-decoration auth-decoration-two"></div>
      <div className="auth-container">
        <section className="auth-introduction">
          <Link
            to="/"
            className="auth-brand"
          >
            <div className="auth-brand-logo">
              OU
            </div>
            <div className="auth-brand-name">
              <strong>
                InternHub
              </strong>
              <span>
                TRƯỜNG ĐẠI HỌC MỞ TP.HCM
              </span>
            </div>
          </Link>
          <div className="auth-intro-content">
            <div className="auth-badge">
              KHOA CÔNG NGHỆ THÔNG TIN
            </div>
            <h1>
              Hệ thống hỗ trợ
              <span>
                sinh viên thực tập
              </span>
            </h1>
            <p className="auth-description">
              Nền tảng kết nối sinh viên,
              giảng viên và doanh nghiệp,
              hỗ trợ toàn bộ quá trình
              tìm kiếm, ứng tuyển và quản lý
              thực tập.
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
                    Tìm kiếm cơ hội thực tập
                  </strong>
                  <span>
                    Khám phá các vị trí phù hợp
                    từ doanh nghiệp đối tác
                  </span>
                </div>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon">
                  ✓
                </div>
                <div>
                  <strong>
                    Kết nối doanh nghiệp
                  </strong>
                  <span>
                    Ứng tuyển và kết nối trực tiếp
                    với doanh nghiệp
                  </span>
                </div>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon">
                  ✓
                </div>
                <div>
                  <strong>
                    Quản lý quá trình thực tập
                  </strong>
                  <span>
                    Theo dõi CV, ứng tuyển và
                    tiến trình thực tập
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="auth-footer-text">
            © 2026 InternHub · Khoa Công nghệ
            Thông tin · OU
          </div>
        </section>
        <section className="auth-form-area">
          <div className="auth-card">
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
                CHÀO MỪNG TRỞ LẠI
              </span>
              <h2>
                Đăng nhập
              </h2>
              <p>
                Đăng nhập để tiếp tục sử dụng
                hệ thống InternHub
              </p>
            </div>
            <form onSubmit={handleLogin}>
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}
              <div className="auth-form-group">
                <label>
                  Tên đăng nhập
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                      )
                    }
                    placeholder="Nhập tên đăng nhập"
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="auth-form-group">
                <label>
                  Mật khẩu
                </label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <FaLock />
                  </span>
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Ẩn mật khẩu"
                        : "Hiện mật khẩu"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Đang đăng nhập..."
                  : "Đăng nhập"}

                {!loading && (
                  <span>
                    →
                  </span>
                )}
              </button>
            </form>
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