import "./MyCv.css";
import {useContext, useEffect, useState,} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import {authApi,endpoints} from "../../../utils/api";
import PageHero from "../../../components/PageHero/PageHero";
import CvCard from "./CvCard/CvCard";
function MyCv() {
  const { currentUser } =
    useContext(UserContext);
  const lecturer =
    currentUser?.lecturer;
  const [cvList, setCvList] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");
  const [deletingId, setDeletingId] =
    useState(null);
  const loadCvs = async () => {
    try {
      setLoading(true);
      setError("");
      const token =
        localStorage.getItem(
          "access-token"
        );
      const response =
        await authApi(token).get(
          endpoints.myCvs
        );
      setCvList(
        response.data.result?.content ||
          []
      );
    } catch (err) {
      console.error(err);
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

  const handleDeleteCv = async (
    cv
  ) => {
    if (cv.status !== "PENDING") {
      alert(
        "Chỉ có thể xóa CV đang chờ duyệt");
      return;
    }

    const confirmDelete =
      window.confirm(
        "Bạn có chắc muốn xóa CV này không?"
      );
    if (!confirmDelete) {
      return;
    }
    try {
      setDeletingId(cv.id);
      const token =
        localStorage.getItem(
          "access-token"
        );
      await authApi(token).delete(
        endpoints.myCv(cv.id)
      );
      setCvList((prev) => prev.filter((item) =>
            item.id !== cv.id
        ));
      alert("Xóa CV thành công");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Không thể xóa CV"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mycv-page">
      <PageHero
        badge="HỒ SƠ THỰC TẬP"
        title="CV"
        highlight="của tôi"
        description="Theo dõi CV đã gửi, trạng thái xét duyệt và phản hồi từ giảng viên hướng dẫn."
      />

      <main className="mycv-container mycv-main-content">
        {lecturer && (
          <section className="mycv-lecturer">
            <div className="mycv-lecturer-avatar">
              {lecturer.avatarUrl ? (
                <img
                  src={
                    lecturer.avatarUrl
                  }
                  alt={
                    lecturer.fullName
                  }
                />
              ) : (
                "GV"
              )}
            </div>

            <div className="mycv-lecturer-info">
              <span>
                GIẢNG VIÊN HƯỚNG DẪN
              </span>

              <strong>
                {lecturer.fullName}
              </strong>

              <p>
                @{lecturer.username}
              </p>
            </div>
          </section>
        )}

        <section className="mycv-list-section">
          <div className="mycv-section-heading">
            <div>
              <span className="mycv-label">
                CV ĐÃ GỬI
              </span>

              <h2>
                Lịch sử gửi CV
              </h2>
            </div>

            <div className="mycv-heading-actions">
              <span className="mycv-total">
                {cvList.length} CV
              </span>

              <Link
                to="/cv/scoring"
                className="mycv-feature-button"
              >
                Chấm điểm CV
              </Link>

              <Link
                to="/cv/templates"
                className="mycv-ai-button"
              >
                Tạo CV bằng AI
              </Link>

              <Link
                to="/mycv/send"
                className="mycv-send-button"
              >
                + Gửi CV mới
              </Link>
            </div>
          </div>

          {loading && (
            <div className="mycv-loading">
              <span className="mycv-spinner" />

              Đang tải danh sách CV...
            </div>
          )}

          {!loading && error && (
            <div className="mycv-error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            cvList.length === 0 && (
              <div className="mycv-empty">
                <h3>
                  Chưa có CV nào
                </h3>

                <p>
                  Bạn chưa gửi CV cho
                  giảng viên hướng dẫn.
                </p>

                <Link
                  to="/mycv/send"
                  className="mycv-empty-button"
                >
                  Gửi CV đầu tiên
                </Link>
              </div>
            )}

          {!loading &&
            !error &&
            cvList.length > 0 && (
              <div className="mycv-cards">
                {cvList.map(
                  (cv, index) => (
                    <CvCard
                      key={
                        cv.id ||
                        cv.fileUrl ||
                        index
                      }
                      cv={cv}
                      currentUser={
                        currentUser
                      }
                      lecturer={
                        lecturer
                      }
                      onDelete={
                        handleDeleteCv
                      }
                      deleting={
                        deletingId ===
                        cv.id
                      }
                    />
                  )
                )}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default MyCv;