import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiImage,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import api, { endpoints } from "../../../utils/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    role: "STUDENT",
    mssv: "",
    major: "",
    className: "",
    lecturerCode: "",
    companyName: "",
    taxCode: "",
    location: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Avatar phải là file hình ảnh.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Avatar không được vượt quá 5MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setAvatar(file);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return "Vui lòng nhập họ và tên.";
    }

    if (!formData.gender) {
      return "Vui lòng chọn giới tính.";
    }

    if (!formData.email.trim()) {
      return "Vui lòng nhập email.";
    }

    if (!formData.phone.trim()) {
      return "Vui lòng nhập số điện thoại.";
    }

    if (!avatar) {
      return "Vui lòng chọn ảnh đại diện.";
    }

    if (formData.role === "STUDENT") {
      if (!formData.mssv.trim()) {
        return "Vui lòng nhập mã số sinh viên.";
      }

      if (!formData.className.trim()) {
        return "Vui lòng nhập lớp.";
      }

      if (!formData.major.trim()) {
        return "Vui lòng nhập chuyên ngành.";
      }
    }

    if (formData.role === "LECTURER") {
      if (!formData.lecturerCode.trim()) {
        return "Vui lòng nhập mã giảng viên.";
      }
    }

    if (formData.role === "EMPLOYER") {
      if (!formData.companyName.trim()) {
        return "Vui lòng nhập tên doanh nghiệp.";
      }

      if (!formData.taxCode.trim()) {
        return "Vui lòng nhập mã số thuế.";
      }

      if (!formData.location.trim()) {
        return "Vui lòng nhập địa chỉ.";
      }
    }

    if (!formData.username.trim()) {
      return "Vui lòng nhập tên đăng nhập.";
    }

    if (formData.username.trim().length < 4) {
      return "Tên đăng nhập phải có ít nhất 4 ký tự.";
    }

    if (formData.username.includes(" ")) {
      return "Tên đăng nhập không được chứa khoảng trắng.";
    }

    if (formData.password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      return "Mật khẩu nhập lại không khớp.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const data = new FormData();

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

    data.append(
      "avatar",
      avatar
    );

    if (formData.role === "STUDENT") {
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

    if (formData.role === "LECTURER") {
      data.append(
        "lecturerCode",
        formData.lecturerCode.trim()
      );
    }

    if (formData.role === "EMPLOYER") {
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
      );
    }

    try {
      setLoading(true);

      const response = await api.post(
        endpoints.register,
        data
      );

      setSuccess(
        response.data?.message ||
        "Đăng ký thành công!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Đăng ký thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-header">
          <span className="register-header-badge">
            INTERNHUB ACCOUNT
          </span>

          <div className="register-header-icon">
            <FiUser />
          </div>

          <h1>
            Tạo tài khoản
            <span> InternHub</span>
          </h1>

          <p>
            Đăng ký tài khoản để bắt đầu kết nối,
            ứng tuyển và quản lý cơ hội thực tập.
          </p>

          <div className="register-header-line">
            <span />
          </div>
        </div>
        <form onSubmit={handleSubmit}>

          {error && (
            <div className="register-message register-error">
              {error}
            </div>
          )}

          {success && (
            <div className="register-message register-success">
              <FiCheckCircle />
              {success}
            </div>
          )}

          {/* ROLE */}

          <div className="register-section">
            <div className="register-section-title">
              <FiUsers />
              <span>Vai trò</span>
            </div>

            <div className="register-role-list">

              <label
                className={
                  formData.role === "STUDENT"
                    ? "register-role active"
                    : "register-role"
                }
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

                <FiBookOpen />

                Sinh viên
              </label>

              <label
                className={
                  formData.role === "LECTURER"
                    ? "register-role active"
                    : "register-role"
                }
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

                <FiUsers />

                Giảng viên
              </label>

              <label
                className={
                  formData.role === "EMPLOYER"
                    ? "register-role active"
                    : "register-role"
                }
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

                <FiBriefcase />

                Doanh nghiệp
              </label>

            </div>
          </div>
          <div className="register-section">
            <div className="register-section-title">
              <FiUser />
              <span>Thông tin cá nhân</span>
            </div>

            <div className="register-grid">

              <div className="register-group">
                <label>Họ và tên</label>

                <div className="register-input-box">
                  <FiUser />

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="register-group">
                <label>Giới tính</label>

                <div className="register-input-box">
                  <FiUsers />

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Chọn giới tính
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
              </div>

              <div className="register-group">
                <label>Email</label>

                <div className="register-input-box">
                  <FiMail />

                  <input
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="register-group">
                <label>Số điện thoại</label>

                <div className="register-input-box">
                  <FiPhone />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="register-group">
              <label>Ảnh đại diện</label>
              <label className="register-avatar">
                <span className="register-avatar-icon">
                  <FiImage />
                </span>
                <div className="register-avatar-content">
                  <strong>
                    {avatar
                      ? avatar.name
                      : "Chọn ảnh đại diện"}
                  </strong>
                  <span>
                    JPG, PNG, WEBP - tối đa 5MB
                  </span>
                </div>
                <span className="register-avatar-button">
                  Chọn ảnh
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  hidden
                />
              </label>
            </div>
          </div>
          {formData.role === "STUDENT" && (
            <div className="register-section">

              <div className="register-section-title">
                <FiBookOpen />
                <span>Thông tin sinh viên</span>
              </div>

              <div className="register-grid">

                <div className="register-group">
                  <label>MSSV</label>

                  <div className="register-input-box">
                    <FiUser />

                    <input
                      type="text"
                      name="mssv"
                      placeholder="2251012345"
                      value={formData.mssv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="register-group">
                  <label>Lớp</label>

                  <div className="register-input-box">
                    <FiUsers />

                    <input
                      type="text"
                      name="className"
                      placeholder="DH22IT01"
                      value={formData.className}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

              </div>

              <div className="register-group">
                <label>Chuyên ngành</label>

                <div className="register-input-box">
                  <FiBookOpen />

                  <input
                    type="text"
                    name="major"
                    placeholder="Công nghệ thông tin"
                    value={formData.major}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            </div>
          )}
          {formData.role === "LECTURER" && (
            <div className="register-section">

              <div className="register-section-title">
                <FiUsers />
                <span>Thông tin giảng viên</span>
              </div>
              <div className="register-group">
                <label>Mã giảng viên</label>
                <div className="register-input-box">
                  <FiUser />
                  <input
                    type="text"
                    name="lecturerCode"
                    placeholder="GV001"
                    value={formData.lecturerCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}
          {formData.role === "EMPLOYER" && (
            <div className="register-section">

              <div className="register-section-title">
                <FiBriefcase />
                <span>Thông tin doanh nghiệp</span>
              </div>
              <div className="register-grid">
                <div className="register-group">
                  <label>Tên doanh nghiệp</label>
                  <div className="register-input-box">
                    <FiBriefcase />
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Công ty ABC"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="register-group">
                  <label>Mã số thuế</label>
                  <div className="register-input-box">
                    <FiUser />
                    <input
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
              <div className="register-group">
                <label>Địa chỉ</label>
                <div className="register-input-box">
                  <FiMapPin />
                  <input
                    type="text"
                    name="location"
                    placeholder="TP. Hồ Chí Minh"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            </div>
          )}

          {/* ACCOUNT */}

          <div className="register-section">
            <div className="register-section-title">
              <FiLock />
              <span>Thông tin tài khoản</span>
            </div>

            <div className="register-group">
              <label>Tên đăng nhập</label>

              <div className="register-input-box">
                <FiUser />

                <input
                  type="text"
                  name="username"
                  placeholder="nguyenvana"
                  value={formData.username}
                  onChange={handleChange}
                  minLength={4}
                  required
                />
              </div>
            </div>

            <div className="register-grid">
              <div className="register-group">
                <label>Mật khẩu</label>

                <div className="register-input-box">
                  <FiLock />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Ít nhất 6 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="register-eye"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>
              </div>

              <div className="register-group">
                <label>Xác nhận mật khẩu</label>

                <div className="register-input-box">
                  <FiLock />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="register-eye"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <label className="register-agreement">
            <input
              type="checkbox"
              required
            />

            <span>
              Tôi đồng ý với{" "}
              <strong>
                Điều khoản sử dụng
              </strong>{" "}
              và{" "}
              <strong>
                Chính sách bảo mật
              </strong>
            </span>
          </label>

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading
              ? "Đang đăng ký..."
              : "Đăng ký"}
          </button>

        </form>

        <div className="register-login">
          Đã có tài khoản?

          <Link to="/login">
            Đăng nhập
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;