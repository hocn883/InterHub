import { Link } from "react-router-dom";
import {
    FaBuilding,
    FaLocationDot,
    FaMoneyBillWave,
    FaCalendarDays,
    FaArrowUpRightFromSquare,
    FaTrashCan,
    FaClock,
    FaCircleCheck,
    FaCircleXmark,
    FaStar,
} from "react-icons/fa6";
import { authApi, endpoints } from "../../../../utils/api";
import "./MyApplicationCard.css";

function MyApplicationCard({ application, onDelete }) {
    const status = application?.status?.toUpperCase() || "PENDING";

    const statusConfig = {
        PENDING: {
            label: "Đang chờ",
            className: "status-pending",
            icon: <FaClock />,
        },
        APPROVED: {
            label: "Đã chấp nhận",
            className: "status-approved",
            icon: <FaCircleCheck />,
        },
        REJECTED: {
            label: "Không phù hợp",
            className: "status-rejected",
            icon: <FaCircleXmark />,
        },
        COMPLETED: {
            label: "Đã hoàn thành",
            className: "status-completed",
            icon: <FaCircleCheck />,
        },
    };

    const currentStatus =
        statusConfig[status] || statusConfig.PENDING;

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Bạn có chắc muốn xóa đơn ứng tuyển này?"
        );

        if (!confirmed) return;

        try {
            const token =
                localStorage.getItem("access-token");

            await authApi(token).delete(
                endpoints.deleteApplication(
                    application.id
                )
            );

            onDelete(application.id);

            alert(
                "Xóa đơn ứng tuyển thành công!"
            );
        } catch (error) {
            console.error(
                "Lỗi khi xóa đơn ứng tuyển:",
                error
            );

            alert(
                "Không thể xóa đơn ứng tuyển. Vui lòng thử lại!"
            );
        }
    };
    return (
        <article className="job-application-card">
            {/* LEFT */}
            <div className="job-application-content">
                {/* LOGO */}
                <div className="job-company-logo">
                    {application.companyLogo ? (
                        <img
                            src={application.companyLogo}
                            alt={
                                application.companyName ||
                                "Company logo"
                            }
                        />
                    ) : (
                        <FaBuilding />
                    )}
                </div>
                {/* INFORMATION */}
                <div className="job-application-info">
                    <div className="job-application-heading">
                        <Link
                            to={`/jobs/${application.jobId}`}
                            className="job-application-title"
                        >
                            {application.jobTitle ||
                                "Chưa có tên công việc"}
                        </Link>
                     <div
                            className={`job-application-status ${currentStatus.className}`}
                        >
                            {currentStatus.icon}
                            <span>
                                {currentStatus.label}
                            </span>
                        </div>
                    </div>
                    <p className="job-company-name">
                        {application.companyName ||
                            "Chưa cập nhật công ty"}
                    </p>
                    <div className="job-application-details">
                        <div className="job-detail-item">
                            <FaLocationDot />
                            <span>
                                {application.location ||
                                    "Chưa cập nhật"}
                            </span>
                        </div>
                        <div className="job-detail-item">
                            <FaMoneyBillWave />
                            <span>
                                {application.salary ||
                                    "Thỏa thuận"}
                            </span>
                        </div>
                        <div className="job-detail-item">
                            <FaCalendarDays />
                            <span>
                                Ứng tuyển:{" "}
                                {application.appliedDate ||
                                    "Chưa cập nhật"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* RIGHT */}
            <div className="job-application-actions">
                <Link
                    to={`/jobs/${application.jobId}`}
                    className="application-action-button view-button"
                >
                    <FaArrowUpRightFromSquare />
                    <span>
                        Xem công việc
                    </span>
                </Link>
                {/* CHỈ HIỆN KHI ĐÃ HOÀN THÀNH */}
                {status === "COMPLETED" && (
                    <Link
                        to={`/jobs/${application.jobId}/review`}
                        className="application-action-button review-button"
                    >
                        <FaStar />

                        <span>
                            Đánh giá
                        </span>
                    </Link>
                )}
                <button
                    type="button"
                    className="application-action-button delete-button"
                    onClick={handleDelete}
                >
                    <FaTrashCan />
                    <span>
                        Xóa
                    </span>
                </button>
            </div>
        </article>
    );
}
export default MyApplicationCard;