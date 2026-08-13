import "./JobCard.css";
import { Link } from "react-router-dom";

function JobCard({ job, isSaved, onSave }) {
  return (
    <article className="job-card">

      {job.featured && (
        <span className="featured-label">Nổi bật</span>
      )}

      <div className="job-card-header">
        <div className="company-logo">
          {job.companyLogo}
        </div>

        <button
          className={`save-job-button ${isSaved ? "saved" : ""}`}
          type="button"
          onClick={() => onSave(job.id)}
          aria-label="Lưu việc làm"
        >
          {isSaved ? "♥" : "♡"}
        </button>
      </div>

      <div className="job-card-content">

        <Link
          to={`/jobs/${job.id}`}
          className="job-title"
        >
          {job.title}
        </Link>

        <p className="company-name">
          {job.company}
        </p>

        <div className="job-salary">
          <span className="job-icon">💰</span>
          {job.salary}
        </div>

        <div className="job-information">

          <div>
            <span>📍</span>
            <span>{job.location}</span>
          </div>

          <div>
            <span>🕒</span>
            <span>{job.experience}</span>
          </div>

          <div>
            <span>💼</span>
            <span>{job.type}</span>
          </div>

        </div>

        <div className="job-skills">
          {job.skills?.map((skill) => (
            <span key={skill}>
              {skill}
            </span>
          ))}
        </div>

      </div>

      <div className="job-card-footer">

        <div className="job-deadline">
          <span>
            Hạn nộp: {job.deadline}
          </span>

          <small>
            {job.postedAt}
          </small>
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className="job-detail-link"
        >
          Xem chi tiết
          <span>→</span>
        </Link>

      </div>

    </article>
  );
}

export default JobCard;