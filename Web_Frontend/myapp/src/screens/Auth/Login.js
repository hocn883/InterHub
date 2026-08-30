import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { UserContext } from "../../contexts/UserContext";
import api, {
  endpoints,
  authApi,
} from "../../utils/api";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";

import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const { setCurrentUser } =
    useContext(UserContext);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // ==============================
    // VALIDATE
    // ==============================
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

      // ==============================
      // LOGIN
      // ==============================
      const response = await api.post(
        endpoints.login,
        {
          username: username.trim(),
          password: password,
        }
      );

      const data = response.data;

      // ==============================
      // GET TOKEN
      // ==============================
      const token =
        data?.result?.acesToken;

      if (!token) {
        throw new Error(
          "Không nhận được token đăng nhập."
        );
      }

      // ==============================
      // SAVE TOKEN
      // ==============================
      localStorage.setItem(
        "access-token",
        token
      );

      // ==============================
      // GET CURRENT USER
      // ==============================
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

      // ==============================
      // UPDATE USER CONTEXT
      // ==============================
      setCurrentUser(currentUser);

      // ==============================
      // REDIRECT HOME
      // ==============================
      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      // ==============================
      // ERROR 401
      // ==============================
      if (
        error.response?.status === 401
      ) {
        setError(
          "Tên đăng nhập hoặc mật khẩu không đúng."
        );
      }

      // ==============================
      // ERROR 400
      // ==============================
      else if (
        error.response?.status === 400
      ) {
        setError(
          error.response?.data?.message ||
            "Thông tin đăng nhập không hợp lệ."
        );
      }

      // ==============================
      // OTHER ERROR
      // ==============================
      else {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Không thể đăng nhập. Vui lòng thử lại."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ==============================
          DECORATION
      ============================== */}

      <div className="auth-decoration auth-decoration-one"></div>

      <div className="auth-decoration auth-decoration-two"></div>

      <div className="auth-container">

        {/* ==============================
            LEFT
        ============================== */}

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

        {/* ==============================
            RIGHT
        ============================== */}

        <section className="auth-form-area">

          <div className="auth-card">

            {/* MOBILE BRAND */}

            <div className="auth-mobile-brand">

              <div className="auth-brand-logo">
                IH
              </div>

              <strong>
                InternHub
              </strong>

            </div>

            {/* HEADER */}

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

            {/* FORM */}

            <form onSubmit={handleLogin}>

              {/* ERROR */}

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              {/* USERNAME */}

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

              {/* PASSWORD */}

              <div className="auth-form-group">

                <div className="auth-label-row">

                  <label>
                    Mật khẩu
                  </label>

                  <Link
                    to="/forgot-password"
                    className="auth-forgot"
                  >
                    Quên mật khẩu?
                  </Link>

                </div>

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
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>

              {/* REMEMBER */}

              <label className="auth-checkbox">

                <input
                  type="checkbox"
                />

                <span>
                  Ghi nhớ đăng nhập
                </span>

              </label>

              {/* SUBMIT */}

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

            {/* DIVIDER */}

            <div className="auth-divider">
              <span>
                hoặc
              </span>
            </div>

            {/* GOOGLE */}

            <button
              type="button"
              className="auth-google"
            >

              <div className="auth-google-icon">
                <FaGoogle />
              </div>

              Đăng nhập với Google

            </button>

            {/* REGISTER */}

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