import { Link } from 'react-router-dom'
import './FollowedCompaniesCard.css'

const FollowedCompanyCard = ({ company, onUnfollow }) => {

  return (
    <article className="followed-company-card">

      {/* ===================================
          HEADER CARD
      =================================== */}
      <div className="followed-company-card-header">

        <div className="followed-company-logo">
          {company.shortName}
        </div>

        <button
          className="unfollow-button"
          onClick={() => onUnfollow(company.id)}
        >
          Đang theo dõi
        </button>

      </div>


      {/* ===================================
          THÔNG TIN DOANH NGHIỆP
      =================================== */}
      <div className="followed-company-content">

        <h3>{company.companyName}</h3>

        <span className="company-field">
          {company.field}
        </span>

        <p className="company-description">
          {company.description}
        </p>


        {/* ===================================
            THÔNG TIN PHỤ
        =================================== */}
        <div className="company-meta">

          <div>
            <span>📍</span>
            {company.location}
          </div>

          <div>
            <span>👥</span>
            {company.followers} người theo dõi
          </div>

        </div>

      </div>


      {/* ===================================
          FOOTER CARD
      =================================== */}
      <div className="followed-company-footer">

        <div className="open-job-count">
          <strong>{company.openJobs}</strong>
          <span> việc đang tuyển</span>
        </div>

        {/* Chuyển trang trong cùng tab */}
        <Link
          to={`/companies/${company.id}`}
          className="company-detail-button"
        >
          Xem doanh nghiệp →
        </Link>

      </div>

    </article>
  )
}

export default FollowedCompanyCard