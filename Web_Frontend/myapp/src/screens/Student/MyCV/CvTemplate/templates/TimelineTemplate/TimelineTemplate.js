import "./TimelineTemplate.css";

export const templateInfo = {
  id: "timeline",
  name: "Timeline",
  description: "Phong cách timeline",
  previewColor: "#6b5bd2",
  order: 13,
};

function TimelineTemplate({
  data,
  avatar,
}) {
  return (
    <div className="timeline-template">

      <header className="timeline-header">

        {avatar && (
          <img
            src={avatar}
            alt="Avatar"
          />
        )}

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
            {" • "}
            {data.phone ||
              "0123456789"}
          </p>
        </div>

      </header>

      <main className="timeline-body">

        <TimelineItem
          number="01"
          title="GIỚI THIỆU"
          content={
            data.summary ||
            "Giới thiệu về bản thân."
          }
        />

        <TimelineItem
          number="02"
          title="MỤC TIÊU"
          content={
            data.careerObjective ||
            "Mục tiêu nghề nghiệp."
          }
        />

        <TimelineItem
          number="03"
          title="KINH NGHIỆM"
          content={
            data.experience ||
            "Kinh nghiệm làm việc."
          }
        />

        <TimelineItem
          number="04"
          title="DỰ ÁN"
          content={
            data.projects ||
            "Các dự án đã thực hiện."
          }
        />

        <TimelineItem
          number="05"
          title="HỌC VẤN"
          content={
            data.education ||
            "Thông tin học vấn."
          }
        />

        <TimelineItem
          number="06"
          title="KỸ NĂNG"
          content={
            data.skills ||
            "Các kỹ năng."
          }
        />

      </main>

    </div>
  );
}

function TimelineItem({
  number,
  title,
  content,
}) {
  return (
    <section className="timeline-item">

      <div className="timeline-marker">
        {number}
      </div>

      <div className="timeline-content">

        <h3>
          {title}
        </h3>

        <p>
          {content}
        </p>

      </div>

    </section>
  );
}

export default TimelineTemplate;