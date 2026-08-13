import { Link, useParams } from "react-router-dom";
import "./JobDetailScreen.css";

function JobDetailScreen({ jobs = [], savedJobIds = [], onSave }) {
  const { jobId } = useParams();

  const job = jobs.find((item) => String(item.id) === String(jobId));

  if (!job) {
    return (
      <div className="job-detail-not-found">
        <h2>Không tìm thấy công việc</h2>
        <p>Công việc này có thể đã bị xóa hoặc không còn tồn tại.</p>

        <Link to="/jobs" className="back-to-jobs-button">
          Quay lại danh sách việc làm
        </Link>
      </div>
    );
  }

  const isSaved = savedJobIds.includes(job.id);

  const handleSave = () => {
    if (onSave) {
      onSave(job.id);
    }
  };

  return (
    <main className="job-detail-page">
      <div className="job-detail-container">
        <nav className="job-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/jobs">Việc làm</Link>
          <span>/</span>
          <span>{job.title}</span>
        </nav>

        <section className="job-detail-hero">
          {job.featured && (
            <div className="job-detail-featured">Công việc nổi bật</div>
          )}

          <div className="job-detail-heading">
            <div className="job-detail-company-logo">
              {job.companyLogo}
            </div>

            <div className="job-detail-title-group">
              <h1>{job.title}</h1>

              <p className="job-detail-company-name">
                {job.company}
              </p>

              <div className="job-detail-tags">
                <span>📍 {job.location}</span>
                <span>💼 {job.type}</span>
                <span>🕒 {job.experience}</span>
              </div>
            </div>

            <button
              type="button"
              className={`job-detail-save-button ${
                isSaved ? "saved" : ""
              }`}
              onClick={handleSave}
            >
              <span>{isSaved ? "♥" : "♡"}</span>
              {isSaved ? "Đã lưu" : "Lưu việc làm"}
            </button>
          </div>

          <div className="job-detail-summary">
            <div className="summary-item">
              <span className="summary-icon">💰</span>

              <div>
                <small>Mức lương</small>
                <strong>{job.salary}</strong>
              </div>
            </div>

            <div className="summary-item">
              <span className="summary-icon">📅</span>

              <div>
                <small>Hạn ứng tuyển</small>
                <strong>{job.deadline}</strong>
              </div>
            </div>

            <div className="summary-item">
              <span className="summary-icon">👥</span>

              <div>
                <small>Số lượng tuyển</small>
                <strong>{job.quantity || 1} người</strong>
              </div>
            </div>

            <div className="summary-item">
              <span className="summary-icon">🏢</span>

              <div>
                <small>Hình thức</small>
                <strong>{job.type}</strong>
              </div>
            </div>
          </div>
        </section>

        <div className="job-detail-layout">
          <section className="job-detail-main">
            <article className="job-detail-section">
              <h2>Mô tả công việc</h2>

              <div className="job-detail-text">
                {job.description ? (
                  <p>{job.description}</p>
                ) : (
                  <>
                    <p>
                      Tham gia phát triển và bảo trì các chức năng của hệ
                      thống.
                    </p>

                    <p>
                      Phối hợp với các thành viên trong nhóm để phân tích
                      yêu cầu, xây dựng chức năng và kiểm thử sản phẩm.
                    </p>
                  </>
                )}
              </div>
            </article>

            <article className="job-detail-section">
              <h2>Yêu cầu ứng viên</h2>

              {job.requirements ? (
                <p className="job-detail-text">{job.requirements}</p>
              ) : (
                <ul className="job-detail-list">
                  <li>
                    Sinh viên ngành Công nghệ thông tin hoặc ngành liên
                    quan.
                  </li>
                  <li>
                    Có kiến thức cơ bản về lập trình và cơ sở dữ liệu.
                  </li>
                  <li>
                    Có tinh thần học hỏi, chủ động và trách nhiệm.
                  </li>
                  <li>
                    Có khả năng làm việc độc lập và làm việc nhóm.
                  </li>
                </ul>
              )}
            </article>

            <article className="job-detail-section">
              <h2>Kỹ năng cần thiết</h2>

              <div className="job-detail-skills">
                {job.skills?.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>

            <article className="job-detail-section">
              <h2>Quyền lợi</h2>

              <ul className="job-detail-list">
                <li>
                  Được hướng dẫn và làm việc trong môi trường thực tế.
                </li>
                <li>
                  Có cơ hội tham gia các dự án của doanh nghiệp.
                </li>
                <li>
                  Được xác nhận thực tập sau khi hoàn thành.
                </li>
                <li>
                  Có cơ hội trở thành nhân viên chính thức.
                </li>
              </ul>
            </article>

            <article className="job-detail-section">
              <h2>Địa điểm làm việc</h2>

              <div className="job-location-box">
                <span>📍</span>

                <div>
                  <strong>{job.location}</strong>
                  <p>
                    Địa chỉ cụ thể sẽ được doanh nghiệp cung cấp khi ứng
                    viên được liên hệ.
                  </p>
                </div>
              </div>
            </article>
          </section>

          <aside className="job-detail-sidebar">
            <div className="apply-card">
              <div className="apply-card-header">
                <span>Hạn nộp hồ sơ</span>
                <strong>{job.deadline}</strong>
              </div>

              <button type="button" className="apply-now-button">
                Ứng tuyển ngay
              </button>

              <button
                type="button"
                className={`sidebar-save-button ${
                  isSaved ? "saved" : ""
                }`}
                onClick={handleSave}
              >
                {isSaved ? "♥ Đã lưu việc làm" : "♡ Lưu việc làm"}
              </button>

              <p className="application-note">
                Hãy kiểm tra kỹ CV và thông tin cá nhân trước khi ứng
                tuyển.
              </p>
            </div>

            <div className="company-card">
              <h3>Thông tin công ty</h3>

              <div className="company-card-heading">
                <div className="company-card-logo">
                  {job.companyLogo}
                </div>

                <div>
                  <strong>{job.company}</strong>
                  <span>Nhà tuyển dụng đã xác thực</span>
                </div>
              </div>

              <div className="company-card-info">
                <p>
                  <span>👥</span>
                  Quy mô: {job.companySize || "50 - 100 nhân viên"}
                </p>

                <p>
                  <span>📍</span>
                  Địa điểm: {job.location}
                </p>

                <p>
                  <span>🌐</span>
                  Website: {job.website || "Đang cập nhật"}
                </p>
              </div>

              <Link
                to={`/companies/${job.companyId || job.id}`}
                className="view-company-link"
              >
                Xem trang công ty →
              </Link>
            </div>

            <div className="job-warning-card">
              <h3>⚠️ Lưu ý an toàn</h3>

              <p>
                Không cung cấp thông tin tài khoản ngân hàng hoặc chuyển
                tiền cho nhà tuyển dụng.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default JobDetailScreen;