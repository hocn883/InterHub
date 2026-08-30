import "./Footer.css";
import {
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUniversity,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="section-container footer-grid">

        {/* BRAND */}
        <div className="footer-brand-section">
          <div className="brand footer-brand">
            <div className="brand-icon">
              <FaUniversity />
            </div>

            <div className="brand-name">
              Intern<span>Hub</span>
            </div>
          </div>

          <p className="footer-description">
            Nền tảng hỗ trợ sinh viên Trường Đại học Mở Thành phố Hồ Chí Minh
            tìm kiếm cơ hội thực tập, việc làm và kết nối với doanh nghiệp.
          </p>

          <div className="social-links">
            <a
              href="https://www.facebook.com/TruongDaiHocMo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* STUDENT */}
        <div className="footer-column">
          <h3>Dành cho sinh viên</h3>

          <a href="/jobs">Tìm kiếm việc làm</a>
          <a href="/cv">Quản lý CV</a>
          <a href="/applications">Việc làm đã ứng tuyển</a>
          <a href="/companies">Doanh nghiệp</a>
        </div>

        {/* EMPLOYER */}
        <div className="footer-column">
          <h3>Dành cho doanh nghiệp</h3>

          <a href="/jobs/create">Đăng tin tuyển dụng</a>
          <a href="/employer/jobs">Quản lý tin tuyển dụng</a>
          <a href="/employer/applications">Quản lý ứng viên</a>
        </div>

        {/* CONTACT */}
        <div className="footer-column footer-contact">
          <h3>Liên hệ</h3>

          <div className="contact-item">
            <FaUniversity className="contact-icon" />

            <span>
              Trường Đại học Mở
              <br />
              Thành phố Hồ Chí Minh
            </span>
          </div>

          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />

            <span>
              97 Võ Văn Tần,
              <br />
              Thành phố Hồ Chí Minh
            </span>
          </div>

          <div className="contact-item">
            <FaEnvelope className="contact-icon" />

            <a href="mailto:phongquanlidaotao@ou.edu.vn">
              phongquanlidaotao@ou.edu.vn
            </a>
          </div>

          <div className="contact-item">
            <FaEnvelope className="contact-icon" />

            <a href="mailto:ou@ou.edu.vn">
              ou@ou.edu.vn
            </a>
          </div>

          <div className="contact-item">
            <FaPhoneAlt className="contact-icon" />

            <a href="tel:02839300210">
              (028) 3930 0210
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <div className="section-container footer-bottom-content">
          <span>
            © 2026 InternHub - Trường Đại học Mở TP. Hồ Chí Minh
          </span>

          <div className="footer-bottom-links">
            <a href="/terms">Điều khoản sử dụng</a>
            <a href="/privacy">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;