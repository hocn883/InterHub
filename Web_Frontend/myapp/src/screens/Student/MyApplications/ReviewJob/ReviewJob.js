import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaBuilding,
  FaCalendarDays,
  FaLocationDot,
  FaPaperPlane,
  FaRegStar,
  FaStar,
  FaUser,
} from "react-icons/fa6";

import api, {
  authApi,
  endpoints,
} from "../../../../utils/api";
import "./ReviewJob.css";
function ReviewJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        const response = await api.get(
          endpoints.jobDetail(jobId)
        )

        setJob(response.data.result);
      } catch (error) {
        console.error(
          "Lỗi tải job:",
          error
        );

        setError(
          "Không thể tải thông tin công việc"
        );
      } finally {
        setJobLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";

    return new Date(date)
      .toLocaleDateString("vi-VN");
  };

  const getRatingText = () => {
    const texts = {
      1: "Không hài lòng",
      2: "Chưa tốt",
      3: "Bình thường",
      4: "Tốt",
      5: "Rất tốt",
    };

    return texts[rating] || "Chọn số sao";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError(
        "Vui lòng chọn số sao đánh giá"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("access-token");

      await authApi(token).post(
        endpoints.jobReview(jobId),
        { 
          rating,
          comment: comment.trim(),
        }
      );

      alert(
        "Đánh giá thành công!"
      );

      navigate("/myapplications");
    } catch (error) {
      console.error(
        "Lỗi gửi đánh giá:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Không thể gửi đánh giá"
      );
    } finally {
      setLoading(false);
    }
  };

  const employer = job?.employer;

  return (
    <div className="review-page">

      <section className="review-hero">
        <div className="review-container">

          <Link
            to="/my-applications"
            className="review-back"
          >
            <FaArrowLeft />
            Quay lại đơn ứng tuyển
          </Link>

          <span className="review-badge">
            ĐÁNH GIÁ KỲ THỰC TẬP
          </span>

          <h1>
            Chia sẻ trải nghiệm
            <span> thực tập của bạn</span>
          </h1>

          <p>
            Đánh giá trải nghiệm thực tế
            của bạn tại doanh nghiệp.
          </p>

        </div>
      </section>

      <main className="review-container review-main">

        <div className="review-layout">

          {/* FORM */}
          <div className="review-form-card">

            <div className="review-heading">
              <span>
                ĐÁNH GIÁ CỦA BẠN
              </span>

              <h2>
                Trải nghiệm của bạn như thế nào?
              </h2>

              <p>
                Chọn mức độ hài lòng và chia sẻ
                nhận xét của bạn.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="review-field">
                <label>
                  Mức độ hài lòng *
                </label>

                <div className="rating-box">

                  <div
                    className="rating-stars"
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                  >
                    {[1, 2, 3, 4, 5].map(
                      (star) => {
                        const active =
                          star <=
                          (hoverRating ||
                            rating);

                        return (
                          <button
                            key={star}
                            type="button"
                            className={
                              active
                                ? "star active"
                                : "star"
                            }
                            onMouseEnter={() =>
                              setHoverRating(
                                star
                              )
                            }
                            onClick={() => {
                              setRating(star);
                              setError("");
                            }}
                          >
                            {active ? (
                              <FaStar />
                            ) : (
                              <FaRegStar />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <span>
                    {getRatingText()}
                  </span>

                </div>
              </div>

              <div className="review-field">

                <div className="comment-label">
                  <label htmlFor="comment">
                    Nhận xét
                  </label>

                  <span>
                    {comment.length}/2000
                  </span>
                </div>

                <textarea
                  id="comment"
                  maxLength={2000}
                  value={comment}
                  onChange={(e) =>
                    setComment(
                      e.target.value
                    )
                  }
                  placeholder="Chia sẻ về môi trường làm việc, sự hỗ trợ và trải nghiệm thực tập của bạn..."
                />

              </div>

              {error && (
                <div className="review-error">
                  {error}
                </div>
              )}

              <div className="review-actions">

                <Link
                  to="/my-applications"
                  className="cancel-button"
                >
                  Hủy
                </Link>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={
                    loading || !rating
                  }
                >
                  <FaPaperPlane />

                  {loading
                    ? "Đang gửi..."
                    : "Gửi đánh giá"}
                </button>

              </div>

            </form>
          </div>

          {/* JOB INFORMATION */}
          <aside className="review-job-card">

            <span className="job-card-label">
              THÔNG TIN KỲ THỰC TẬP
            </span>

            {jobLoading ? (
              <div className="job-loading">
                Đang tải thông tin...
              </div>
            ) : (
              <>
                <h3 className="review-job-title">
                  {job?.title ||
                    "Chưa cập nhật"}
                </h3>

                <div className="review-info-list">

                  <div className="review-info-item">
                    <FaBuilding />

                    <div>
                      <span>
                        Công ty
                      </span>

                      <strong>
                        {employer?.companyName ||
                          "Chưa cập nhật"}
                      </strong>
                    </div>
                  </div>

                  <div className="review-info-item">
                    <FaUser />

                    <div>
                      <span>
                        Nhà tuyển dụng
                      </span>

                      <strong>
                        {employer?.fullName ||
                          "Chưa cập nhật"}
                      </strong>
                    </div>
                  </div>

                  <div className="review-info-item">
                    <FaCalendarDays />

                    <div>
                      <span>
                        Thời gian thực tập
                      </span>

                      <strong>
                        {formatDate(
                          job?.startDate
                        )}
                        {" - "}
                        {formatDate(
                          job?.endDate
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="review-info-item">
                    <FaLocationDot />

                    <div>
                      <span>
                        Địa điểm
                      </span>

                      <strong>
                        {job?.location ||
                          "Chưa cập nhật"}
                      </strong>
                    </div>
                  </div>

                </div>

              </>
            )}

          </aside>

        </div>

      </main>

    </div>
  );
}

export default ReviewJob;