import "./SidebarTemplate.css";

export const templateInfo = {
  id: "sidebar",
  name: "Sidebar",
  description: "Thanh bên",
  previewColor: "#24495f",
  order: 4,
};

function SidebarTemplate({
  data,
  avatar,
}) {
  const initial =
    data.fullName
      ?.charAt(0)
      ?.toUpperCase() ||
    "A";

  return (
    <div className="sidebar-template">

      <aside className="sidebar-left">

        <div className="sidebar-avatar">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
            />
          ) : (
            initial
          )}
        </div>

        <h1>
          {data.fullName ||
            "Nguyễn Văn A"}
        </h1>

        <h2>
          {data.targetPosition ||
            "Vị trí mong muốn"}
        </h2>

        <SidebarSection
          title="LIÊN HỆ"
          content={`${data.email || "email@gmail.com"}\n${data.phone || "0123456789"}`}
        />

        <SidebarSection
          title="KỸ NĂNG"
          content={
            data.skills ||
            "Java\nSpring Boot\nMySQL\nReact"
          }
        />

        <SidebarSection
          title="HỌC VẤN"
          content={
            data.education ||
            "Trường đại học"
          }
        />

      </aside>

      <main className="sidebar-main">

        <MainSection
          title="GIỚI THIỆU"
          content={
            data.summary ||
            "Giới thiệu về bản thân."
          }
        />

        <MainSection
          title="MỤC TIÊU"
          content={
            data.careerObjective ||
            "Mục tiêu nghề nghiệp."
          }
        />

        <MainSection
          title="KINH NGHIỆM"
          content={
            data.experience ||
            "Kinh nghiệm làm việc."
          }
        />

        <MainSection
          title="DỰ ÁN"
          content={
            data.projects ||
            "Các dự án."
          }
        />

      </main>

    </div>
  );
}

function SidebarSection({
  title,
  content,
}) {
  return (
    <section className="sidebar-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </section>
  );
}

function MainSection({
  title,
  content,
}) {
  return (
    <section className="sidebar-main-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </section>
  );
}

export default SidebarTemplate;