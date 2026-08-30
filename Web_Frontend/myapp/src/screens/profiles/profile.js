import { Link, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiBriefcase,
  FiEdit2,
  FiLogOut,
  FiMail,
  FiPhone,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import "./profile.css";

const ROLE_LABEL = {
  STUDENT: "Sinh viên",
  LECTURER: "Giảng viên",
  EMPLOYER: "Nhà tuyển dụng",
  ADMIN: "Quản trị viên",
};

const GENDER_LABEL = {
  MALE: "Nam",
  FEMALE: "Nữ",
};

const STUDENT_STATUS = {
  TIM_VIEC: "Đang tìm việc",
  DANG_THUC_TAP: "Đang thực tập",
  HOAN_THANH: "Đã hoàn thành",
};

const EMPLOYER_STATUS = {
  APPROVED: "Đã được duyệt",
  PENDING: "Chờ duyệt",
  REJECTED: "Không được duyệt",
};

function InfoItem({ label, value }) {
  return (
    <div className="profile-info-item">
      <span>{label}</span>
      <strong>{value || "Chưa cập nhật"}</strong>
    </div>
  );
}

function Profile({ currentUser }) {
  const navigate = useNavigate();
  console.log( currentUser);
  const role =
    ROLE_LABEL[currentUser?.role] ||
    "Người dùng";

  const avatarText =
    currentUser?.fullName
      ?.charAt(0)
      ?.toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");

    navigate("/login", {
      replace: true,
    });
  };

  const renderRoleInfo = () => {
    switch (currentUser?.role) {
      case "STUDENT":
        return (
          <>
            <div className="profile-card-title">
              <FiBookOpen />

              <div>
                <h2>Thông tin học tập</h2>
                <p>
                  Thông tin sinh viên và quá trình thực tập.
                </p>
              </div>
            </div>

            <div className="profile-info-grid">
              <InfoItem
                label="Mã số sinh viên"
                value={currentUser.mssv}
              />

              <InfoItem
                label="Chuyên ngành"
                value={currentUser.major}
              />

              <InfoItem
                label="Lớp"
                value={currentUser.className}
              />

              <InfoItem
                label="Trạng thái"
                value={
                  STUDENT_STATUS[
                    currentUser.status
                  ] || currentUser.status
                }
              />
            </div>

            {currentUser.lecturer && (
              <div className="profile-related-box">
                <div>
                  <span>
                    Giảng viên phụ trách
                  </span>

                  <strong>
                    {
                      currentUser.lecturer
                        .fullName
                    }
                  </strong>

                  <p>
                    {
                      currentUser.lecturer
                        .lecturerCode
                    }
                  </p>
                </div>

                <Link
                  to="/myCv"
                  className="profile-link-button"
                >
                  CV của tôi
                </Link>
              </div>
            )}
          </>
        );

      case "LECTURER":
        return (
          <>
            <div className="profile-card-title">
              <FiUsers />

              <div>
                <h2>
                  Thông tin giảng viên
                </h2>

                <p>
                  Thông tin phụ trách sinh viên.
                </p>
              </div>
            </div>

            <div className="profile-info-grid">
              <InfoItem
                label="Mã giảng viên"
                value={
                  currentUser.lecturerCode
                }
              />

              <InfoItem
                label="Sinh viên phụ trách"
                value={
                  currentUser.studentCount ??
                  0
                }
              />

              <InfoItem
                label="CV chờ duyệt"
                value={
                  currentUser.pendingCvCount ??
                  0
                }
              />
            </div>

            <div className="profile-action-row">
              <Link
                to="/lecturer/students"
                className="profile-primary-button"
              >
                Quản lý sinh viên
              </Link>

              <Link
                to="/lecturer/cvs"
                className="profile-outline-button"
              >
                Duyệt CV
              </Link>
            </div>
          </>
        );

      case "EMPLOYER":
        return (
          <>
            <div className="profile-card-title">
              <FiBriefcase />

              <div>
                <h2>
                  Thông tin doanh nghiệp
                </h2>

                <p>
                  Hồ sơ và trạng thái nhà tuyển dụng.
                </p>
              </div>
            </div>

            <div className="profile-info-grid">
              <InfoItem
                label="Tên doanh nghiệp"
                value={
                  currentUser.companyName
                }
              />

              <InfoItem
                label="Mã số thuế"
                value={currentUser.taxCode}
              />

              <InfoItem
                label="Trạng thái"
                value={
                  EMPLOYER_STATUS[
                    currentUser.status
                  ] || currentUser.status
                }
              />

              <InfoItem
                label="Tin tuyển dụng"
                value={
                  currentUser.jobCount ?? 0
                }
              />
            </div>

            <div className="profile-action-row">
              <Link
                to="/employer/jobs"
                className="profile-primary-button"
              >
                Quản lý tin tuyển dụng
              </Link>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-layout">

          {/* LEFT */}

          <aside className="profile-sidebar">
            <div className="profile-avatar">
              {currentUser?.avatarUrl ? (
                <img
                  src={
                    currentUser.avatarUrl
                  }
                  alt={
                    currentUser.fullName
                  }
                />
              ) : (
                <span>
                  {avatarText}
                </span>
              )}
            </div>

            <h1>
              {currentUser?.fullName ||
                "Người dùng"}
            </h1>

            <span className="profile-role">
              {role}
            </span>

            <div className="profile-contact">
              <div>
                <FiMail />
                <span>
                  {currentUser?.email ||
                    "Chưa cập nhật"}
                </span>
              </div>

              <div>
                <FiPhone />
                <span>
                  {currentUser?.phone ||
                    "Chưa cập nhật"}
                </span>
              </div>

              <div>
                <FiUser />
                <span>
                  @
                  {currentUser?.username ||
                    "username"}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="profile-edit-button"
            >
              <FiEdit2 />
              Chỉnh sửa hồ sơ
            </button>

            <button
              type="button"
              className="profile-logout-button"
              onClick={handleLogout}
            >
              <FiLogOut />
              Đăng xuất
            </button>
          </aside>

          {/* RIGHT */}

          <main className="profile-content">

            {/* ACCOUNT INFO */}

            <section className="profile-card">
              <div className="profile-card-title">
                <FiUser />

                <div>
                  <h2>
                    Thông tin cá nhân
                  </h2>

                  <p>
                    Thông tin cơ bản của tài khoản.
                  </p>
                </div>
              </div>

              <div className="profile-info-grid">
                <InfoItem
                  label="Họ và tên"
                  value={
                    currentUser?.fullName
                  }
                />

                <InfoItem
                  label="Tên đăng nhập"
                  value={
                    currentUser?.username
                  }
                />

                <InfoItem
                  label="Email"
                  value={
                    currentUser?.email
                  }
                />

                <InfoItem
                  label="Số điện thoại"
                  value={
                    currentUser?.phone
                  }
                />

                <InfoItem
                  label="Giới tính"
                  value={
                    GENDER_LABEL[
                      currentUser?.gender
                    ] || "Khác"
                  }
                />

                <InfoItem
                  label="Vai trò"
                  value={role}
                />
              </div>
            </section>

            {/* ROLE INFO */}

            {currentUser?.role !==
              "ADMIN" && (
              <section className="profile-card">
                {renderRoleInfo()}
              </section>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile;