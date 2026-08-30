import { useEffect, useMemo, useState } from "react";
import SearchJobs from "./SearchJob/SearchJobs";
import JobCard from "./JobCard/JobCard";
import Companies from "./Companies/Companies";
import api, { endpoints } from "../../utils/api";
import "./Home.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Home() {
  const [keyword, setKeyword] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [searchFilters, setSearchFilters] = useState({ keyword: "", salary: "", location: "" });
  const [jobs, setJobs] = useState([]);
  const [jobPage, setJobPage] = useState(0);
  const [jobHasMore, setJobHasMore] = useState(true);
  const [jobLoading, setJobLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("recommended");
  const [employer, setEmployer] = useState([]);
  const [employerPage, setEmployerPage] = useState(0);
  const [employerHasMore, setEmployerHasMore] = useState(true);
  const [employerLoading, setEmployerLoading] = useState(false);
  const [error, setError] = useState("");
  const loadJobs = async (pageNumber = 0) => {
    try {
      setJobLoading(true);
      setError("");
      const response = await api.get(endpoints.jobs, {
        params: { page: pageNumber, size: 6 },
      });
      const pageData = response.data?.result;
      const openJobs = (pageData?.content || []).filter((job) => job.status === "OPEN");
      setJobs((prev) => {
        const ids = new Set(prev.map((job) => job.id));
        return [...prev, ...openJobs.filter((job) => !ids.has(job.id))];
      });
      setJobHasMore(
        typeof pageData?.last === "boolean"
          ? !pageData.last
          : pageNumber + 1 < (pageData?.totalPages || 0)
      );
      return true;
    } catch (error) {
      console.error("Load jobs error:", error);
      setJobHasMore(false);
      setError(error.response?.data?.message || "Không thể tải danh sách công việc");
      return false;
    } finally {
      setJobLoading(false);
    }
  };
  const loadEmployers = async (pageNumber = 0) => {
    try {
      setEmployerLoading(true);
      const response = await api.get(endpoints.employer, {
        params: { page: pageNumber, size: 6 },
      });
      const pageData = response.data?.result;
      const data = pageData?.content || [];
      setEmployer((prev) => {
        const ids = new Set(prev.map((item) => item.id));
        return [...prev, ...data.filter((item) => !ids.has(item.id))];
      });
      setEmployerHasMore(
        typeof pageData?.last === "boolean"
          ? !pageData.last
          : pageNumber + 1 < (pageData?.totalPages || 0)
      );
      return true;
    } catch (error) {
      console.error("Load employers error:", error);
      setEmployerHasMore(false);
      return false;
    } finally {
      setEmployerLoading(false);
    }
  };
  useEffect(() => {
    loadJobs();
    loadEmployers();
  }, []);
  const handleLoadMore = async () => {
    if (jobLoading || !jobHasMore) return;
    const nextPage = jobPage + 1;
    const success = await loadJobs(nextPage);
    if (success) setJobPage(nextPage);
  };
  const handleLoadMoreEmployer = async () => {
    if (employerLoading || !employerHasMore) return;
    const nextPage = employerPage + 1;
    const success = await loadEmployers(nextPage);
    if (success) setEmployerPage(nextPage);
  };
  const handleSearch = (event) => {
    event.preventDefault();
    setSearchFilters({
      keyword: keyword.trim(),
      salary,
      location: location.trim(),
    });
  };
  const handleResetSearch = () => {
    setKeyword("");
    setSalary("");
    setLocation("");
    setSearchFilters({ keyword: "", salary: "", location: "" });
  };
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const jobTitle = String(job.title || "").toLowerCase();
      const jobLocation = String(job.location || job.address || job.workLocation || "").toLowerCase();
      const jobSalary = Number(job.salary || 0);
      const searchKeyword = searchFilters.keyword.toLowerCase();
      const searchLocation = searchFilters.location.toLowerCase();
      const matchesKeyword = !searchKeyword || jobTitle.includes(searchKeyword);
      const matchesLocation = !searchLocation || jobLocation.includes(searchLocation);
      const matchesSalary = !searchFilters.salary || jobSalary >= Number(searchFilters.salary);
      return matchesKeyword && matchesLocation && matchesSalary;
    });
  }, [jobs, searchFilters]);
  const handleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };
  return (
    <main>
      <section className="hero-section">
        <div className="hero-decoration hero-decoration-one"></div>
        <div className="hero-decoration hero-decoration-two"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="bi bi-stars"></i>
              <span>Nền tảng kết nối thực tập dành cho sinh viên</span>
            </div>
            <h1>
              Nền tảng thực tập
              <span>Khoa Công Nghệ Thông Tin Đại Học Mở TPHCM</span>
            </h1>
            <p className="hero-description">
              Khám phá cơ hội thực tập từ các doanh nghiệp uy tín, xây dựng CV chuyên nghiệp và kết nối với giảng viên hướng dẫn.
            </p>
            <div className="popular-keywords">
              <span>Từ khóa phổ biến:</span>
              <button type="button" onClick={() => setKeyword("Java")}>Java</button>
              <button type="button" onClick={() => setKeyword("React JS")}>React JS</button>
              <button type="button" onClick={() => setKeyword("Marketing")}>Marketing</button>
              <button type="button" onClick={() => setKeyword("Không yêu cầu kinh nghiệm")}>
                Không yêu cầu kinh nghiệm
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-icon"><i className="bi bi-mortarboard-fill"></i></div>
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
                    <div className="profile-picture"><i className="bi bi-person-fill"></i></div>
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
              <div className="success-icon"><i className="bi bi-check-lg"></i></div>
              <div>
                <strong>Ứng tuyển thành công</strong>
                <span>Java Backend Intern</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="statistics-section">
        <div className="section-container statistics-grid">
          <div className="statistic-item">
            <div className="statistic-icon"><i className="bi bi-briefcase-fill"></i></div>
            <div>
              <strong>480+</strong>
              <span>Việc làm đang tuyển</span>
            </div>
          </div>
          <div className="statistic-item">
            <div className="statistic-icon"><i className="bi bi-building"></i></div>
            <div>
              <strong>150+</strong>
              <span>Doanh nghiệp đối tác</span>
            </div>
          </div>
          <div className="statistic-item">
            <div className="statistic-icon"><i className="bi bi-mortarboard-fill"></i></div>
            <div>
              <strong>1.250+</strong>
              <span>Sinh viên tham gia</span>
            </div>
          </div>
          <div className="statistic-item">
            <div className="statistic-icon"><i className="bi bi-check-circle-fill"></i></div>
            <div>
              <strong>86%</strong>
              <span>Tỷ lệ tìm được thực tập</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section jobs-section">
        <div className="section-container">
          <div className="section-heading">
            <div>
              <span className="section-label">Cơ hội dành cho bạn</span>
              <h2>Việc làm nổi bật</h2>
              <p>Các vị trí thực tập mới nhất từ những doanh nghiệp uy tín.</p>
            </div>
            <a className="view-all-link" href="/jobs">
              Xem tất cả việc làm
              <i className="bi bi-arrow-right"></i>
            </a>
          </div>
          <div className="job-tabs">
            <button
              type="button"
              className={activeTab === "recommended" ? "active" : ""}
              onClick={() => setActiveTab("recommended")}
            >
              Gợi ý cho bạn
            </button>
            <button
              type="button"
              className={activeTab === "latest" ? "active" : ""}
              onClick={() => setActiveTab("latest")}
            >
              Mới nhất
            </button>
            <button
              type="button"
              className={activeTab === "popular" ? "active" : ""}
              onClick={() => setActiveTab("popular")}
            >
              Ứng tuyển nhiều
            </button>
          </div>
          <SearchJobs
            keyword={keyword}
            setKeyword={setKeyword}
            salary={salary}
            setSalary={setSalary}
            location={location}
            setLocation={setLocation}
            handleSearch={handleSearch}
            handleReset={handleResetSearch}
          />
          {error && (
            <div className="jobs-error">
              <i className="bi bi-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}
          {jobLoading && jobs.length === 0 && (
            <div className="jobs-loading">
              <i className="bi bi-arrow-repeat"></i>
              <span>Đang tải việc làm...</span>
            </div>
          )}
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobs.includes(job.id)}
                onSave={handleSaveJob}
              />
            ))}
          </div>
          {!jobLoading && filteredJobs.length === 0 && !error && (
            <div className="jobs-empty">
              <i className="bi bi-search"></i>
              <p>Không tìm thấy công việc phù hợp.</p>
            </div>
          )}
          {jobs.length > 0 && (
            <div className="load-more-wrapper">
              {jobHasMore ? (
                <button
                  className="load-more-button"
                  type="button"
                  onClick={handleLoadMore}
                  disabled={jobLoading}
                >
                  {jobLoading ? (
                    <>
                      <i className="bi bi-arrow-repeat"></i>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      Xem thêm việc làm
                      <i className="bi bi-arrow-down"></i>
                    </>
                  )}
                </button>
              ) : (
                <span className="no-more-jobs">Đã hiển thị tất cả việc làm</span>
              )}
            </div>
          )}
        </div>
      </section>
      <section className="section companies-section">
        <div className="section-container">
          <div className="section-heading">
            <div>
              <span className="section-label">Đối tác của InternHub</span>
              <h2>Doanh nghiệp</h2>
              <p>Kết nối với những doanh nghiệp đang có nhu cầu tuyển thực tập sinh.</p>
            </div>
            <a className="view-all-link" href="/companies">
              Xem tất cả
              <i className="bi bi-arrow-right"></i>
            </a>
          </div>
          {employerLoading && employer.length === 0 && (
            <div className="jobs-loading">
              <i className="bi bi-arrow-repeat"></i>
              <span>Đang tải doanh nghiệp...</span>
            </div>
          )}
          <div className="companies-grid">
            {employer.map((item) => (
              <Companies key={item.id} employer={item} />
            ))}
          </div>
          {employer.length > 0 && (
            <div className="load-more-wrapper">
              {employerHasMore ? (
                <button
                  className="load-more-button"
                  type="button"
                  onClick={handleLoadMoreEmployer}
                  disabled={employerLoading}
                >
                  {employerLoading ? (
                    <>
                      <i className="bi bi-arrow-repeat"></i>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      Xem thêm doanh nghiệp
                      <i className="bi bi-arrow-down"></i>
                    </>
                  )}
                </button>
              ) : (
                <span className="no-more-jobs">Đã hiển thị tất cả doanh nghiệp</span>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
export default Home;