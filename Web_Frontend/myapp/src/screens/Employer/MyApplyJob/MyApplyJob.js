import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import {
  authApi,
  endpoints,
} from "../../../utils/api";
import MyApplyJobCard from "./MyApplyJobCard/MyApplyJobCard";
import PageHeroEmployer from "../../../components/PageHeroEmployer/PageHeroEmployer";
import "./MyApplyJob.css";

const STATUS = {
  PENDING: "PENDING",
  APPROVE: "APPROVE",
  REJECTED: "REJECTED",
};

const MyApplyJob = () => {
  const { jobId } = useParams();

  const [applications, setApplications] =
    useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(0);
  const [totalPages, setTotalPages] =
    useState(0);

  const [statusFilter, setStatusFilter] =
    useState(STATUS.PENDING);

  const loadApplications = useCallback(
    async (pageNumber = 0) => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "access-token"
          );

        if (!token) {
          setError(
            "Bạn chưa đăng nhập"
          );
          return;
        }

        const response =
          await authApi(token).get(
            endpoints.listapply(
              jobId
            ),
            {
              params: {
                page: pageNumber,
                size: 10,
              },
            }
          );

        const pageData =
          response.data.result;

        setApplications(
          pageData?.content || []
        );

        setPage(
          pageData?.page ??
            pageNumber
        );

        setTotalPages(
          pageData?.totalPages ??
            0
        );
      } catch (error) {
        console.error(
          "Load applications error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Không thể tải danh sách ứng viên"
        );
      } finally {
        setLoading(false);
      }
    },
    [jobId]
  );

  useEffect(() => {
    if (jobId) {
      loadApplications(0);
    }
  }, [
    jobId,
    loadApplications,
  ]);

  const handleStatusChange = (
    applicationId,
    newStatus
  ) => {
    setApplications(
      (prevApplications) =>
        prevApplications.map(
          (application) =>
            application.id ===
            applicationId
              ? {
                  ...application,
                  status:
                    newStatus,
                }
              : application
        )
    );
  };

  const statusCounts =
    useMemo(() => {
      return applications.reduce(
        (
          counts,
          application
        ) => {
          if (
            application.status ===
            STATUS.PENDING
          ) {
            counts.PENDING += 1;
          }

          if (
            application.status ===
            STATUS.APPROVE
          ) {
            counts.APPROVE += 1;
          }

          if (
            application.status ===
            STATUS.REJECTED
          ) {
            counts.REJECTED += 1;
          }

          return counts;
        },
        {
          PENDING: 0,
          APPROVE: 0,
          REJECTED: 0,
        }
      );
    }, [applications]);

  const filteredApplications =
    useMemo(() => {
      return applications.filter(
        (application) =>
          application.status ===
          statusFilter
      );
    }, [
      applications,
      statusFilter,
    ]);

  const tabs = [
    {
      value: STATUS.PENDING,
      label: "Đang chờ",
      count:
        statusCounts.PENDING,
    },
    {
      value: STATUS.APPROVE,
      label: "Đã duyệt",
      count:
        statusCounts.APPROVE,
    },
    {
      value: STATUS.REJECTED,
      label: "Đã từ chối",
      count:
        statusCounts.REJECTED,
    },
  ];

  const handlePreviousPage =
    () => {
      if (page > 0) {
        loadApplications(
          page - 1
        );
      }
    };

  const handleNextPage =
    () => {
      if (
        page <
        totalPages - 1
      ) {
        loadApplications(
          page + 1
        );
      }
    };

  return (
    <div className="my-apply-job-page">
      <PageHeroEmployer
        badge="ỨNG VIÊN"
        title="Danh sách"
        highlight="ứng tuyển"
        description="Quản lý hồ sơ ứng tuyển, theo dõi trạng thái và lựa chọn ứng viên phù hợp cho vị trí tuyển dụng."
      />

      <main className="my-apply-job-container my-apply-job-main">
        <div className="application-status-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={
                statusFilter ===
                tab.value
                  ? "active"
                  : ""
              }
              onClick={() =>
                setStatusFilter(
                  tab.value
                )
              }
            >
              {tab.label}
              <span>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        {loading && (
          <div className="application-loading">
            Đang tải danh sách
            ứng viên...
          </div>
        )}
        {!loading &&
          error && (
            <div className="application-error">
              {error}
            </div>
          )}
        {!loading &&
          !error && (
            <>
              <div className="application-list">
                {filteredApplications.length >
                0 ? (
                  filteredApplications.map(
                    (
                      application
                    ) => (
                      <MyApplyJobCard
                        key={
                          application.id
                        }
                        application={
                          application
                        }
                        onStatusChange={
                          handleStatusChange
                        }
                      />
                    )
                  )
                ) : (
                  <div className="application-empty">
                    <h3>
                      Không có
                      ứng viên
                    </h3>
                    <p>
                      Không có hồ
                      sơ ứng viên
                      trong mục
                      này.
                    </p>
                  </div>
                )}
              </div>
              {totalPages >
                1 && (
                <div className="application-pagination">
                  <button
                    type="button"
                    disabled={
                      page === 0
                    }
                    onClick={
                      handlePreviousPage
                    }
                  >
                    ← Trước
                  </button>
                  <span>
                    Trang{" "}
                    {page + 1} /{" "}
                    {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      page >=
                      totalPages -
                        1
                    }
                    onClick={
                      handleNextPage
                    }
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          )}
      </main>
    </div>
  );
};

export default MyApplyJob;