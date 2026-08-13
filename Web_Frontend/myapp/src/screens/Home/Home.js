import { useState } from 'react'
import SearchJobs from './SearchJob/SearchJobs'
import JobCard from './JobCard/JobCard'
import Companies from './Companies/Companies'
import './Home.css'

const categories = [
  {
    id: 1,
    name: 'Công nghệ thông tin',
    icon: '💻',
    jobs: 128,
  },
  {
    id: 2,
    name: 'Marketing',
    icon: '📢',
    jobs: 86,
  },
  {
    id: 3,
    name: 'Kinh doanh',
    icon: '📈',
    jobs: 104,
  },
  {
    id: 4,
    name: 'Kế toán',
    icon: '🧾',
    jobs: 65,
  },
  {
    id: 5,
    name: 'Thiết kế',
    icon: '🎨',
    jobs: 42,
  },
  {
    id: 6,
    name: 'Nhân sự',
    icon: '👥',
    jobs: 38,
  },
]
const jobs = [
  {
    id: 1,
    title: 'Thực tập sinh Java Backend',
    company: 'Công ty Công nghệ FPT Software',
    companyLogo: 'F',
    salary: '5 - 8 triệu',
    location: 'TP. Hồ Chí Minh',
    experience: 'Không yêu cầu',
    type: 'Thực tập',
    deadline: '20/08/2026',
    postedAt: '2 giờ trước',
    featured: true,
    skills: ['Java', 'Spring Boot', 'MySQL'],
  },
  {
    id: 2,
    title: 'Frontend Developer Intern',
    company: 'Công ty TNHH TechNova',
    companyLogo: 'T',
    salary: '4 - 7 triệu',
    location: 'Hà Nội',
    experience: 'Dưới 1 năm',
    type: 'Thực tập',
    deadline: '25/08/2026',
    postedAt: '4 giờ trước',
    featured: true,
    skills: ['React JS', 'JavaScript', 'CSS'],
  },
  {
    id: 3,
    title: 'Thực tập sinh Digital Marketing',
    company: 'Công ty Truyền thông Green Media',
    companyLogo: 'G',
    salary: '3 - 5 triệu',
    location: 'TP. Hồ Chí Minh',
    experience: 'Không yêu cầu',
    type: 'Thực tập',
    deadline: '28/08/2026',
    postedAt: 'Hôm nay',
    featured: false,
    skills: ['Content', 'SEO', 'Facebook Ads'],
  },
  {
    id: 4,
    title: 'UI/UX Designer Intern',
    company: 'Công ty Giải pháp Sáng tạo Pixel',
    companyLogo: 'P',
    salary: '4 - 6 triệu',
    location: 'Đà Nẵng',
    experience: 'Không yêu cầu',
    type: 'Thực tập',
    deadline: '30/08/2026',
    postedAt: 'Hôm nay',
    featured: false,
    skills: ['Figma', 'UI Design', 'UX Research'],
  },
  {
    id: 5,
    title: 'Business Analyst Intern',
    company: 'Công ty Cổ phần DigiSoft',
    companyLogo: 'D',
    salary: '5 - 7 triệu',
    location: 'TP. Hồ Chí Minh',
    experience: 'Dưới 1 năm',
    type: 'Thực tập',
    deadline: '05/09/2026',
    postedAt: '1 ngày trước',
    featured: true,
    skills: ['UML', 'SQL', 'Communication'],
  },
  {
    id: 6,
    title: 'Thực tập sinh Tuyển dụng',
    company: 'Công ty Nhân sự Talent Hub',
    companyLogo: 'H',
    salary: '3 - 4 triệu',
    location: 'Hà Nội',
    experience: 'Không yêu cầu',
    type: 'Bán thời gian',
    deadline: '10/09/2026',
    postedAt: '1 ngày trước',
    featured: false,
    skills: ['Recruitment', 'Communication', 'Excel'],
  },
]

const companies = [
  {
    id: 1,
    name: 'FPT Software',
    logo: 'F',
    jobs: 18,
    field: 'Công nghệ thông tin',
  },
  {
    id: 2,
    name: 'TechNova',
    logo: 'T',
    jobs: 12,
    field: 'Phần mềm',
  },
  {
    id: 3,
    name: 'Green Media',
    logo: 'G',
    jobs: 9,
    field: 'Marketing',
  },
  {
    id: 4,
    name: 'DigiSoft',
    logo: 'D',
    jobs: 15,
    field: 'Giải pháp doanh nghiệp',
  },
]

function Home() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [savedJobs, setSavedJobs] = useState([])
  const [activeTab, setActiveTab] = useState('recommended')

  const handleSearch = (event) => {
    event.preventDefault()

    console.log({
      keyword,
      location,
      category,
    })
  }

  const handleSaveJob = (jobId) => {
    setSavedJobs((previousJobs) => {
      if (previousJobs.includes(jobId)) {
        return previousJobs.filter((id) => id !== jobId)
      }

      return [...previousJobs, jobId]
    })
  }

  return (
    <main>
      {/* ======================================================
      COMPONENT: HeroSection
      Gợi ý file: src/components/home/HeroSection.jsx

      Props có thể truyền:
      - keyword, setKeyword
      - location, setLocation
      - category, setCategory
      - handleSearch

      Có thể tách nhỏ thêm:
      - SearchBox
      - HeroVisual
  ====================================================== */}
      <section className="hero-section">
        <div className="hero-decoration hero-decoration-one"></div>
        <div className="hero-decoration hero-decoration-two"></div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>✨</span>
              Nền tảng kết nối thực tập dành cho sinh viên
            </div>

            <h1>
              Nền tảng thực tập
              <span>Khoa Công Nghệ Thông Tin Đại Học Mở TPHCM</span>
            </h1>

            <p className="hero-description">
              Khám phá cơ hội thực tập từ các doanh nghiệp uy tín, xây dựng
              CV chuyên nghiệp và kết nối với giảng viên hướng dẫn.
            </p>

            <div className="popular-keywords">
              <span>Từ khóa phổ biến:</span>

              <button type="button">Java</button>
              <button type="button">React JS</button>
              <button type="button">Marketing</button>
              <button type="button">Không yêu cầu kinh nghiệm</button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-icon">🎓</div>

              <div>
                <strong>1.250+</strong>
                <span>Sinh viên đã kết nối</span>
              </div>
            </div>

            <div className="hero-illustration">
              <div className="illustration-window">
                <div className="illustration-top">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="illustration-body">
                  <div className="illustration-profile">
                    <div className="profile-picture">👨‍💻</div>

                    <div className="profile-lines">
                      <span></span>
                      <span></span>
                    </div>
                  </div>

                  <div className="illustration-job">
                    <div className="small-logo">J</div>

                    <div className="job-lines">
                      <span></span>
                      <span></span>
                    </div>

                    <div className="match-score">92%</div>
                  </div>

                  <div className="illustration-job">
                    <div className="small-logo">R</div>

                    <div className="job-lines">
                      <span></span>
                      <span></span>
                    </div>

                    <div className="match-score">87%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-card hero-card-bottom">
              <div className="success-icon">✓</div>

              <div>
                <strong>Ứng tuyển thành công</strong>
                <span>Java Backend Intern</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
      COMPONENT: StatisticsSection
      Gợi ý file:
      src/components/home/StatisticsSection.jsx
  ====================================================== */}
      <section className="statistics-section">
        <div className="section-container statistics-grid">
          <div className="statistic-item">
            <div className="statistic-icon">💼</div>

            <div>
              <strong>480+</strong>
              <span>Việc làm đang tuyển</span>
            </div>
          </div>

          <div className="statistic-item">
            <div className="statistic-icon">🏢</div>

            <div>
              <strong>150+</strong>
              <span>Doanh nghiệp đối tác</span>
            </div>
          </div>

          <div className="statistic-item">
            <div className="statistic-icon">🎓</div>

            <div>
              <strong>1.250+</strong>
              <span>Sinh viên tham gia</span>
            </div>
          </div>

          <div className="statistic-item">
            <div className="statistic-icon">✅</div>

            <div>
              <strong>86%</strong>
              <span>Tỷ lệ tìm được thực tập</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
      COMPONENT: CategoriesSection
      Gợi ý file:
      src/components/home/CategoriesSection.jsx

      Props:
      - categories
  ====================================================== */}
      <section className="section categories-section">
        <div className="section-container">
          <div className="section-heading">
            <div>
              <span className="section-label">Khám phá cơ hội</span>
              <h2>Việc làm theo ngành nghề</h2>
              <p>
                Lựa chọn ngành nghề phù hợp với kỹ năng và định hướng của bạn.
              </p>
            </div>

            <a className="view-all-link" href="/categories">
              Xem tất cả
              <span>→</span>
            </a>
          </div>

          <div className="categories-grid">
            {/* COMPONENT CON: CategoryCard
            Gợi ý file:
            src/components/home/CategoryCard.jsx
        */}
            {categories.map((item) => (
              <button className="category-card" key={item.id} type="button">
                <div className="category-icon">{item.icon}</div>

                <div className="category-content">
                  <strong>{item.name}</strong>
                  <span>{item.jobs} việc làm</span>
                </div>

                <div className="category-arrow">→</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
      COMPONENT: JobsSection
      Gợi ý file:
      src/components/home/JobsSection.jsx

      Props:
      - jobs
      - activeTab
      - setActiveTab
      - savedJobs
      - handleSaveJob
  ====================================================== */}
      <section className="section jobs-section">
        <div className="section-container">
          <div className="section-heading">
            <div>
              <span className="section-label">Cơ hội dành cho bạn</span>
              <h2>Việc làm nổi bật</h2>
              <p>
                Các vị trí thực tập mới nhất từ những doanh nghiệp uy tín.
              </p>
            </div>

            <a className="view-all-link" href="/jobs">
              Xem tất cả việc làm
              <span>→</span>
            </a>
          </div>
          <div className="job-tabs">
            <button
              className={activeTab === 'recommended' ? 'active' : ''}
              type="button"
              onClick={() => setActiveTab('recommended')}
            >
              Gợi ý cho bạn
            </button>

            <button
              className={activeTab === 'latest' ? 'active' : ''}
              type="button"
              onClick={() => setActiveTab('latest')}
            >
              Mới nhất
            </button>

            <button
              className={activeTab === 'popular' ? 'active' : ''}
              type="button"
              onClick={() => setActiveTab('popular')}
            >
              Ứng tuyển nhiều
            </button>
          </div>
          <SearchJobs
            keyword={keyword}
            setKeyword={setKeyword}
            location={location}
            setLocation={setLocation}
            category={category}
            setCategory={setCategory}
            handleSearch={handleSearch}
          />
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobs.includes(job.id)}
                onSave={handleSaveJob}
              />
            ))}
          </div>
          <div className="load-more-wrapper">
            <button className="load-more-button" type="button">
              Xem thêm việc làm
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
      COMPONENT: CompaniesSection
      Gợi ý file:
      src/components/home/CompaniesSection.jsx

      Props:
      - companies
  ====================================================== */}
      <section className="section companies-section">
        <div className="section-container">
          <div className="section-heading">
            <div>
              <span className="section-label">Đối tác của InternHub</span>
              <h2>Doanh nghiệp</h2>
              <p>
                Kết nối với những doanh nghiệp đang có nhu cầu tuyển thực tập
                sinh.
              </p>
            </div>

            <a className="view-all-link" href="/companies">
              Xem tất cả
              <span>→</span>
            </a>
          </div>

          <div className="companies-grid">
            {/* COMPONENT CON: CompanyCard
            Gợi ý file:
            src/components/companies/CompanyCard.jsx
        */}
            {companies.map((company) => (
              <Companies
                key={company.id}
                company={company}
                />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
      COMPONENT: CareerSection
      Gợi ý file:
      src/components/home/CareerSection.jsx
  ====================================================== */}
      <section className="career-section">
        <div className="section-container career-container">
          <div className="career-content">
            <span className="career-label">Phát triển sự nghiệp</span>

            <h2>Hoàn thiện hồ sơ để tăng cơ hội ứng tuyển</h2>

            <p>
              Tạo CV chuyên nghiệp, nhận đánh giá từ giảng viên và tìm kiếm
              công việc phù hợp với kỹ năng của bạn.
            </p>

            <div className="career-actions">
              <button className="primary-button" type="button">
                Tạo CV ngay
              </button>

              <button className="secondary-button" type="button">
                Xem hồ sơ của tôi
              </button>
            </div>
          </div>

          <div className="career-progress-card">
            <div className="progress-heading">
              <div>
                <span>Mức độ hoàn thiện hồ sơ</span>
                <strong>75%</strong>
              </div>

              <div className="progress-circle">75%</div>
            </div>

            <div className="profile-progress">
              <div className="profile-progress-bar">
                <div></div>
              </div>
            </div>

            <div className="profile-check-list">
              <div className="completed">
                <span>✓</span>
                Thông tin cá nhân
              </div>

              <div className="completed">
                <span>✓</span>
                Học vấn và kỹ năng
              </div>

              <div>
                <span>○</span>
                Kinh nghiệm và dự án
              </div>

              <div>
                <span>○</span>
                CV đã được giảng viên duyệt
              </div>
               <a href={`/login`}>
                      Xem doanh nghiệp
                      <span>→</span>
                    </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home