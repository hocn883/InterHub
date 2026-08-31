import "./MinimalTemplate.css";

export const templateInfo = {
  id: "minimal",
  name: "Minimal",
  description: "Tối giản",
  previewColor: "#222222",
  order: 3,
};

function MinimalTemplate({
  data,
  avatar,
}) {
  return (
    <div className="minimal-template">

      <header className="minimal-header">

        <div>
          <h1>
            {data.fullName ||
              "Nguyễn Văn A"}
          </h1>

          <h2>
            {data.targetPosition ||
              "Vị trí mong muốn"}
          </h2>

          <p>
            {data.email ||
              "email@gmail.com"}
            {" · "}
            {data.phone ||
              "0123456789"}
          </p>
        </div>

        {avatar && (
          <img
            src={avatar}
            alt="Avatar"
          />
        )}

      </header>

      <div className="minimal-divider" />

      <MinimalSection
        title="ABOUT"
        content={
          data.summary ||
          "Giới thiệu ngắn về bản thân."
        }
      />

      <div className="minimal-grid">

        <div>
          <MinimalSection
            title="EXPERIENCE"
            content={
              data.experience ||
              "Kinh nghiệm làm việc."
            }
          />

          <MinimalSection
            title="PROJECTS"
            content={
              data.projects ||
              "Các dự án nổi bật."
            }
          />
        </div>

        <div>
          <MinimalSection
            title="SKILLS"
            content={
              data.skills ||
              "Các kỹ năng."
            }
          />

          <MinimalSection
            title="EDUCATION"
            content={
              data.education ||
              "Thông tin học vấn."
            }
          />
        </div>

      </div>

    </div>
  );
}

function MinimalSection({
  title,
  content,
}) {
  return (
    <section className="minimal-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </section>
  );
}

export default MinimalTemplate;