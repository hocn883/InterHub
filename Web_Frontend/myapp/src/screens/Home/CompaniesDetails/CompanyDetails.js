import "./CompanyDetails.css";

function CompanyDetails() {
  // =========================
  // DỮ LIỆU GIẢ
  // Sau này thay bằng API
  // =========================

  const company = {
    id: 1,
    name: "Công ty TNHH Công Nghệ ABC",
    logo: "https://via.placeholder.com/120",
    coverImage: "https://via.placeholder.com/1200x300",
    industry: "Công nghệ thông tin",
    size: "100 - 499 nhân viên",
    address: "Quận 1, TP. Hồ Chí Minh",
    website: "https://abc.com",
    description:
      "ABC là công ty chuyên phát triển các giải pháp phần mềm, website và ứng dụng di động cho doanh nghiệp.",
  };

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      salary: "3 - 5 triệu",
      location: "TP. Hồ Chí Minh",
    },
    {
      id: 2,
      title: "Java Spring Boot Intern",
      salary: "4 - 6 triệu",
      location: "TP. Hồ Chí Minh",
    },
    {
      id: 3,
      title: "React Developer",
      salary: "8 - 12 triệu",
      location: "Remote",
    },
  ];

  const reviews = [
    {
      id: 1,
      studentName: "Nguyễn Văn An",
      rating: 5,
      comment:
        "Môi trường làm việc tốt, anh chị hướng dẫn nhiệt tình. Phù hợp với sinh viên thực tập.",
      date: "05/08/2026",
    },
    {
      id: 2,
      studentName: "Trần Minh Hoàng",
      rating: 4,
      comment:
        "Công việc thực tế khá nhiều, học được nhiều về React và làm việc nhóm.",
      date: "01/08/2026",
    },
    {
      id: 3,
      studentName: "Lê Thanh Nam",
      rating: 4,
      comment:
        "Môi trường thân thiện, thời gian làm việc khá linh hoạt.",
      date: "25/07/2026",
    },
  ];

  return (
    <div className="company-details-page">

      {/* COVER */}
      <div className="company-cover">
        <img src={company.coverImage} alt="Company cover" />
      </div>

      {/* COMPANY HEADER */}
      <div className="company-header">
        <div className="company-header-left">
          <img
            className="company-logo"
            src={company.logo}
            alt={company.name}
          />

          <div>
            <h1>{company.name}</h1>
            <p>{company.industry}</p>

            <div className="company-header-info">
              <span>👥 {company.size}</span>
              <span>📍 {company.address}</span>
            </div>
          </div>
        </div>

        <button className="follow-button">
          + Theo dõi doanh nghiệp
        </button>
      </div>

      {/* MAIN */}
      <div className="company-content">

        {/* LEFT */}
        <div className="company-main">

          {/* GIỚI THIỆU */}
          <section className="company-section">
            <h2>Giới thiệu công ty</h2>

            <p>{company.description}</p>
          </section>

          {/* JOB */}
          <section className="company-section">
            <div className="section-header">
              <h2>Việc làm đang tuyển</h2>
              <span>{jobs.length} việc làm</span>
            </div>

            <div className="job-list">
              {jobs.map((job) => (
                <div className="job-card" key={job.id}>
                  <div>
                    <h3>{job.title}</h3>

                    <div className="job-info">
                      <span>💰 {job.salary}</span>
                      <span>📍 {job.location}</span>
                    </div>
                  </div>

                  <button
                    className="job-detail-button"
                    onClick={() => {
                      // Sau này:
                      // navigate(`/jobs/${job.id}`)
                      console.log("Job:", job.id);
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ĐÁNH GIÁ */}
          <section className="company-section">
            <div className="section-header">
              <h2>Đánh giá doanh nghiệp</h2>
              <span>{reviews.length} đánh giá</span>
            </div>

            <div className="review-list">
              {reviews.map((review) => (
                <div className="review-card" key={review.id}>

                  <div className="review-header">
                    <div className="review-user">
                      <div className="review-avatar">
                        {review.studentName.charAt(0)}
                      </div>

                      <div>
                        <h4>{review.studentName}</h4>
                        <span>{review.date}</span>
                      </div>
                    </div>

                    <div className="review-stars">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>

                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="company-sidebar">

          <div className="sidebar-card">
            <h3>Thông tin công ty</h3>

            <div className="info-item">
              <strong>Ngành nghề</strong>
              <span>{company.industry}</span>
            </div>

            <div className="info-item">
              <strong>Quy mô</strong>
              <span>{company.size}</span>
            </div>

            <div className="info-item">
              <strong>Địa chỉ</strong>
              <span>{company.address}</span>
            </div>

            <div className="info-item">
              <strong>Website</strong>

              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
              >
                {company.website}
              </a>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}

export default CompanyDetails;