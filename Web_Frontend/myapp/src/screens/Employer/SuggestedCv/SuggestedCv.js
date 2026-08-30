import { useEffect, useMemo, useState } from "react";
import SuggestedCvCard from "./SuggestedCvCard/SuggestedCvCard";
import PageHeroEmployer from "../../../components/PageHeroEmployer/PageHeroEmployer";
import "./SuggestedCv.css";
import api, { endpoints } from "../../../utils/api";

const SuggestedCv = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSuggestedCv = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        endpoints.suggestedCv
      );

      const data =
        response.data?.result?.content || [];

      setApplications(data);
    } catch (error) {
      console.error(
        "Load suggested CV error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Không thể tải danh sách CV đề xuất"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestedCv();
  }, []);

  const sortedApplications = useMemo(() => {
    return [...applications].sort(
      (a, b) =>
        (b.cvScore ?? 0) -
        (a.cvScore ?? 0)
    );
  }, [applications]);

  return (
    <div className="suggested-cv-page">
      <PageHeroEmployer
        badge="GỢI Ý ỨNG VIÊN"
        title="CV"
        highlight="đề xuất"
        description="Các hồ sơ đã được giảng viên xác nhận và có thể được nhà tuyển dụng tham khảo."
      />

      <main className="suggested-cv-container suggested-cv-main">
        {loading && (
          <div className="suggested-loading">
            <i className="bi bi-stars"></i>
            <span>Đang tải danh sách CV...</span>
          </div>
        )}

        {!loading && error && (
          <div className="suggested-error">
            <i className="bi bi-exclamation-circle"></i>
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          sortedApplications.length > 0 && (
            <div className="suggested-cv-list">
              {sortedApplications.map(
                (application, index) => (
                  <SuggestedCvCard
                    key={application.id}
                    application={application}
                    rank={index + 1}
                  />
                )
              )}
            </div>
          )}

        {!loading &&
          !error &&
          sortedApplications.length === 0 && (
            <div className="suggested-empty">
              <div className="suggested-empty-icon">
                <i className="bi bi-file-earmark-person"></i>
              </div>

              <h3>Chưa có CV phù hợp</h3>

              <p>
                Các CV đã được duyệt sẽ xuất hiện tại đây.
              </p>
            </div>
          )}
      </main>
    </div>
  );
};

export default SuggestedCv;