import { useEffect, useState } from "react";
import { FiMail } from "react-icons/fi";
import { authApi, endpoints } from "../../../utils/api";
import PageHeroEmployer from "../../../components/PageHeroEmployer/PageHeroEmployer";
import EmployerInvitationCard from "./EmployerInvitationCard/EmployerInvitationCard";
import "./EmployerInvitations.css";

function EmployerInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadInvitations = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access-token");

      if (!token) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      const response = await authApi(token).get(
        endpoints.employerInvitation
      );

      const data = response.data?.result?.content || [];

      setInvitations(data);
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const pendingCount = invitations.filter(
    (invitation) => invitation.status === "PENDING"
  ).length;

  const acceptedCount = invitations.filter(
    (invitation) => invitation.status === "ACCEPTED"
  ).length;

  const rejectedCount = invitations.filter(
    (invitation) => invitation.status === "REJECTED"
  ).length;

  const filteredInvitations =
    statusFilter === "ALL"
      ? invitations
      : invitations.filter(
          (invitation) => invitation.status === statusFilter
        );

  const filters = [
    {
      value: "ALL",
      label: "Tất cả",
      count: invitations.length,
    },
    {
      value: "PENDING",
      label: "Chờ phản hồi",
      count: pendingCount,
    },
    {
      value: "ACCEPTED",
      label: "Đã chấp nhận",
      count: acceptedCount,
    },
    {
      value: "REJECTED",
      label: "Đã từ chối",
      count: rejectedCount,
    },
  ];

  return (
    <div className="employer-invitations-page">
      <PageHeroEmployer
        badge="TUYỂN DỤNG"
        title="Quản lý thư"
        highlight="đã gửi"
        description="Theo dõi các thư mời tuyển dụng đã gửi đến ứng viên và trạng thái phản hồi."
      />

      <main className="page-container employer-invitations-main">
        <section className="employer-invitations-content">
          <div className="employer-invitations-heading">
            <div>
              <span className="section-label">
                THƯ MỜI ĐÃ GỬI
              </span>

              <h2>Danh sách thư mời</h2>

              <p>
                {filteredInvitations.length} thư mời đang được hiển thị
              </p>
            </div>

            <div className="employer-invitations-summary">
              <span className="employer-invitations-summary-icon">
                <FiMail />
              </span>

              <div>
                <strong>{invitations.length}</strong>
                <span>Tổng thư mời</span>
              </div>
            </div>
          </div>

          <div className="employer-invitations-filter">
            {filters.map((filter) => (
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
                <span>{filter.count}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="employer-invitations-empty">
              <i className="bi bi-hourglass-split"></i>
              <p>Đang tải danh sách thư mời...</p>
            </div>
          ) : (
            <div className="employer-invitations-list">
              {filteredInvitations.map((invitation) => (
                <EmployerInvitationCard
                  key={invitation.id}
                  invitation={invitation}
                />
              ))}

              {filteredInvitations.length === 0 && (
                <div className="employer-invitations-empty">
                  <FiMail />
                  <h3>Không có thư mời</h3>
                  <p>
                    Không có thư mời thuộc trạng thái này.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default EmployerInvitations;