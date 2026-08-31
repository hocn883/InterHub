import { useEffect, useState } from "react";
import { BsEnvelopePaper } from "react-icons/bs";
import { authApi, endpoints } from "../../../utils/api";
import InvitationCard from "./InvitationCard/InvitationCard";
import PageHero from "../../../components/PageHero/PageHero";
import "./MyInvitations.css";

function MyInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access-token");
      const response = await authApi(token).get(endpoints.myinvitations);
      setInvitations(response.data?.result?.content || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Không thể tải lời mời");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id, status) => {
    setInvitations((prev) =>
      prev.map((item) => item.id === id ? { ...item, status } : item)
    );
  };

  const handleAccept = async (id) => {
    try {
      setActionLoading(true);

      const token = localStorage.getItem("access-token");

      await authApi(token).patch
      (endpoints.studentAccept(id));

      updateStatus(id, "ACCEPTED");
      alert("Đã chấp nhận lời mời");
    } catch (err) {
      alert(err.response?.data?.message || "Không thể chấp nhận lời mời");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("access-token");
      await authApi(token).patch(endpoints.studentReject(id));
      updateStatus(id, "REJECTED");
      alert("Đã từ chối lời mời");
    } catch (err) {
      alert(err.response?.data?.message || "Không thể từ chối lời mời");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="my-invitations-page">
      <PageHero
        badge="LỜI MỜI TUYỂN DỤNG"
        title="Thư mời"
        highlight="dành cho bạn"
        description="Xem và phản hồi những lời mời tuyển dụng từ các doanh nghiệp đang quan tâm đến hồ sơ của bạn."
      />

      <section className="invitation-page-container invitations-content">
        {loading ? (
          <div className="invitation-loading">
            Đang tải lời mời...
          </div>
        ) : invitations.length === 0 ? (
          <div className="invitation-empty">
            <div className="invitation-empty-icon">
              <BsEnvelopePaper />
            </div>

            <h3>Chưa có lời mời tuyển dụng</h3>

            <p>
              Khi doanh nghiệp quan tâm đến hồ sơ của bạn, lời mời sẽ xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div className="invitation-list">
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={handleAccept}
                onReject={handleReject}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyInvitations;