import { useEffect, useMemo, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { authApi, endpoints } from "../../../utils/api";
import CvReviewCard from "./ReviewCvCard/CvReviewCard";
import PageHeroLecturer from "../../../components/PageHeroLecturer/PageHeroLecturer";
import "./LecturerCvs.css";

const FILTERS = [
  {
    value: "ALL",
    label: "Tất cả",
  },
  {
    value: "PENDING",
    label: "Chờ duyệt",
  },
  {
    value: "APPROVED",
    label: "Đã duyệt",
  },
  {
    value: "REJECTED",
    label: "Cần chỉnh sửa",
  },
];

function LecturerCvs() {
  const [cvs, setCvs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCvs = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("access-token");

      if (!token) {
        setError("Bạn chưa đăng nhập");
        return;
      }

      const response = await authApi(token).get(
        endpoints.lecturerCv
      );

      setCvs(response.data?.result || []);
    } catch (err) {
      console.error("Load CV error:", err);

      setError(
        err.response?.data?.message ||
          "Không thể tải danh sách CV"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCvs();
  }, []);

  const counts = useMemo(() => {
    return {
      ALL: cvs.length,

      PENDING: cvs.filter(
        (cv) => cv.status === "PENDING"
      ).length,

      APPROVED: cvs.filter(
        (cv) => cv.status === "APPROVED"
      ).length,

      REJECTED: cvs.filter(
        (cv) => cv.status === "REJECTED"
      ).length,
    };
  }, [cvs]);

  const filteredCvs = useMemo(() => {
    if (statusFilter === "ALL") {
      return cvs;
    }

    return cvs.filter(
      (cv) => cv.status === statusFilter
    );
  }, [cvs, statusFilter]);

  return (
    <div className="lecturer-cvs-page">
      <PageHeroLecturer
        badge="DUYỆT CV SINH VIÊN"
        title="Xem và đánh giá"
        highlight="CV sinh viên"
        description="Kiểm tra CV sinh viên gửi, đưa ra nhận xét và xác nhận CV trước khi sinh viên sử dụng để ứng tuyển."
      />

      <main className="page-container lecturer-cvs-main">
        <section className="cv-review-section">
          <div className="cv-review-heading">
            <div>
              <span className="section-label">
                CV SINH VIÊN
              </span>

              <h2>Danh sách CV</h2>

              <p>
                Xem nội dung và gửi phản hồi cho sinh viên.
              </p>
            </div>
          </div>

          <div className="cv-filter">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={
                  statusFilter === filter.value
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setStatusFilter(filter.value)
                }
              >
                {filter.label}

                <span className="cv-filter-count">
                  {counts[filter.value]}
                </span>
              </button>
            ))}
          </div>

          {loading && (
            <div className="cv-state-message">
              <p>
                <i className="bi bi-hourglass-split"></i>
                Đang tải danh sách CV...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="cv-state-message error">
              <p>{error}</p>

              <button
                type="button"
                className="cv-retry-button"
                onClick={loadCvs}
              >
                Thử lại
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            filteredCvs.length === 0 && (
              <div className="cv-state-message">
                <FiFileText className="cv-empty-icon" />

                <p>
                  Không có CV nào trong danh mục này.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            filteredCvs.length > 0 && (
              <div className="cv-review-list">
                {filteredCvs.map((cv) => (
                  <CvReviewCard
                    key={cv.id ?? cv.cvId}
                    cv={cv}
                    onUpdated={loadCvs}
                  />
                ))}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default LecturerCvs;