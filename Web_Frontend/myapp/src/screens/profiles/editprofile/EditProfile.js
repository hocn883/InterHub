import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft,FiBookOpen,FiBriefcase,FiCamera,FiMail,FiMapPin,FiPhone,FiSave,FiUser,} from "react-icons/fi";
import { authApi, endpoints } from "../../../utils/api";
import "./EditProfile.css";
const ROLE_LABEL = {
  STUDENT: "Sinh viên",
  LECTURER: "Giảng viên",
  EMPLOYER: "Nhà tuyển dụng",
};
function EditProfile({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!currentUser) return;
    const commonData = {
      fullName: currentUser.fullName || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      gender: currentUser.gender || "",
    };
    switch (currentUser.role) {
      case "STUDENT":
        setForm({
          ...commonData,
          major: currentUser.major || "",
          className: currentUser.className || "",
        });
        break;
      case "EMPLOYER":
        setForm({
          ...commonData,
          companyName: currentUser.companyName || "",
          location: currentUser.location || "",
        });
        break;
      case "LECTURER":
        setForm(commonData);
        break;
      default:
        setForm(commonData);
    }
    setPreview(currentUser.avatarUrl || "");
  }, [currentUser]);
  const avatarText =currentUser?.fullName?.charAt(0)?.toUpperCase() || "U";
  const handleChange = (event) => {
const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file hình ảnh.");
      return;
    }
    setError("");
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.fullName?.trim()) {
      setError("Họ và tên không được để trống.");
      return;
    }
    if (!form.email?.trim()) {
      setError("Email không được để trống.");
      return;
    }
    if (!form.phone?.trim()) {
      setError("Số điện thoại không được để trống.");
      return;
    }
    if (form.phone.length < 8 || form.phone.length > 10) {
      setError("Số điện thoại phải từ 8 đến 10 ký tự.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("access-token");
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("gender", form.gender);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      switch (currentUser.role) {
        case "STUDENT":
          formData.append("major", form.major || "");
          formData.append("className", form.className || "");
          break;

        case "EMPLOYER":
          formData.append("companyName", form.companyName || "");
          formData.append("location", form.location || "");
          break;

        case "LECTURER":
          break;

        default:
          setError("Vai trò người dùng không hợp lệ.");
          return;
      }
      const response = await authApi(token).patch(
        endpoints.updateUser,
        formData
      );
      if (setCurrentUser) {
        setCurrentUser((prev) => ({
          ...prev,
          ...response.data,
        }));
      }

      alert("Cập nhật thông tin thành công");
      navigate("/profile");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Không thể cập nhật thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <button
            type="button"
            className="edit-profile-back"
            onClick={() => navigate("/profile")}
          >
            <FiArrowLeft />
            Quay lại hồ sơ
          </button>

          <div>
            <h1>Chỉnh sửa thông tin cá nhân</h1>
            <p>Cập nhật những thông tin cá nhân được phép thay đổi.</p>
          </div>
        </div>

        <div className="edit-profile-layout">
          <aside className="edit-profile-sidebar">
            <div className="edit-profile-avatar-wrapper">
              <div className="edit-profile-avatar">
                {preview ? (
                  <img src={preview} alt="Avatar" />
                ) : (
                  <span>{avatarText}</span>
                )}
              </div>

              <label className="edit-avatar-button" htmlFor="avatar">
                <FiCamera />
              </label>

              <input
                id="avatar"
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </div>

            <h2>{currentUser?.fullName || "Người dùng"}</h2>

            <span className="edit-profile-role">
              {ROLE_LABEL[currentUser?.role] || "Người dùng"}
            </span>

            <p className="edit-profile-avatar-note">
              Nhấn biểu tượng máy ảnh để thay đổi ảnh đại diện.
            </p>

            <div className="edit-profile-account-box">
              <div>
                <span>Tên đăng nhập</span>
                <strong>@{currentUser?.username || "username"}</strong>
              </div>

              <div>
                <span>Vai trò</span>
                <strong>
                  {ROLE_LABEL[currentUser?.role] || "Người dùng"}
                </strong>
              </div>
            </div>

            <div className="edit-profile-lock-note">
              Tên đăng nhập và vai trò không thể thay đổi.
            </div>
          </aside>

          <main className="edit-profile-content">
            <form className="edit-profile-card" onSubmit={handleSubmit}>
              <div className="edit-profile-card-title">
                <FiUser />

                <div>
                  <h2>Thông tin cá nhân</h2>
                  <p>Thông tin chung của tài khoản.</p>
                </div>
              </div>

              {error && (
                <div className="edit-profile-error">
                  {error}
                </div>
              )}

              <div className="edit-profile-form-grid">
                <div className="edit-profile-field edit-profile-field-full">
                  <label htmlFor="fullName">
                    Họ và tên
                    <span>*</span>
                  </label>

                  <div className="edit-profile-input">
                    <FiUser />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={form.fullName || ""}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                </div>

                <div className="edit-profile-field">
                  <label htmlFor="email">
                    Email
                    <span>*</span>
                  </label>

                  <div className="edit-profile-input">
                    <FiMail />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email || ""}
                      onChange={handleChange}
                      placeholder="Nhập email"
                    />
                  </div>
                </div>
                <div className="edit-profile-field">
                  <label htmlFor="phone">
                    Số điện thoại
                    <span>*</span>
                  </label>

                  <div className="edit-profile-input">
                    <FiPhone />
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={form.phone || ""}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                <div className="edit-profile-field edit-profile-field-full">
                  <label>Giới tính</label>
                  <div className="edit-profile-gender-group">
                    <label
                      className={
                        form.gender === "MALE"
                          ? "gender-option active"
                          : "gender-option"
                      }
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="MALE"
                        checked={form.gender === "MALE"}
                        onChange={handleChange}
                      />
                      <span>Nam</span>
                    </label>
                    <label
                      className={
                        form.gender === "FEMALE"
                          ? "gender-option active"
                          : "gender-option"
                      }
                    >
                      <input
                        type="radio"
                        name="gender"
                        value="FEMALE"
                        checked={form.gender === "FEMALE"}
                        onChange={handleChange}
                      />
                      <span>Nữ</span>
                    </label>
                  </div>
                </div>
              </div>
              {currentUser?.role === "STUDENT" && (
                <>
                  <div className="edit-profile-card-title edit-profile-role-title">
                    <FiBookOpen />
                    <div>
                      <h2>Thông tin sinh viên</h2>
                      <p>Cập nhật thông tin học tập.</p>
                    </div>
                  </div>
                  <div className="edit-profile-form-grid">
                    <div className="edit-profile-field">
                      <label htmlFor="major">Chuyên ngành</label>
                      <div className="edit-profile-input">
                        <FiBookOpen />
                        <input
                          id="major"
                          name="major"
                          type="text"
                          value={form.major || ""}
                          onChange={handleChange}
                          placeholder="Nhập chuyên ngành"
                        />
                      </div>
                    </div>
                    <div className="edit-profile-field">
                      <label htmlFor="className">Lớp</label>
                      <div className="edit-profile-input">
                        <FiUser />
                        <input
                          id="className"
                          name="className"
                          type="text"
                          value={form.className || ""}
                          onChange={handleChange}
                          placeholder="Nhập lớp"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {currentUser?.role === "EMPLOYER" && (
                <>
                  <div className="edit-profile-card-title edit-profile-role-title">
                    <FiBriefcase />
                    <div>
                      <h2>Thông tin doanh nghiệp</h2>
                      <p>Cập nhật thông tin doanh nghiệp.</p>
                    </div>
                  </div>
                  <div className="edit-profile-form-grid">
                    <div className="edit-profile-field">
                      <label htmlFor="companyName">
                        Tên doanh nghiệp
                      </label>
                      <div className="edit-profile-input">
                        <FiBriefcase />
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          value={form.companyName || ""}
                          onChange={handleChange}
                          placeholder="Nhập tên doanh nghiệp"
                        />
                      </div>
                    </div>
                    <div className="edit-profile-field">
                      <label htmlFor="location">Địa chỉ</label>
                      <div className="edit-profile-input">
                        <FiMapPin />
                        <input
                          id="location"
                          name="location"
                          type="text"
                          value={form.location || ""}
                          onChange={handleChange}
                          placeholder="Nhập địa chỉ"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="edit-profile-actions">
                <button
                  type="button"
                  className="edit-profile-cancel"
                  onClick={() => navigate("/profile")}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="edit-profile-save"
                  disabled={loading}
                >
                  <FiSave />
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
export default EditProfile;