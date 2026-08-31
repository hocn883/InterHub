import {
  FiArrowLeft,
  FiBriefcase,
  FiFileText,
  FiSend,
  FiUser,
} from "react-icons/fi";
import {
  useEffect,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  authApi,
  endpoints,
} from "../../../../utils/api";
import PageHeroEmployer from "../../../../components/PageHeroEmployer/PageHeroEmployer";
import "./EmployerInvite.css";

const EmployerInviteCv = () => {
  const { cvId } = useParams();

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const selectedCv =
    location.state?.cv;

  const [jobs, setJobs] =
    useState([]);

  const [
    selectedJobId,
    setSelectedJobId,
  ] = useState("");

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    loadingJobs,
    setLoadingJobs,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  useEffect(() => {
    loadMyJobs();
  }, []);

  const loadMyJobs =
    async () => {
      try {
        setLoadingJobs(true);

        const token =
          localStorage.getItem(
            "access-token"
          );

        if (!token) {
          alert(
            "Bạn chưa đăng nhập"
          );

          return;
        }

        const response =
          await authApi(
            token
          ).get(
            endpoints.employerJob
          );

        const data =
          response.data
            ?.result
            ?.content || [];

        const openJobs =
          data.filter(
            (job) =>
              job.status ===
              "OPEN"
          );

        setJobs(openJobs);
      } catch (err) {
        console.error(err);

        alert(
          err.response?.data
            ?.message ||
            "Không thể tải danh sách công việc"
        );
      } finally {
        setLoadingJobs(false);
      }
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !selectedJobId
      ) {
        alert(
          "Vui lòng chọn công việc muốn mời ứng viên"
        );

        return;
      }

      if (
        !title.trim()
      ) {
        alert(
          "Vui lòng nhập tiêu đề thư mời"
        );

        return;
      }

      try {
        setSubmitting(true);

        const token =
          localStorage.getItem(
            "access-token"
          );

        if (!token) {
          alert(
            "Bạn chưa đăng nhập"
          );

          return;
        }

        const requestBody = {
          cvId:
            Number(cvId),

          title:
            title.trim(),

          message:
            message.trim(),
        };

        await authApi(
          token
        ).post(
          endpoints.invitation(
            selectedJobId
          ),
          requestBody
        );

        alert(
          "Đã gửi lời mời đến ứng viên"
        );

        navigate(
          "/cv/suggestedCv"
        );
      } catch (err) {
        console.error(err);

        alert(
          err.response?.data
            ?.message ||
            "Không thể gửi lời mời"
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="invite-cv-page">

      <PageHeroEmployer
        badge="TUYỂN DỤNG ỨNG VIÊN"
        title="Gửi lời mời"
        highlight="tuyển dụng"
        description="Chọn vị trí đang tuyển và gửi lời mời trực tiếp đến ứng viên phù hợp."
      />

      <main className="invite-cv-container invite-cv-main">

        <button
          type="button"
          className="invite-back-button"
          onClick={() =>
            navigate(-1)
          }
        >
          <FiArrowLeft />

          Quay lại
        </button>

        <div className="invite-layout">

          {/* =====================
              CV ĐÃ CHỌN
          ===================== */}

          <aside className="invite-candidate-card">

            <div className="invite-section-title">
              CV đã chọn
            </div>

            <div className="invite-avatar">

              {selectedCv
                ?.studentName
                ?.charAt(0)
                ?.toUpperCase() ||
                "S"}

            </div>

            <h2>
              {selectedCv
                ?.studentName ||
                "Ứng viên"}
            </h2>

            <div className="invite-candidate-info">

              <div>

                <FiUser />

                <span>
                  Mã sinh viên
                </span>

                <strong>
                  {selectedCv
                    ?.studentId ||
                    "Chưa cập nhật"}
                </strong>

              </div>

              <div>

                <FiFileText />

                <span>
                  Mã CV
                </span>

                <strong>
                  #{cvId}
                </strong>

              </div>

            </div>

            {selectedCv
              ?.fileUrl && (
              <a
                href={
                  selectedCv.fileUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="invite-view-cv"
              >
                <FiFileText />

                Xem CV
              </a>
            )}

          </aside>

          {/* =====================
              FORM GỬI LỜI MỜI
          ===================== */}

          <section className="invite-form-card">

            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* CHỌN JOB */}

              <div className="invite-form-group">

                <label>

                  <FiBriefcase />

                  Chọn công việc

                  <span>
                    *
                  </span>

                </label>

                {loadingJobs ? (

                  <div className="invite-loading">
                    Đang tải công việc...
                  </div>

                ) : jobs.length ===
                  0 ? (

                  <div className="invite-empty">
                    Bạn chưa có công việc nào để gửi lời mời.
                  </div>

                ) : (

                  <select
                    value={
                      selectedJobId
                    }
                    onChange={(e) =>
                      setSelectedJobId(
                        e.target
                          .value
                      )
                    }
                  >

                    <option value="">
                      -- Chọn công việc --
                    </option>

                    {jobs.map(
                      (job) => (

                        <option
                          key={
                            job.id
                          }
                          value={
                            job.id
                          }
                        >
                          {
                            job.title
                          }
                        </option>

                      )
                    )}

                  </select>

                )}

              </div>

              {/* TIÊU ĐỀ THƯ MỜI */}

              <div className="invite-form-group">

                <label>

                  Tiêu đề thư mời

                  <span>
                    *
                  </span>

                </label>

                <input
                  type="text"
                  value={
                    title
                  }
                  maxLength="150"
                  onChange={(e) =>
                    setTitle(
                      e.target
                        .value
                    )
                  }
                  placeholder="Ví dụ: Thư mời ứng tuyển vị trí Backend Intern"
                />

              </div>

              {/* NỘI DUNG */}

              <div className="invite-form-group">

                <label>
                  Nội dung lời mời
                </label>

                <textarea
                  rows="7"
                  maxLength="1000"
                  value={
                    message
                  }
                  onChange={(e) =>
                    setMessage(
                      e.target
                        .value
                    )
                  }
                  placeholder="Ví dụ: Chúng tôi nhận thấy hồ sơ của bạn phù hợp với vị trí Backend Intern và mong muốn mời bạn tham gia quy trình tuyển dụng..."
                />

                <span className="invite-character-count">
                  {
                    message.length
                  }
                  /1000
                </span>

              </div>

              {/* ACTION */}

              <div className="invite-actions">

                <button
                  type="button"
                  className="invite-cancel-button"
                  onClick={() =>
                    navigate(-1)
                  }
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="invite-submit-button"
                  disabled={
                    submitting ||
                    !selectedJobId ||
                    !title.trim()
                  }
                >

                  <FiSend />

                  {submitting
                    ? "Đang gửi..."
                    : "Gửi lời mời"}

                </button>

              </div>

            </form>

          </section>

        </div>

      </main>

    </div>
  );
};

export default EmployerInviteCv;