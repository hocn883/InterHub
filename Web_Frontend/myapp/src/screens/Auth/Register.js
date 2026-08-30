import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaBuilding,
  FaCheck,
  FaArrowRight,
  FaUser,
} from "react-icons/fa";

import api, {
  endpoints,
} from "../../utils/api";

import "./Auth.css";


function Register() {

  const navigate = useNavigate();


  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({

    fullName: "",
    username: "",
    email: "",
    phone: "",

    password: "",
    confirmPassword: "",

    gender: "",

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


  // ==========================================
  // AVATAR
  // ==========================================

  const [avatar, setAvatar] =
    useState(null);

  const [avatarPreview, setAvatarPreview] =
    useState("");


  // ==========================================
  // STATE
  // ==========================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // ==========================================
  // HANDLE AVATAR
  // ==========================================

  const handleAvatarChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }


    // ========================================
    // CHECK FILE TYPE
    // ========================================

    if (!file.type.startsWith("image/")) {

      setError(
        "Avatar phải là file hình ảnh."
      );

      return;
    }


    // ========================================
    // CHECK FILE SIZE
    // ========================================

    if (file.size > 5 * 1024 * 1024) {

      setError(
        "Avatar không được vượt quá 5MB."
      );

      return;
    }


    setError("");

    setAvatar(file);


    // ========================================
    // PREVIEW
    // ========================================

    const previewUrl =
      URL.createObjectURL(file);

    setAvatarPreview(previewUrl);

  };


  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // ========================================
    // PASSWORD
    // ========================================

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError(
        "Mật khẩu nhập lại không khớp."
      );

      return;
    }


    // ========================================
    // AVATAR
    // ========================================

    if (!avatar) {

      setError(
        "Vui lòng chọn ảnh đại diện."
      );

      return;
    }


    // ========================================
    // GENDER
    // ========================================

    if (!formData.gender) {

      setError(
        "Vui lòng chọn giới tính."
      );

      return;
    }


    // ========================================
    // CREATE FORMDATA
    // ========================================

    const data =
      new FormData();


    // ========================================
    // BASIC
    // ========================================

    data.append(
      "fullName",
      formData.fullName.trim()
    );

    data.append(
      "username",
      formData.username.trim()
    );

    data.append(
      "email",
      formData.email.trim()
    );

    data.append(
      "phone",
      formData.phone.trim()
    );

    data.append(
      "password",
      formData.password
    );

    data.append(
      "gender",
      formData.gender
    );

    data.append(
      "role",
      formData.role
    );


    // ========================================
    // AVATAR
    // ========================================

    data.append(
      "avatar",
      avatar
    );


    // ========================================
    // STUDENT
    // ========================================

    if (
      formData.role === "STUDENT"
    ) {

      data.append(
        "mssv",
        formData.mssv.trim()
      );

      data.append(
        "major",
        formData.major.trim()
      );

      data.append(
        "className",
        formData.className.trim()
      );

    }


    // ========================================
    // LECTURER
    // ========================================

    if (
      formData.role === "LECTURER"
    ) {

      data.append(
        "lecturerCode",
        formData.lecturerCode.trim()
      );

    }


    // ========================================
    // EMPLOYER
    // ========================================

    if (
      formData.role === "EMPLOYER"
    ) {

      data.append(
        "companyName",
        formData.companyName.trim()
      );

      data.append(
        "taxCode",
        formData.taxCode.trim()
      );
      data.append(
        "location",
        formData.location.trim()
      )

    }


    try {

      setLoading(true);


      // ========================================
      // DEBUG FORMDATA
      // ========================================

      console.log(
        "REGISTER ROLE:",
        formData.role
      );

      console.log(
        "REGISTER AVATAR:",
        avatar
      );


      for (
        const [key, value]
        of data.entries()
      ) {

        console.log(
          key,
          value
        );

      }


      // ========================================
      // API
      // ========================================

      const response =
        await api.post(
          endpoints.register,
          data
        );


      console.log(
        "REGISTER RESPONSE:",
        response.data
      );


      // ========================================
      // SUCCESS
      // ========================================

      setSuccess(
        response.data?.message ||
        "Đăng ký thành công!"
      );


      // ========================================
      // REDIRECT LOGIN
      // ========================================

      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (error) {

      console.error(
        "REGISTER ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );


      setError(
        error.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-page auth-register-page">

      <div
        className="auth-decoration auth-decoration-one"
      ></div>

      <div
        className="auth-decoration auth-decoration-two"
      ></div>


      <div className="auth-container auth-register-container">


        {/* =====================================
            LEFT
        ===================================== */}

        <section className="auth-introduction">


          <Link
            to="/"
            className="auth-brand"
          >

            <div className="auth-brand-logo">
              IH
            </div>

            <div className="auth-brand-name">

              <strong>
                InternHub
              </strong>

              <span>
                OU - Faculty of Information Technology
              </span>

            </div>

          </Link>


          <div className="auth-intro-content">


            <div className="auth-badge">

              <FaGraduationCap />

              KHOA CÔNG NGHỆ THÔNG TIN

            </div>


            <h1>

              Bắt đầu hành trình

              <span>
                thực tập của bạn
              </span>

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
                  <FaCheck />
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
                  <FaCheck />
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
                  <FaCheck />
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

            © 2026 InternHub ·
            Khoa Công nghệ Thông tin · OU

          </div>

        </section>



        {/* =====================================
            RIGHT
        ===================================== */}

        <section className="auth-form-area auth-register-form-area">

          <div className="auth-card auth-register-card">


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
                THAM GIA INTERNHUB
              </span>

              <h2>
                Tạo tài khoản
              </h2>

              <p>
                Điền thông tin để bắt đầu sử dụng hệ thống
              </p>

            </div>


            <form
              onSubmit={handleSubmit}
            >


              {/* ==================================
                  ERROR
              ================================== */}

              {error && (

                <div className="auth-error">
                  {error}
                </div>

              )}


              {/* ==================================
                  SUCCESS
              ================================== */}

              {success && (

                <div className="auth-success">
                  {success}
                </div>

              )}






              {/* ==================================
                  ROLE
              ================================== */}

              <div className="auth-form-group">

                <label>
                  Bạn đăng ký với vai trò
                </label>

                <div className="auth-role-selector">


                  {/* STUDENT */}

                  <label
                    className={`auth-role-item ${formData.role === "STUDENT"
                        ? "active"
                        : ""
                      }`}
                  >

                    <input
                      type="radio"
                      name="role"
                      value="STUDENT"
                      checked={
                        formData.role === "STUDENT"
                      }
                      onChange={handleChange}
                    />

                    <span className="auth-role-icon">

                      <FaGraduationCap />

                    </span>

                    <span>
                      Sinh viên
                    </span>

                  </label>


                  {/* LECTURER */}

                  <label
                    className={`auth-role-item ${formData.role === "LECTURER"
                        ? "active"
                        : ""
                      }`}
                  >

                    <input
                      type="radio"
                      name="role"
                      value="LECTURER"
                      checked={
                        formData.role === "LECTURER"
                      }
                      onChange={handleChange}
                    />

                    <span className="auth-role-icon">

                      <FaChalkboardTeacher />

                    </span>

                    <span>
                      Giảng viên
                    </span>

                  </label>


                  {/* EMPLOYER */}

                  <label
                    className={`auth-role-item ${formData.role === "EMPLOYER"
                        ? "active"
                        : ""
                      }`}
                  >

                    <input
                      type="radio"
                      name="role"
                      value="EMPLOYER"
                      checked={
                        formData.role === "EMPLOYER"
                      }
                      onChange={handleChange}
                    />

                    <span className="auth-role-icon">

                      <FaBuilding />

                    </span>

                    <span>
                      Doanh nghiệp
                    </span>

                  </label>


                </div>

              </div>
              {/* ==================================
                  AVATAR
              ================================== */}

              <div className="auth-avatar-section">

                <div className="auth-avatar-preview">

                  {avatarPreview ? (

                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                    />

                  ) : (

                    <FaUser />

                  )}

                </div>


                <div className="auth-avatar-content">

                  <label>
                    Ảnh đại diện
                  </label>

                  <span>
                    JPG, PNG hoặc WEBP · tối đa 5MB
                  </span>

                  <label
                    className="auth-avatar-button"
                  >

                    Chọn ảnh

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleAvatarChange
                      }
                    />

                  </label>

                </div>

              </div>


              {/* ==================================
                  BASIC
              ================================== */}

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
                    required
                  />

                </div>


              </div>


              {/* ==================================
                  GENDER
              ================================== */}

              <div className="auth-form-group">

                <label>
                  Giới tính
                </label>

                <select
                  className="auth-input"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    -- Chọn giới tính --
                  </option>

                  <option value="MALE">
                    Nam
                  </option>

                  <option value="FEMALE">
                    Nữ
                  </option>

                  <option value="OTHER">
                    Khác
                  </option>

                </select>

              </div>


              {/* ==================================
                  STUDENT
              ================================== */}

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
                        required
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
                        required
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
                      required
                    />

                  </div>

                </div>

              )}


              {/* ==================================
                  LECTURER
              ================================== */}

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
                      required
                    />

                  </div>

                </div>

              )}


              {/* ==================================
                  EMPLOYER
              ================================== */}

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
                        required
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
                        required
                      />

                    </div>


                  </div>

                </div>

              )}


              {/* ==================================
                  PASSWORD
              ================================== */}

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
                    minLength={6}
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
                    minLength={6}
                    required
                  />

                </div>


              </div>


              {/* ==================================
                  AGREEMENT
              ================================== */}

              <label className="auth-checkbox auth-agreement">

                <input
                  type="checkbox"
                  required
                />

                <span>

                  Tôi đồng ý với Điều khoản sử dụng
                  và Chính sách bảo mật

                </span>

              </label>


              {/* ==================================
                  SUBMIT
              ================================== */}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                {loading
                  ? "Đang tạo tài khoản..."
                  : "Tạo tài khoản"
                }

                {!loading && (

                  <span>
                    <FaArrowRight />
                  </span>

                )}

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