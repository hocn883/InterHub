import { useMemo, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./CvTemplate.css";
import templates from "./templates";
import { authApi, endpoints } from "../../../../utils/api";

function CvTemplate() {
  const [selectedTemplate, setSelectedTemplate] = useState(
    templates[0]?.id || ""
  );
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    major: "",
    targetPosition: "",
    careerObjective: "",
    summary: "",
    skills: "",
    education: "",
    projects: "",
    experience: "",
  });

  const currentTemplate = useMemo(() => {
    return (
      templates.find((template) => template.id === selectedTemplate) ||
      templates[0]
    );
  }, [selectedTemplate]);

  const SelectedTemplate = currentTemplate?.component;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file hình ảnh.");
      return;
    }

    if (avatar) URL.revokeObjectURL(avatar);

    const imageUrl = URL.createObjectURL(file);

    setAvatar(imageUrl);
    setError("");
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      const request = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        major: form.major,
        targetPosition: form.targetPosition,
        skills: form.skills,
        education: form.education,
        projects: form.projects,
        experience: form.experience,
      };

      const token = localStorage.getItem("access-token");

      const response = await authApi(token).post(
        endpoints.generateCv,
        request
      );

      const data = response.data;

      console.log("AI CV RESPONSE:", data);

      setForm((prev) => ({
        ...prev,
        fullName: data.fullName ?? prev.fullName,
        email: data.email ?? prev.email,
        phone: data.phone ?? prev.phone,
        major: data.major ?? prev.major,
        targetPosition: data.targetPosition ?? prev.targetPosition,
        careerObjective: data.careerObjective ?? prev.careerObjective,
        summary: data.summary ?? prev.summary,
        skills: data.skills ?? prev.skills,
        education: data.education ?? prev.education,
        projects: data.projects ?? prev.projects,
        experience: data.experience ?? prev.experience,
      }));
    } catch (error) {
      console.error("GENERATE CV ERROR:", error);

      const data = error.response?.data;

      if (typeof data === "string") {
        setError(data);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError(
          error.message ||
          "Không thể kết nối API tạo CV."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    const element = document.getElementById("cv-paper");

    if (!element) {
      setError("Không tìm thấy CV.");
      return;
    }

    try {
      setError("");

      const canvas = await html2canvas(element, {
        scale: 1.2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/jpeg", 0.75);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const imageWidth = pageWidth;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;

      let heightLeft = imageHeight;
      let position = 0;

      pdf.addImage(
        imageData,
        "JPEG",
        0,
        position,
        imageWidth,
        imageHeight,
        undefined,
        "FAST"
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imageHeight;

        pdf.addPage();

        pdf.addImage(
          imageData,
          "JPEG",
          0,
          position,
          imageWidth,
          imageHeight,
          undefined,
          "FAST"
        );

        heightLeft -= pageHeight;
      }

      const fileName = form.fullName?.trim() || "CV-InternHub";

      pdf.save(`${fileName}-CV.pdf`);
    } catch (error) {
      console.error("DOWNLOAD PDF ERROR:", error);
      setError("Không thể tạo PDF.");
    }
  };

  return (
    <div className="cv-builder-page">
      <div className="cv-builder-container">
        <div className="cv-builder-header">
          <span className="cv-header-badge">CV BUILDER</span>
          <h1>Tạo CV chuyên nghiệp</h1>
          <p>Nhập thông tin, chọn mẫu và tải CV.</p>
        </div>

        <div className="cv-builder-layout">
          <div className="cv-form-card">
            <div className="card-heading">
              <div>
                <h2>Thông tin CV</h2>
                <p>Điền thông tin của bạn</p>
              </div>

              <span>01</span>
            </div>

            <div className="avatar-upload-section">
              <div className="avatar-preview">
                {avatar ? (
                  <img src={avatar} alt="Avatar" />
                ) : (
                  <span>
                    {form.fullName?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                )}
              </div>

              <div className="avatar-information">
                <strong>Ảnh đại diện</strong>
                <span>JPG, PNG, WEBP</span>

                <label className="avatar-button">
                  Chọn ảnh

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>

            <FormInput
              label="Họ và tên"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
            />

            <div className="form-row">
              <FormInput
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@gmail.com"
              />

              <FormInput
                label="Số điện thoại"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0123456789"
              />
            </div>

            <FormInput
              label="Chuyên ngành"
              name="major"
              value={form.major}
              onChange={handleChange}
              placeholder="Công nghệ thông tin"
            />

            <FormInput
              label="Vị trí mong muốn"
              name="targetPosition"
              value={form.targetPosition}
              onChange={handleChange}
              placeholder="Java Backend Developer"
            />

            <FormTextarea
              label="Kỹ năng"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              rows={4}
              placeholder="Java, Spring Boot, React..."
            />

            <FormTextarea
              label="Học vấn"
              name="education"
              value={form.education}
              onChange={handleChange}
              rows={4}
              placeholder="Trường, chuyên ngành, GPA..."
            />

            <FormTextarea
              label="Dự án"
              name="projects"
              value={form.projects}
              onChange={handleChange}
              rows={5}
              placeholder="Tên dự án, công nghệ, vai trò..."
            />

            <FormTextarea
              label="Kinh nghiệm"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              rows={5}
              placeholder="Thực tập, công việc, hoạt động..."
            />
          </div>

          <div className="cv-preview-column">
            <div className="cv-paper-area">
              <div className="cv-paper-wrapper">
                <div id="cv-paper" className="cv-paper">
                  {SelectedTemplate ? (
                    <SelectedTemplate data={form} avatar={avatar} />
                  ) : (
                    <div className="no-template">
                      Không tìm thấy mẫu CV.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && <div className="cv-error">{error}</div>}

            <div className="cv-actions">
              <button
                type="button"
                className="download-button"
                onClick={downloadPdf}
              >
                ↓ Tải CV PDF
              </button>

              <button
                type="button"
                className="generate-button"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? "AI đang tạo..." : "✨ AI tạo nội dung"}
              </button>
            </div>
          </div>

          <div className="template-column">
            <div className="template-heading">
              <span className="section-number">02</span>
              <h2>Chọn mẫu</h2>
              <p>{templates.length} mẫu CV</p>
            </div>

            <div className="template-scroll">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className={`template-card ${
                    selectedTemplate === template.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <TemplateThumbnail template={template} />
                  <strong>{template.name}</strong>
                  <span>{template.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="form-group">
      <label>{label}</label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows,
}) {
  return (
    <div className="form-group">
      <label>{label}</label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}

function TemplateThumbnail({ template }) {
  return (
    <div
      className="template-thumbnail"
      style={{
        "--template-color": template.previewColor || "#2563eb",
      }}
    >
      <div className="thumb-header">
        <div className="thumb-avatar" />

        <div className="thumb-heading">
          <span />
          <small />
        </div>
      </div>

      <div className="thumb-title" />
      <div className="thumb-line" />
      <div className="thumb-line" />
      <div className="thumb-line short" />
      <div className="thumb-title" />
      <div className="thumb-line" />
      <div className="thumb-line short" />
    </div>
  );
}

export default CvTemplate;