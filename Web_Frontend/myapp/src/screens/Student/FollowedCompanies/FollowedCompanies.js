import { useEffect, useState } from "react";
import "./FollowedCompanies.css";
import FollowedCompanyCard from "./FollowedCompanyCard/FollowedCompanyCard";
import { authApi, endpoints } from "../../../utils/api";
import PageHero from "../../../components/PageHero/PageHero";
const FollowedCompanies = () => {
  const [followedCompanies, setFollowedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setFollowLoading] = useState(false);
  useEffect(() => {
    loadFollowedCompanies();
  }, []);
  const loadFollowedCompanies = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const response = await authApi(token).get(
        endpoints.followed
      );
      const companies = response.data.result.content.map(
        (follow) => ({
          ...follow.employer,
          followId: follow.id,
          createdDate: follow.createdDate,
        })
      );

      setFollowedCompanies(companies);
    } catch (error) {
      console.error(
        "Lỗi load followed companies:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (companyId) => {
    try {
      setFollowLoading(true);

      const token = localStorage.getItem("access-token");

      await authApi(token).delete(
        endpoints.followEmployer(companyId)
      );

      setFollowedCompanies((prev) =>
        prev.filter(
          (company) => company.id !== companyId
        )
      );
    } catch (error) {
      console.error("Unfollow error:", error);

      alert(
        error.response?.data?.message ||
          "Không thể hủy theo dõi doanh nghiệp."
      );
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <main className="followed-companies-page">
      <PageHero
        badge="DOANH NGHIỆP"
        title="Doanh nghiệp"
        highlight="đã theo dõi"
        description="Theo dõi các doanh nghiệp bạn quan tâm và cập nhật những cơ hội thực tập mới nhất."
      />

      <section className="page-container followed-companies-content">
        <div className="followed-company-grid">
          {followedCompanies.map((company) => (
            <FollowedCompanyCard
              key={company.id}
              company={company}
              onUnfollow={handleUnfollow}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default FollowedCompanies;