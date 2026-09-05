import './Header.css'
import { Link, NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
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
const roleMenus = {
  STUDENT: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Việc Làm', href: '/myapplications' },
    { label: 'Doanh Nghiệp', href: '/followedcompanies' },
    { label: 'CV của tôi', href: '/myCv' },
    { label: 'Thư mời', href: '/myinvitations' },
  ],

  LECTURER: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sinh viên', href: '/lecturer/students' },
    { label: 'Duyệt CV', href: '/lecturer/cvs' },
    { label: 'Ứng viên nổi bật', href: '/cv/suggestedCv' },
  ],
  EMPLOYER: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tin tuyển dụng', href: '/employer/jobs' },
    { label: 'Ứng viên Nổi Bật', href: '/cv/suggestedCv' },
    { label: 'Thư mời', href: '/employer/invitations' },
    { label: 'Sinh Viên đã tuyển dụng', href: '/employer/list-students' },
  ]
}

function Header() {
  const {currentUser}= useContext(UserContext)

  const menus =
    roleMenus[currentUser?.role] || roleMenus['STUDENT']

  return (
    <header className="header">

      <div className="header-container">

        {/* LOGO */}

        <Link to="/" className="brand">

          <div className="brand-icon">
            I
          </div>

          <div className="brand-name">
            Intern<span>Hub</span>
          </div>

        </Link>


        {/* NAVIGATION */}

        <nav
          className="navigation"
          aria-label="Điều hướng chính"
        >

          {menus.map((menu) => (

            <NavLink
              key={menu.href}
              to={menu.href}
              className={({ isActive }) =>
                `navigation-link ${isActive ? 'active' : ''}`
              }
            >
              {menu.label}
            </NavLink>

          ))}
        </nav>


        {/* HEADER ACTIONS */}

        <div className="header-actions">

          {/* THÔNG BÁO */}
          <button
            className="notification-button"
            type="button"
            aria-label="Thông báo"
          >
            <i className="bi bi-bell"></i>

            <span className="notification-count">
              0
            </span>
          </button>
          {/* USER */}
          <Link
            to="/profile"
            className="user-menu"
          >

            <div className="user-avatar">

              {currentUser?.avatarUrl ? (

                <img
                  src={currentUser.avatarUrl}
                  alt={
                    currentUser.fullName ||
                    'Ảnh đại diện'
                  }
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