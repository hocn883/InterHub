import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="section-container footer-grid">
        <div className="footer-brand-section">
          <div className="brand footer-brand">
            <div className="brand-icon">I</div>
            <div className="brand-name">
              Intern<span>Hub</span>
            </div>
          </div>

          <p>
            Nền tảng hỗ trợ sinh viên thực tập và kết nối doanh nghiệp đối tác.
          </p>

          <div className="social-links">
            <a href="https://www.facebook.com" aria-label="Facebook">
              f
            </a>
            <a href="https://www.linkedin.com" aria-label="LinkedIn">
              in
            </a>
            <a href="https://www.youtube.com" aria-label="YouTube">
              ▶
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Dành cho sinh viên</h3>
          <a href="/jobs">Tìm việc làm</a>
          <a href="/cv">Tạo CV</a>
          <a href="/applications">Việc làm đã ứng tuyển</a>
          <a href="/companies">Danh sách doanh nghiệp</a>
        </div>

        <div className="footer-column">
          <h3>Dành cho doanh nghiệp</h3>
          <a href="/jobs/create">Đăng tin tuyển dụng</a>
          <a href="/employer/jobs">Quản lý tin tuyển dụng</a>
          <a href="/employer/applications">Quản lý ứng viên</a>
        </div>

        <div className="footer-column">
          <h3>Liên hệ</h3>
          <p>📍 TP. Hồ Chí Minh</p>
          <p>✉ support@internhub.vn</p>
          <p>☎ 0123 456 789</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="section-container">
          <span>© 2026 InternHub. All rights reserved.</span>
          <div>
            <a href="/terms">Điều khoản sử dụng</a>
            <a href="/privacy">Chính sách</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer