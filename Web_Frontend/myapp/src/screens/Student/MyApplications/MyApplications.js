import { useState } from "react";
import { Link } from "react-router-dom";
import "./MyApplications.css";

function MyApplications() {
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // =========================
  // DỮ LIỆU GIẢ
  // Sau này thay bằng API
  // =========================

  const applications = [
    {
      id: 1,
      jobId: 1,
      jobTitle: "Frontend Developer Intern",
      companyName: "FPT Software",
      companyLogo: "F",
      location: "TP. Hồ Chí Minh",
      salary: "4 - 6 triệu",
      appliedDate: "05/08/2026",
      status: "PENDING",
      cvName: "NguyenThaiHoc_FrontendCV.pdf",
    },
    {
      id: 2,
      jobId: 2,
      jobTitle: "Java Spring Boot Intern",
      companyName: "VNG Corporation",
      companyLogo: "V",
      location: "TP. Hồ Chí Minh",
      salary: "5 - 7 triệu",
      appliedDate: "01/08/2026",
      status: "APPROVED",
      cvName: "NguyenThaiHoc_JavaCV.pdf",
    },
    {
      id: 3,
      jobId: 3,
      jobTitle: "ReactJS Intern",
      companyName: "NashTech",
      companyLogo: "N",
      location: "Quận 12, TP. Hồ Chí Minh",
      salary: "3 - 5 triệu",
      appliedDate: "28/07/2026",
      status: "REJECTED",
      cvName: "NguyenThaiHoc_ReactCV.pdf",
    },
    {
      id: 4,
      jobId: 4,
      jobTitle: "Backend Developer Intern",
      companyName: "TMA Solutions",
      companyLogo: "T",
      location: "TP. Hồ Chí Minh",
      salary: "4 - 6 triệu",
      appliedDate: "20/07/2026",
      status: "PENDING",
      cvName: "NguyenThaiHoc_BackendCV.pdf",
    },
  ];

  const filteredApplications =
    selectedStatus === "ALL"
      ? applications
      : applications.filter(
        (application) => application.status === selectedStatus
      );

  const pendingCount = applications.filter(
    (item) => item.status === "PENDING"
  ).length;

  const approvedCount = applications.filter(
    (item) => item.status === "APPROVED"
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "REJECTED"
  ).length;

  const getStatusInfo = (status) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Đang chờ",
          icon: "⏳",
        };

      case "APPROVED":
        return {
          label: "Đã chấp nhận",
          icon: "✓",
        };

      case "REJECTED":
        return {
          label: "Không phù hợp",
          icon: "×",
        };

      default:
        return {
          label: status,
          icon: "",
        };
    }
  };

  return (
    <div className="applications-page">

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <section className="applications-hero">

        <div className="application-decoration decoration-one"></div>
        <div className="application-decoration decoration-two"></div>

        <div className="applications-container applications-hero-content">

          <div>

            <div className="applications-badge">
              📄 QUẢN LÝ ỨNG TUYỂN
            </div>

            <h1>
              Việc làm
              <span> đã ứng tuyển</span>
            </h1>

            <p>
              Theo dõi trạng thái các vị trí thực tập bạn đã ứng tuyển
              và quản lý quá trình tuyển dụng của mình.
            </p>

          </div>

          <div className="hero-application-card">

            <div className="hero-application-icon">
              💼
            </div>

            <div>
              <strong>{applications.length}</strong>
              <span>Đơn ứng tuyển</span>
            </div>

          </div>

        </div>

      </section>


      {/* ========================= */}
      {/* STATISTICS */}
      {/* ========================= */}

      <div className="applications-container">

        <div className="application-statistics">

          <div className="application-stat">

            <div className="stat-icon total">
              📄
            </div>

            <div>
              <strong>{applications.length}</strong>
              <span>Tổng ứng tuyển</span>
            </div>

          </div>


          <div className="application-stat">

            <div className="stat-icon pending">
              ⏳
            </div>

            <div>
              <strong>{pendingCount}</strong>
              <span>Đang chờ</span>
            </div>

          </div>


          <div className="application-stat">

            <div className="stat-icon approved">
              ✓
            </div>

            <div>
              <strong>{approvedCount}</strong>
              <span>Đã chấp nhận</span>
            </div>

          </div>


          <div className="application-stat">

            <div className="stat-icon rejected">
              ×
            </div>

            <div>
              <strong>{rejectedCount}</strong>
              <span>Không phù hợp</span>
            </div>

          </div>

        </div>

      </div>


      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}

      <main className="applications-container applications-main">

        {/* HEADING */}

        <div className="applications-heading">

          <div>
            <span className="section-label">
              ĐƠN ỨNG TUYỂN
            </span>

            <h2>
              Danh sách việc làm đã ứng tuyển
            </h2>

            <p>
              Theo dõi và cập nhật trạng thái tuyển dụng của bạn
            </p>
          </div>


          <Link
            to="/jobs"
            className="btn btn-primary"
          >
            + Tìm việc mới
          </Link>

        </div>


        {/* ========================= */}
        {/* FILTER */}
        {/* ========================= */}

        <div className="application-filter">

          <button
            className={
              selectedStatus === "ALL"
                ? "active"
                : ""
            }
            onClick={() => setSelectedStatus("ALL")}
          >
            Tất cả
            <span>{applications.length}</span>
          </button>


          <button
            className={
              selectedStatus === "PENDING"
                ? "active"
                : ""
            }
            onClick={() => setSelectedStatus("PENDING")}
          >
            Đang chờ
            <span>{pendingCount}</span>
          </button>


          <button
            className={
              selectedStatus === "APPROVED"
                ? "active"
                : ""
            }
            onClick={() => setSelectedStatus("APPROVED")}
          >
            Đã chấp nhận
            <span>{approvedCount}</span>
          </button>


          <button
            className={
              selectedStatus === "REJECTED"
                ? "active"
                : ""
            }
            onClick={() => setSelectedStatus("REJECTED")}
          >
            Không phù hợp
            <span>{rejectedCount}</span>
          </button>

        </div>


        {/* ========================= */}
        {/* LIST */}
        {/* ========================= */}

        <div className="applications-list">

          {filteredApplications.map((application) => {
            const statusInfo =
              getStatusInfo(application.status);

            return (
              <article
                className="application-card"
                key={application.id}
              >

                {/* COMPANY */}

                <div className="application-company-logo">
                  {application.companyLogo}
                </div>


                {/* CONTENT */}

                <div className="application-content">

                  <div className="application-top">

                    <div>

                      <Link
                        to={`/jobs/${application.jobId}`}
                        className="application-job-title"
                      >
                        {application.jobTitle}
                      </Link>

                      <div className="application-company">
                        {application.companyName}
                      </div>

                    </div>


                    <div
                      className={`application-status ${application.status.toLowerCase()}`}
                    >
                      <span>
                        {statusInfo.icon}
                      </span>

                      {statusInfo.label}
                    </div>

                  </div>


                  {/* JOB INFORMATION */}

                  <div className="application-job-info">

                    <span>
                      📍 {application.location}
                    </span>

                    <span>
                      💰 {application.salary}
                    </span>

                  </div>


                  {/* META */}

                  <div className="application-meta">

                    <div className="application-meta-item">

                      <span className="meta-icon">
                        📅
                      </span>

                      <div>
                        <small>Ngày ứng tuyển</small>

                        <strong>
                          {application.appliedDate}
                        </strong>
                      </div>

                    </div>


                    <div className="application-meta-item">

                      <span className="meta-icon">
                        📎
                      </span>

                      <div>
                        <small>CV đã gửi</small>

                        <strong>
                          {application.cvName}
                        </strong>
                      </div>

                    </div>

                  </div>


                  {/* BOTTOM */}

                  <div className="application-footer">

                    <div className="application-message">

                      {application.status === "PENDING" && (
                        <>
                          <span>💡</span>

                          Hồ sơ đang được doanh nghiệp xem xét.
                        </>
                      )}


                      {application.status === "APPROVED" && (
                        <>
                          <span>🎉</span>

                          Chúc mừng! Hồ sơ của bạn đã được chấp nhận.
                        </>
                      )}


                      {application.status === "REJECTED" && (
                        <>
                          <span>💡</span>

                          Hồ sơ chưa phù hợp với vị trí này.
                        </>
                      )}

                    </div>


                    <div className="application-actions">

                      <button
                        className="btn btn-outline"
                        onClick={() =>
                          console.log("CV:", application.cvName)
                        }
                      >
                        Xem CV
                      </button>


                      <Link
                        to={`/jobs/${application.jobId}`}
                        className="btn btn-primary"
                      >
                        Xem việc làm
                        <span>→</span>
                      </Link>
                    </div>

                  </div>

                </div>

              </article>
            );
          })}

        </div>


        {/* EMPTY */}

        {filteredApplications.length === 0 && (

          <div className="application-empty">

            <div className="empty-icon">
              📭
            </div>

            <h3>
              Không có đơn ứng tuyển
            </h3>

            <p>
              Chưa có đơn ứng tuyển nào thuộc trạng thái này.
            </p>

            <Link to="/jobs">
              Tìm việc ngay
            </Link>

          </div>

        )}

      </main>

    </div>
  );
}

export default MyApplications;