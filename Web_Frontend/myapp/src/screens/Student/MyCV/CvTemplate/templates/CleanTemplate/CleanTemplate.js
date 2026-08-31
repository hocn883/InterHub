import "./CleanTemplate.css";

export const templateInfo = {
  id: "clean",
  name: "Clean",
  description: "Sạch và hiện đại",
  previewColor: "#3b82f6",
  order: 11,
};

function CleanTemplate({
  data,
  avatar,
}) {
  return (
    <div className="clean-template">

      <header className="clean-header">

        <div>
          <h1>
            {data.fullName ||
              "Nguyễn Văn A"}
          </h1>

          <h2>
            {data.targetPosition ||
              "Vị trí mong muốn"}
          </h2>

          <div className="clean-contact">
            <span>
              {data.email ||
                "email@gmail.com"}
            </span>

            <span>
              {data.phone ||
                "0123456789"}
            </span>
          </div>
        </div>

        {avatar && (
          <img
            src={avatar}
            alt="Avatar"
          />
        )}

      </header>

      <div className="clean-divider" />

      <CleanSection
        title="GIỚI THIỆU"
        content={
          data.summary ||
          "Giới thiệu ngắn về bản thân."
        }
      />

      <CleanSection
        title="MỤC TIÊU NGHỀ NGHIỆP"
        content={
          data.careerObjective ||
          "Mục tiêu nghề nghiệp của bạn."
        }
      />

      <div className="clean-grid">

        <div>
          <CleanSection
            title="KINH NGHIỆM"
            content={
              data.experience ||
              "Kinh nghiệm làm việc."
            }
          />

          <CleanSection
            title="DỰ ÁN"
            content={
              data.projects ||
              "Các dự án đã thực hiện."
            }
          />
        </div>

        <div>
          <CleanSection
            title="KỸ NĂNG"
            content={
              data.skills ||
              "Java, Spring Boot, MySQL..."
            }
          />

          <CleanSection
            title="HỌC VẤN"
            content={
              data.education ||
              "Thông tin học vấn."
            }
          />

          <CleanSection
            title="CHUYÊN NGÀNH"
            content={
              data.major ||
              "Công nghệ thông tin"
            }
          />
        </div>

      </div>

    </div>
  );
}

function CleanSection({
  title,
  content,
}) {
  return (
    <section className="clean-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </section>
  );
}

export default CleanTemplate;