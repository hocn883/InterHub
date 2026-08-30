import React from "react";
import "./Companies.css";
import { Link } from "react-router-dom";

function Companies({ employer }) {
  const isApproved = employer?.status === "APPROVED";

  return (
    <article className="company-card">

      {/* TOP */}
      <div className="company-card-top">

        <div className="company-card-logo">
          {employer?.avatarUrl ? (
            <img
              src={employer.avatarUrl}
              alt={employer?.companyName || "Company"}
            />
          ) : (
            <span>
              {employer?.companyName
                ?.charAt(0)
                .toUpperCase() || "C"}
            </span>
          )}
        </div>

        <div className="company-card-main">

          <div className="company-card-title-row">

            <h3>
              {employer?.companyName || "Tên doanh nghiệp"}
            </h3>

            {isApproved && (
              <span className="company-verified">
                <i className="bi bi-patch-check-fill"></i>
                Đã xác thực
              </span>
            )}

          </div>

          <p className="company-card-subtitle">
            <i className="bi bi-person"></i>

            {employer?.fullName || "Chưa cập nhật"}
          </p>

        </div>

      </div>


      {/* INFORMATION */}
      <div className="company-card-info">

        <div className="company-card-info-item">

          <div className="company-card-info-icon">
            <i className="bi bi-geo-alt"></i>
          </div>

          <div>
            <span>Địa điểm</span>

            <strong>
              {employer?.location || "Chưa cập nhật"}
            </strong>
          </div>

        </div>


        <div className="company-card-info-item">

          <div className="company-card-info-icon">
            <i className="bi bi-building"></i>
          </div>

          <div>
            <span>Mã số thuế</span>

            <strong>
              {employer?.taxCode || "Chưa cập nhật"}
            </strong>
          </div>

        </div>


        <div className="company-card-info-item">

          <div className="company-card-info-icon">
            <i className="bi bi-briefcase"></i>
          </div>

          <div>
            <span>Loại tài khoản</span>

            <strong>
              Nhà tuyển dụng
            </strong>
          </div>

        </div>

      </div>


      {/* FOOTER */}
      <div className="company-card-footer">

        <div
          className={`company-card-status ${
            isApproved ? "approved" : "pending"
          }`}
        >
          <span className="company-status-dot"></span>

          {isApproved
            ? "Đang hoạt động"
            : "Chờ xác thực"}
        </div>


        <Link
          to={`/companies/${employer?.id}`}
          className="company-detail-link"
        >
          Xem chi tiết

          <i className="bi bi-arrow-right"></i>
        </Link>

      </div>

    </article>
  );
}

export default Companies;