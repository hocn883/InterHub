import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsInbox } from "react-icons/bs";

import "./MyApplications.css";
import MyApplicationCard from "./MyApplicationCard/MyApplicationCard";
import { authApi, endpoints } from "../../../utils/api";
import PageHero from "../../../components/PageHero/PageHero";

function MyApplications() {
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access-token");
        const response = await authApi(token).get(endpoints.myapplications);

        setApplications(response.data.result?.content || []);
      } catch (error) {
        console.error("Lỗi load applications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleDeleteApplication = (applicationId) => {
    setApplications((prev) => prev.filter((item) => item.id !== applicationId));
  };

  const filteredApplications =
    selectedStatus === "ALL"
      ? applications
      : applications.filter((application) => application.status === selectedStatus);

  const pendingCount = applications.filter((item) => item.status === "PENDING").length;
  const approvedCount = applications.filter((item) => item.status === "APPROVED").length;
  const rejectedCount = applications.filter((item) => item.status === "REJECTED").length;
  const completedCount = applications.filter((item) => item.status === "COMPLETED").length;

  return (
    <div className="applications-page">
      <PageHero
        badge="QUẢN LÝ ỨNG TUYỂN"
        title="Việc làm"
        highlight="đã ứng tuyển"
        description="Theo dõi trạng thái các vị trí thực tập bạn đã ứng tuyển và quản lý quá trình tuyển dụng của mình."
      />

      <main className="applications-container applications-main">
        <div className="applications-heading">
          <div>
            <span className="section-label">ĐƠN ỨNG TUYỂN</span>
            <h2>Danh sách việc làm đã ứng tuyển</h2>
            <p>Theo dõi và cập nhật trạng thái tuyển dụng của bạn</p>
          </div>

          <Link to="/jobs" className="btn btn-primary">
            + Tìm việc mới
          </Link>
        </div>

        <div className="application-filter">
          <button
            className={selectedStatus === "ALL" ? "active" : ""}
            onClick={() => setSelectedStatus("ALL")}
          >
            Tất cả
            <span>{applications.length}</span>
          </button>

          <button
            className={selectedStatus === "PENDING" ? "active" : ""}
            onClick={() => setSelectedStatus("PENDING")}
          >
            Đang chờ
            <span>{pendingCount}</span>
          </button>

          <button
            className={selectedStatus === "APPROVED" ? "active" : ""}
            onClick={() => setSelectedStatus("APPROVED")}
          >
            Đã chấp nhận
            <span>{approvedCount}</span>
          </button>

          <button
            className={selectedStatus === "COMPLETED" ? "active" : ""}
            onClick={() => setSelectedStatus("COMPLETED")}
          >
            Đã hoàn thành
            <span>{completedCount}</span>
          </button>

          <button
            className={selectedStatus === "REJECTED" ? "active" : ""}
            onClick={() => setSelectedStatus("REJECTED")}
          >
            Bị từ chối
            <span>{rejectedCount}</span>
          </button>
        </div>

        {loading && (
          <div className="application-loading">
            Đang tải đơn ứng tuyển...
          </div>
        )}

        {!loading && (
          <div className="applications-list">
            {filteredApplications.map((application) => (
              <MyApplicationCard
                key={application.id}
                application={application}
                onDelete={handleDeleteApplication}
              />
            ))}
          </div>
        )}

        {!loading && filteredApplications.length === 0 && (
          <div className="application-empty">
            <div className="empty-icon">
              <BsInbox />
            </div>

            <h3>Không có đơn ứng tuyển</h3>

            <p>
              Chưa có đơn ứng tuyển nào thuộc trạng thái này.
            </p>

            <Link to="/jobs">
              Tìm việc ngay
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyApplications;