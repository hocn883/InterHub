import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import './CvTemplate.css'

const API_URL = 'http://localhost:8080/api/ai'

const templates = [
  {
    id: 'modern',
    name: 'Modern Blue',
    description: 'Hiện đại',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Cổ điển',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Tối giản',
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Thanh bên',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Chuyên nghiệp',
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Sinh viên',
  },
]

function CvTemplate() {
  const [selectedTemplate, setSelectedTemplate] =
    useState('modern')

  const [avatar, setAvatar] = useState(null)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    major: '',
    targetPosition: '',
    skills: '',
    education: '',
    projects: '',
    experience: '',
  })

  const [generatedCv, setGeneratedCv] = useState(null)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  /* =========================
     FORM
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  /* =========================
     AVATAR
  ========================= */

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh.')
      return
    }

    const imageUrl = URL.createObjectURL(file)

    setAvatar(imageUrl)
    setError('')
  }

  /* =========================
     GENERATE AI
  ========================= */

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

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
    }

    try {
      const response = await fetch(
        `${API_URL}/generate-cv`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }
      )

      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status}`
        )
      }

      const data = await response.json()

      console.log('AI CV RESPONSE:', data)

      /*
       * Backend response:
       *
       * fullName
       * email
       * phone
       * targetPosition
       * careerObjective
       * summary
       * skills
       * education
       * projects
       * experience
       */

      setGeneratedCv({
        fullName: data.fullName ?? form.fullName,
        email: data.email ?? form.email,
        phone: data.phone ?? form.phone,
        targetPosition:
          data.targetPosition ?? form.targetPosition,

        careerObjective:
          data.careerObjective ?? '',

        summary:
          data.summary ?? '',

        skills:
          data.skills ?? form.skills,

        education:
          data.education ?? form.education,

        projects:
          data.projects ?? form.projects,

        experience:
          data.experience ?? form.experience,
      })

    } catch (err) {
      console.error(err)

      setError(
        'Không thể kết nối đến API tạo CV. Hãy kiểm tra Backend và port 8080.'
      )
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     DOWNLOAD PDF
  ========================= */

  const downloadPdf = async () => {
    const element =
      document.getElementById('cv-paper')

    if (!element) {
      setError('Không tìm thấy CV để xuất PDF.')
      return
    }

    setError('')

    try {
      const canvas = await html2canvas(
        element,
        {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        }
      )

      const imageData =
        canvas.toDataURL('image/png')

      const pdf = new jsPDF(
        'p',
        'mm',
        'a4'
      )

      const pageWidth = 210
      const pageHeight = 297

      const imageWidth = pageWidth

      const imageHeight =
        (canvas.height * imageWidth) /
        canvas.width

      let heightLeft = imageHeight
      let position = 0

      pdf.addImage(
        imageData,
        'PNG',
        0,
        position,
        imageWidth,
        imageHeight
      )

      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imageHeight

        pdf.addPage()

        pdf.addImage(
          imageData,
          'PNG',
          0,
          position,
          imageWidth,
          imageHeight
        )

        heightLeft -= pageHeight
      }

      const fileName =
        form.fullName?.trim()
          ? form.fullName.trim()
          : 'CV-InternHub'

      pdf.save(
        `${fileName}-CV.pdf`
      )

    } catch (err) {
      console.error(err)

      setError(
        'Không thể tạo file PDF.'
      )
    }
  }

  /* =========================
     DATA USED BY CV
  ========================= */

  const cvData = generatedCv
    ? generatedCv
    : {
        ...form,
        careerObjective: '',
        summary: '',
      }

  return (
    <div className="cv-builder-page">

      <div className="cv-builder-container">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="cv-builder-header">

          <div className="cv-header-badge">
            CV BUILDER
          </div>

          <h1>
            Tạo CV chuyên nghiệp
          </h1>

          <p>
            Nhập thông tin, chọn mẫu CV và tải xuống
            ngay. Bạn cũng có thể sử dụng AI để hỗ trợ
            viết nội dung CV.
          </p>

        </div>

        <div className="cv-builder-layout">

          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="cv-form-card">

            <div className="card-heading">

              <div>
                <h2>
                  Thông tin CV
                </h2>

                <p>
                  Điền thông tin cá nhân của bạn
                </p>
              </div>

              <span>
                01
              </span>

            </div>

            {/* AVATAR */}

            <div className="avatar-upload-section">

              <div className="avatar-preview">

                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                  />
                ) : (
                  <span>
                    {form.fullName
                      ? form.fullName
                          .charAt(0)
                          .toUpperCase()
                      : 'A'}
                  </span>
                )}

              </div>

              <div className="avatar-information">

                <strong>
                  Ảnh đại diện
                </strong>

                <span>
                  JPG, PNG, WEBP
                </span>

                <label className="avatar-button">

                  Chọn ảnh

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={
                      handleAvatarChange
                    }
                  />

                </label>

              </div>

            </div>

            {/* FULL NAME */}

            <div className="form-group">

              <label>
                Họ và tên
              </label>

              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
              />

            </div>

            {/* EMAIL + PHONE */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@gmail.com"
                />

              </div>

              <div className="form-group">

                <label>
                  Số điện thoại
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                />

              </div>

            </div>

            {/* MAJOR */}

            <div className="form-group">

              <label>
                Chuyên ngành
              </label>

              <input
                name="major"
                value={form.major}
                onChange={handleChange}
                placeholder="Công nghệ thông tin"
              />

            </div>

            {/* POSITION */}

            <div className="form-group">

              <label>
                Vị trí mong muốn
              </label>

              <input
                name="targetPosition"
                value={
                  form.targetPosition
                }
                onChange={handleChange}
                placeholder="Java Backend Developer"
              />

            </div>

            {/* SKILLS */}

            <div className="form-group">

              <label>
                Kỹ năng
              </label>

              <textarea
                name="skills"
                value={form.skills}
                onChange={handleChange}
                rows="4"
                placeholder="Java, Spring Boot, MySQL, React..."
              />

            </div>

            {/* EDUCATION */}

            <div className="form-group">

              <label>
                Học vấn
              </label>

              <textarea
                name="education"
                value={form.education}
                onChange={handleChange}
                rows="4"
                placeholder="Trường, chuyên ngành, GPA..."
              />

            </div>

            {/* PROJECT */}

            <div className="form-group">

              <label>
                Dự án
              </label>

              <textarea
                name="projects"
                value={form.projects}
                onChange={handleChange}
                rows="5"
                placeholder="Tên dự án, công nghệ, vai trò..."
              />

            </div>

            {/* EXPERIENCE */}

            <div className="form-group">

              <label>
                Kinh nghiệm
              </label>

              <textarea
                name="experience"
                value={form.experience}
                onChange={handleChange}
                rows="5"
                placeholder="Thực tập, công việc, hoạt động..."
              />

            </div>

          </div>

          {/* ==================================================
              RIGHT
          ================================================== */}

          <div className="cv-preview-column">

            {/* TEMPLATE */}

            <div className="template-selector">

              <div className="selector-header">

                <div>

                  <div className="section-number">
                    02
                  </div>

                  <h2>
                    Chọn mẫu CV
                  </h2>

                  <p>
                    Chọn một thiết kế phù hợp với bạn
                  </p>

                </div>

                <span className="template-count">
                  {templates.length} mẫu
                </span>

              </div>

              <div className="template-list">

                {templates.map((template) => (

                  <button
                    type="button"
                    key={template.id}
                    className={`template-option ${
                      selectedTemplate ===
                      template.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedTemplate(
                        template.id
                      )
                    }
                  >

                    <TemplateThumbnail
                      type={template.id}
                    />

                    <div className="template-name">
                      {template.name}
                    </div>

                    <div className="template-description">
                      {template.description}
                    </div>

                  </button>

                ))}

              </div>

            </div>

            {/* PREVIEW */}

            <div className="cv-preview-card">

              <div className="preview-header">

                <div>

                  <div className="section-number">
                    03
                  </div>

                  <h2>
                    Xem trước CV
                  </h2>

                  <p>
                    {templates.find(
                      (item) =>
                        item.id ===
                        selectedTemplate
                    )?.name}
                  </p>

                </div>

                <div className="a4-badge">
                  A4
                </div>

              </div>

              <div className="cv-paper-wrapper">

                <div
                  id="cv-paper"
                  className={`cv-paper template-${selectedTemplate}`}
                >

                  <CvContent
                    data={cvData}
                    avatar={avatar}
                    template={
                      selectedTemplate
                    }
                  />

                </div>

              </div>

              {error && (
                <div className="cv-error">
                  {error}
                </div>
              )}

              {/* ACTIONS */}

              <div className="cv-actions">

                <button
                  type="button"
                  className="download-button"
                  onClick={downloadPdf}
                >
                  <span>
                    ↓
                  </span>

                  Tải CV PDF

                </button>

                <button
                  type="button"
                  className="generate-button"
                  onClick={handleGenerate}
                  disabled={loading}
                >

                  <span>
                    ✨
                  </span>

                  {loading
                    ? 'AI đang tạo...'
                    : 'AI tạo nội dung'}

                </button>

              </div>

              <p className="action-hint">
                Bạn có thể tải CV ngay cả khi không
                sử dụng AI.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   CV CONTENT
========================================================= */

function CvContent({
  data,
  avatar,
  template,
}) {

  switch (template) {

    case 'classic':
      return (
        <ClassicTemplate
          data={data}
          avatar={avatar}
        />
      )

    case 'minimal':
      return (
        <MinimalTemplate
          data={data}
          avatar={avatar}
        />
      )

    case 'sidebar':
      return (
        <SidebarTemplate
          data={data}
          avatar={avatar}
        />
      )

    case 'professional':
      return (
        <ProfessionalTemplate
          data={data}
          avatar={avatar}
        />
      )

    case 'student':
      return (
        <StudentTemplate
          data={data}
          avatar={avatar}
        />
      )

    default:
      return (
        <ModernTemplate
          data={data}
          avatar={avatar}
        />
      )
  }
}


/* =========================================================
   MODERN
========================================================= */

function ModernTemplate({ data, avatar }) {

  return (
    <>

      <div className="modern-header">

        <Avatar
          avatar={avatar}
          name={data.fullName}
        />

        <div className="modern-header-info">

          <h1>
            {data.fullName ||
              'NGUYỄN VĂN A'}
          </h1>

          <h2>
            {data.targetPosition ||
              'VỊ TRÍ MONG MUỐN'}
          </h2>

          <Contact
            data={data}
          />

        </div>

      </div>

      <CvSection
        title="GIỚI THIỆU"
        content={data.summary}
      />

      <CvSection
        title="MỤC TIÊU NGHỀ NGHIỆP"
        content={
          data.careerObjective
        }
      />

      <CvSection
        title="KỸ NĂNG"
        content={data.skills}
      />

      <CvSection
        title="KINH NGHIỆM"
        content={data.experience}
      />

      <CvSection
        title="DỰ ÁN"
        content={data.projects}
      />

      <CvSection
        title="HỌC VẤN"
        content={data.education}
      />

    </>
  )
}


/* =========================================================
   CLASSIC
========================================================= */

function ClassicTemplate({
  data,
  avatar,
}) {

  return (
    <>

      <div className="classic-header">

        <Avatar
          avatar={avatar}
          name={data.fullName}
        />

        <div>

          <h1>
            {data.fullName ||
              'Nguyễn Văn A'}
          </h1>

          <h2>
            {data.targetPosition ||
              'Vị trí mong muốn'}
          </h2>

          <Contact
            data={data}
          />

        </div>

      </div>

      <div className="classic-divider" />

      <CvSection
        title="PROFILE"
        content={data.summary}
      />

      <CvSection
        title="CAREER OBJECTIVE"
        content={
          data.careerObjective
        }
      />

      <CvSection
        title="EXPERIENCE"
        content={data.experience}
      />

      <CvSection
        title="PROJECTS"
        content={data.projects}
      />

      <CvSection
        title="EDUCATION"
        content={data.education}
      />

      <CvSection
        title="SKILLS"
        content={data.skills}
      />

    </>
  )
}


/* =========================================================
   MINIMAL
========================================================= */

function MinimalTemplate({
  data,
  avatar,
}) {

  return (
    <>

      <div className="minimal-header">

        <div>

          <h1>
            {data.fullName ||
              'Nguyễn Văn A'}
          </h1>

          <p>
            {data.targetPosition ||
              'Vị trí mong muốn'}
          </p>

          <Contact
            data={data}
          />

        </div>

        <Avatar
          avatar={avatar}
          name={data.fullName}
        />

      </div>

      <CvSection
        title="SUMMARY"
        content={data.summary}
      />

      <CvSection
        title="OBJECTIVE"
        content={
          data.careerObjective
        }
      />

      <div className="minimal-grid">

        <div>

          <CvSection
            title="EXPERIENCE"
            content={
              data.experience
            }
          />

          <CvSection
            title="PROJECTS"
            content={
              data.projects
            }
          />

        </div>

        <div>

          <CvSection
            title="EDUCATION"
            content={
              data.education
            }
          />

          <CvSection
            title="SKILLS"
            content={
              data.skills
            }
          />

        </div>

      </div>

    </>
  )
}


/* =========================================================
   SIDEBAR
========================================================= */

function SidebarTemplate({
  data,
  avatar,
}) {

  return (
    <div className="sidebar-layout">

      <aside className="sidebar">

        <Avatar
          avatar={avatar}
          name={data.fullName}
        />

        <h1>
          {data.fullName ||
            'Nguyễn Văn A'}
        </h1>

        <h2>
          {data.targetPosition ||
            'Vị trí mong muốn'}
        </h2>

        <div className="sidebar-contact">

          <Contact
            data={data}
          />

        </div>

        <SidebarSection
          title="KỸ NĂNG"
          content={data.skills}
        />

        <SidebarSection
          title="HỌC VẤN"
          content={data.education}
        />

      </aside>

      <main className="sidebar-main">

        <CvSection
          title="GIỚI THIỆU"
          content={data.summary}
        />

        <CvSection
          title="MỤC TIÊU"
          content={
            data.careerObjective
          }
        />

        <CvSection
          title="KINH NGHIỆM"
          content={data.experience}
        />

        <CvSection
          title="DỰ ÁN"
          content={data.projects}
        />

      </main>

    </div>
  )
}


/* =========================================================
   PROFESSIONAL
========================================================= */

function ProfessionalTemplate({
  data,
  avatar,
}) {

  return (
    <>

      <div className="professional-header">

        <Avatar
          avatar={avatar}
          name={data.fullName}
        />

        <div>

          <h1>
            {data.fullName ||
              'NGUYỄN VĂN A'}
          </h1>

          <h2>
            {data.targetPosition ||
              'PROFESSIONAL'}
          </h2>

        </div>

      </div>

      <Contact
        data={data}
      />

      <div className="professional-line" />

      <CvSection
        title="PROFESSIONAL SUMMARY"
        content={data.summary}
      />

      <CvSection
        title="CAREER OBJECTIVE"
        content={
          data.careerObjective
        }
      />

      <CvSection
        title="WORK EXPERIENCE"
        content={data.experience}
      />

      <CvSection
        title="PROJECTS"
        content={data.projects}
      />

      <CvSection
        title="EDUCATION"
        content={data.education}
      />

      <CvSection
        title="TECHNICAL SKILLS"
        content={data.skills}
      />

    </>
  )
}


/* =========================================================
   STUDENT
========================================================= */

function StudentTemplate({
  data,
  avatar,
}) {

  return (
    <>

      <div className="student-header">

        <Avatar
          avatar={avatar}
          name={data.fullName}
        />

        <div>

          <h1>
            {data.fullName ||
              'Nguyễn Văn A'}
          </h1>

          <h2>
            {data.targetPosition ||
              'Vị trí thực tập'}
          </h2>

          <p>
            {data.major ||
              'Công nghệ thông tin'}
          </p>

          <Contact
            data={data}
          />

        </div>

      </div>

      <div className="student-objective">

        <h3>
          MỤC TIÊU NGHỀ NGHIỆP
        </h3>

        <p>
          {data.careerObjective ||
            'Mục tiêu nghề nghiệp của bạn...'}
        </p>

      </div>

      <div className="student-columns">

        <div>

          <CvSection
            title="HỌC VẤN"
            content={data.education}
          />

          <CvSection
            title="DỰ ÁN"
            content={data.projects}
          />

        </div>

        <div>

          <CvSection
            title="KỸ NĂNG"
            content={data.skills}
          />

          <CvSection
            title="KINH NGHIỆM"
            content={data.experience}
          />

        </div>

      </div>

      <CvSection
        title="GIỚI THIỆU"
        content={data.summary}
      />

    </>
  )
}


/* =========================================================
   COMMON COMPONENTS
========================================================= */

function Avatar({
  avatar,
  name,
}) {

  return (
    <div className="cv-avatar">

      {avatar ? (

        <img
          src={avatar}
          alt={name || 'Avatar'}
        />

      ) : (

        <span>
          {name
            ? name
                .charAt(0)
                .toUpperCase()
            : 'A'}
        </span>

      )}

    </div>
  )
}


function Contact({ data }) {

  return (
    <div className="cv-contact">

      {data.email && (
        <span>
          ✉ {data.email}
        </span>
      )}

      {data.phone && (
        <span>
          ☎ {data.phone}
        </span>
      )}

    </div>
  )
}


function CvSection({
  title,
  content,
}) {

  if (!content) {
    return null
  }

  return (
    <section className="cv-section">

      <h3>
        {title}
      </h3>

      <p>
        {content}
      </p>

    </section>
  )
}


function SidebarSection({
  title,
  content,
}) {

  if (!content) {
    return null
  }

  return (
    <section className="sidebar-section">

      <h3>
        {title}
      </h3>

      <p>
        {content}
      </p>

    </section>
  )
}


/* =========================================================
   TEMPLATE THUMBNAIL
========================================================= */

function TemplateThumbnail({
  type,
}) {

  return (
    <div
      className={`template-thumbnail thumbnail-${type}`}
    >

      {type === 'sidebar' && (
        <div className="thumbnail-sidebar-block" />
      )}

      <div className="thumbnail-top">

        <div className="thumbnail-avatar" />

        <div className="thumbnail-header-lines">

          <div className="thumbnail-name" />

          <div className="thumbnail-small-line" />

        </div>

      </div>

      <div className="thumbnail-section-title" />

      <div className="thumbnail-line" />

      <div className="thumbnail-line" />

      <div className="thumbnail-line short" />

      <div className="thumbnail-section-title" />

      <div className="thumbnail-line" />

      <div className="thumbnail-line short" />

    </div>
  )
}

export default CvTemplate