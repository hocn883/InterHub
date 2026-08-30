import "./MyCv.css";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import { authApi, endpoints } from "../../../utils/api";
import PageHero from "../../../components/PageHero/PageHero";

function MyCv() {
  const { currentUser } = useContext(UserContext);
  const lecturer = currentUser?.lecturer;

  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCvs = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access-token");

        const response = await authApi(token).get(
          endpoints.myCvs
        );

        setCvList(response.data.result.content || []);
      } catch (error) {
        console.error(error);
        setError("Không thể tải danh sách CV");
      } finally {
        setLoading(false);
      }
    };

    loadCvs();
  }, []);

  const getStatus = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          text: "Đã duyệt",
          className: "approved",
        };

      case "REJECTED":
        return {
          text: "Cần chỉnh sửa",
          className: "rejected",
        };

      default:
        return {
          text: "Đang chờ",
          className: "pending",
        };
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
                  src={lecturer.avatarUrl}
                  alt={lecturer.fullName}
                />
              ) : (
                "GV"
              )}
            </div>

            <div className="mycv-lecturer-info">
              <span>GIẢNG VIÊN HƯỚNG DẪN</span>
              <strong>{lecturer.fullName}</strong>
              <p>@{lecturer.username}</p>
            </div>
          </section>
        )}

        <section className="mycv-list-section">
          <div className="mycv-section-heading">
            <div>
              <span className="mycv-label">
                CV ĐÃ GỬI
              </span>

              <h2>Lịch sử gửi CV</h2>
            </div>

            <div className="mycv-heading-actions">
              <span className="mycv-total">
                {cvList.length} CV
              </span>

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
              <span className="mycv-spinner"></span>
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
                <h3>Chưa có CV nào</h3>

                <p>
                  Bạn chưa gửi CV cho giảng viên hướng dẫn.
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
                {cvList.map((cv, index) => {
                  const status = getStatus(cv.status);

                  return (
                    <article
                      className="mycv-card"
                      key={cv.fileUrl || index}
                    >
                      <div className="mycv-card-header">
                        <div className="mycv-card-title">
                          <div className="mycv-file-icon">
                            CV
                          </div>

                          <div>
                            <h3>CV thực tập</h3>

                            <p>
                              Gửi ngày {cv.createdDate}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`mycv-status ${status.className}`}
                        >
                          {status.text}
                        </span>
                      </div>

                      <div className="mycv-card-information">
                        <div>
                          <span>Sinh viên</span>
                          <strong>{cv.studentName}</strong>
                        </div>

                        <div>
                          <span>Mã sinh viên</span>
                          <strong>
                            {currentUser?.mssv || cv.studentId}
                          </strong>
                        </div>

                        <div>
                          <span>Ngày gửi</span>
                          <strong>{cv.createdDate}</strong>
                        </div>

                        <div>
                          <span>Giảng viên</span>
                          <strong>
                            {lecturer?.fullName || "Chưa cập nhật"}
                          </strong>
                        </div>
                      </div>

                      <div className="mycv-feedback">
                        <span>
                          PHẢN HỒI GIẢNG VIÊN
                        </span>

                        {cv.lecturerFeedback ? (
                          <p>{cv.lecturerFeedback}</p>
                        ) : (
                          <p className="mycv-no-feedback">
                            Chưa có phản hồi từ giảng viên.
                          </p>
                        )}
                      </div>

                      <div className="mycv-card-actions">
                        <a
                          href={cv.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mycv-view-file"
                        >
                          Xem file CV
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default MyCv;