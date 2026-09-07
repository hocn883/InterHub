import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { authApi, endpoints } from "../../../utils/api";
import MyJobCard from "./MyJobCard/MyJobCard";
import PageHeroEmployer from "../../../components/PageHeroEmployer/PageHeroEmployer";
import "./EmployerJobs.css";

function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadJobs = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access-token");

      const response = await authApi(token).get(
        endpoints.employerJob
      );

      setJobs(response.data.result?.content || []);
    } catch (error) {
      console.error(
        "Lỗi khi tải danh sách công việc:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleStatusChange = (
    jobId,
    newStatus
  ) => {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: newStatus,
            }
          : job
      )
    );
  };

  const statistics = useMemo(() => {
    return jobs.reduce(
      (result, job) => {
        if (job.status === "OPEN") {
          result.open += 1;
        }

        if (job.status === "CLOSED") {
          result.closed += 1;
        }

        if (job.status === "COMPLETED") {
          result.completed += 1;
        }

        return result;
      },
      {
        open: 0,
        closed: 0,
        completed: 0,
      }
    );
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (statusFilter === "ALL") {
      return jobs;
    }

    return jobs.filter(
      (job) => job.status === statusFilter
    );
  }, [jobs, statusFilter]);

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa tin tuyển dụng này?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem("access-token");

      await authApi(token).delete(
        endpoints.deleteJob(jobId)
      );

      setJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job.id !== jobId
        )
      );

      alert("Xóa tin tuyển dụng thành công!");
    } catch (error) {
      console.error(
        "Lỗi khi xóa tin tuyển dụng:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Xóa tin tuyển dụng thất bại!"
      );
    }
  };

  const filters = [
    {
      value: "ALL",
      label: "Tất cả",
      count: jobs.length,
    },
    {
      value: "OPEN",
      label: "Đang tuyển",
      count: statistics.open,
    },
    {
      value: "CLOSED",
      label: "Đã đóng",
      count: statistics.closed,
    },
    {
      value: "COMPLETED",
      label: "Hoàn thành",
      count: statistics.completed,
    },
  ];

  return (
    <div className="employer-jobs-page">
      <PageHeroEmployer
        badge="TUYỂN DỤNG"
        title="Quản lý tin"
        highlight="tuyển dụng"
        description="Theo dõi các vị trí đã đăng, quản lý ứng viên và cập nhật thông tin tuyển dụng."
      />

      <main className="page-container employer-jobs-main">
        <section className="employer-job-content">
          <div className="employer-job-heading">
            <div>
              <span className="section-label">
                TIN ĐÃ ĐĂNG
              </span>

              <h2>Danh sách tuyển dụng</h2>

              <p>
                {filteredJobs.length} tin đang được hiển thị
              </p>
            </div>

            <Link
              to="/jobs/create"
              className="employer-add-job-button"
            >
              <span className="employer-add-job-icon">
                <FiPlus />
              </span>
              Đăng tin mới
            </Link>
          </div>

          <div className="employer-job-filter">
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
            <div className="employer-job-empty">
              <i className="bi bi-hourglass-split"></i>
              <p>
                Đang tải danh sách tuyển dụng...
              </p>
            </div>
          ) : (
            <div className="employer-job-list">
              {filteredJobs.map((job) => (
                <MyJobCard
                  key={job.id}
                  job={job}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}

              {filteredJobs.length === 0 && (
                <div className="employer-job-empty">
                  <h3>
                    Không có tin tuyển dụng
                  </h3>

                  <p>
                    Không có tin tuyển dụng thuộc trạng thái này.
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

export default EmployerJobs;