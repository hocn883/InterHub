import "./ClassicTemplate.css";

export const templateInfo = {
  id: "classic",
  name: "Classic",
  description: "Cổ điển",
  previewColor: "#59483d",
  order: 2,
};

function ClassicTemplate({
  data,
  avatar,
}) {
  return (
    <div className="classic-template">

      <header className="classic-header">

        {avatar && (
          <img
            className="classic-avatar"
            src={avatar}
            alt="Avatar"
          />
        )}

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
          {"  •  "}
          {data.phone ||
            "0123456789"}
        </p>

      </header>

      <div className="classic-line" />

      <ClassicSection
        title="PROFILE"
        content={
          data.summary ||
          "Giới thiệu về bản thân."
        }
      />

      <ClassicSection
        title="CAREER OBJECTIVE"
        content={
          data.careerObjective ||
          "Mục tiêu nghề nghiệp."
        }
      />

      <ClassicSection
        title="EXPERIENCE"
        content={
          data.experience ||
          "Kinh nghiệm làm việc."
        }
      />

      <ClassicSection
        title="PROJECTS"
        content={
          data.projects ||
          "Các dự án đã thực hiện."
        }
      />

      <ClassicSection
        title="EDUCATION"
        content={
          data.education ||
          "Thông tin học vấn."
        }
      />

      <ClassicSection
        title="SKILLS"
        content={
          data.skills ||
          "Các kỹ năng nổi bật."
        }
      />

    </div>
  );
}

function ClassicSection({
  title,
  content,
}) {
  return (
    <section className="classic-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </section>
  );
}

export default ClassicTemplate;