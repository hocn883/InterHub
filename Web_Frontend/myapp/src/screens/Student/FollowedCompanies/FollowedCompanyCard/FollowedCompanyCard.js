import React from 'react'
import './FollowedCompanyCard.css'

const FollowedCompanyCard = ({ company, onUnfollow }) => {

    const handleUnfollow = () => {
        onUnfollow(company.id)
    }

    return (
        <div className="followed-company-card">

            <div className="company-card-header">

                <div className="company-avatar-wrapper">
                    <img
                        src={
                            company.avatarUrl ||
                            'https://via.placeholder.com/80'
                        }
                        alt={company.companyName}
                        className="company-avatar"
                    />
                </div>

                <div className="company-status">
                    {company.status === 'APPROVED'
                        ? 'Đã xác thực'
                        : company.status}
                </div>

            </div>

            <div className="company-card-body">

                <h3 className="company-name">
                    {company.companyName || 'Chưa cập nhật tên công ty'}
                </h3>

                <p className="employer-name">
                    Đại diện: {company.fullName || 'Chưa cập nhật'}
                </p>

                <div className="company-info">

                    <div className="company-info-item">
                        <span className="info-label">
                            Địa điểm
                        </span>

                        <span className="info-value">
                            {company.location || 'Chưa cập nhật'}
                        </span>
                    </div>

                    <div className="company-info-item">
                        <span className="info-label">
                            Mã số thuế
                        </span>

                        <span className="info-value">
                            {company.taxCode || 'Chưa cập nhật'}
                        </span>
                    </div>

                    <div className="company-info-item">
                        <span className="info-label">
                            Theo dõi từ
                        </span>

                        <span className="info-value">
                            {company.createdDate || 'Chưa cập nhật'}
                        </span>
                    </div>

                </div>

            </div>

            <div className="company-card-footer">
                <Link
                    type="button"
                    className="view-company-btn"
                    to={`/companies/${employer?.id}`}
                >
                    Xem chi tiết
                    <i className="bi bi-arrow-right"></i>
                </Link>
                <button
                    type="button"
                    className="unfollow-btn"
                    onClick={handleUnfollow}
                >
                    Bỏ theo dõi
                </button>

            </div>

        </div>
    )
}

export default FollowedCompanyCard