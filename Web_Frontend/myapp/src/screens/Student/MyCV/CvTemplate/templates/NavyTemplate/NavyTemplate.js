import "./NavyTemplate.css";

export const templateInfo = {
  id: "navy",
  name: "Navy",
  description: "Xanh navy mạnh mẽ",
  previewColor: "#0f2747",
  order: 12,
};

function NavyTemplate({
  data,
  avatar,
}) {
  const initial =
    data.fullName
      ?.charAt(0)
      ?.toUpperCase() ||
    "A";

  return (
    <div className="navy-template">

      <header className="navy-header">

        <div className="navy-avatar">

          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
            />
          ) : (
            <span>
              {initial}
            </span>
          )}

        </div>

        <div>
          <h1>
            {data.fullName ||
              "NGUYỄN VĂN A"}
          </h1>

          <h2>
            {data.targetPosition ||
              "SOFTWARE ENGINEER"}
          </h2>

          <p>
            {data.email ||
              "email@gmail.com"}
            {" | "}
            {data.phone ||
              "0123456789"}
          </p>
        </div>

      </header>

      <main className="navy-body">

        <NavySection
          title="PROFILE"
          content={
            data.summary ||
            "Giới thiệu ngắn về bản thân."
          }
        />

        <NavySection
          title="CAREER OBJECTIVE"
          content={
            data.careerObjective ||
            "Mục tiêu nghề nghiệp."
          }
        />

        <NavySection
          title="EXPERIENCE"
          content={
            data.experience ||
            "Kinh nghiệm làm việc."
          }
        />

        <NavySection
          title="PROJECTS"
          content={
            data.projects ||
            "Các dự án đã thực hiện."
          }
        />

        <div className="navy-grid">

          <NavySection
            title="EDUCATION"
            content={
              data.education ||
              "Thông tin học vấn."
            }
          />

          <NavySection
            title="SKILLS"
            content={
              data.skills ||
              "Các kỹ năng."
            }
          />

        </div>

      </main>

    </div>
  );
}

function NavySection({
  title,
  content,
}) {
  return (
    <section className="navy-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </section>
  );
}

export default NavyTemplate;