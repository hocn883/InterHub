import './Header.css'
import { Link } from 'react-router-dom'
const getRoleLabel = (role) => {
  switch (role) {
    case 'STUDENT':
      return 'Sinh viên'
    case 'LECTURER':
      return 'Giảng viên'
    case 'EMPLOYER':
      return 'Nhà tuyển dụng'
    case 'ADMIN':
      return 'Quản trị viên'
    default:
      return 'Người dùng'
  }
}

const getDashboardButton = (role) => {
  switch (role) {
    case 'STUDENT':
      return 'Hồ sơ của tôi'
    case 'LECTURER':
      return 'Quản lý sinh viên'
    case 'EMPLOYER':
      return 'Đăng tin tuyển dụng'
    case 'ADMIN':
      return 'Trang quản trị'
    default:
      return 'Bảng điều khiển'
  }
}

const roleMenus = {
  STUDENT: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Việc làm', href: '/myapplications' },
    { label: 'Doanh nghiệp', href: '/followedcompanies' },
    { label: 'CV của tôi', href: '/myCv' },
  ],
  LECTURER: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sinh viên', href: '/lecturer/students' },
    { label: 'Duyệt CV', href: '/lecturer/cvs' },
  ],
  EMPLOYER: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tin tuyển dụng', href: '/employer/jobs' },
    { label: 'Ứng viên', href: '/employer/applications' },
  ]
}

function Header({ currentUser }) {
  const menus = roleMenus[currentUser?.role] ?? roleMenus.EMPLOYER

  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="brand">
          <div className="brand-icon">I</div>
          <div className="brand-name">
            Intern<span>Hub</span>
          </div>
        </a>

        <nav className="navigation" aria-label="Điều hướng chính">
          {menus.map((menu, index) => (
            <a
              className={`navigation-link ${index === 0 ? 'active' : ''}`}
              href={menu.href}
              key={menu.href}
            >
              {menu.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="notification-button"
            type="button"
            aria-label="Thông báo"
          >
            <span>🔔</span>
            <span className="notification-count">3</span>
          </button>

          <button className="dashboard-button" type="button">
            {getDashboardButton(currentUser?.role)}
          </button>
          <Link to="/profile" className="user-menu">

            <div className="user-avatar">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName || 'Ảnh đại diện'}
                />
              ) : (
                currentUser?.fullName?.charAt(0) || 'U'
              )}
            </div>

            <div className="user-information">
              <strong>
                {currentUser?.fullName || 'Người dùng'}
              </strong>

              <span>
                {getRoleLabel(currentUser?.role)}
              </span>
            </div>

            <span className="dropdown-icon">
              ›
            </span>

          </Link>
        </div>
      </div>
    </header>
  )
}
export default Header