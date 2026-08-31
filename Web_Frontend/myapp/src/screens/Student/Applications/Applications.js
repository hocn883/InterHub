import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {FiArrowLeft,FiCheckCircle,FiFileText,FiInfo,FiSend, FiShield,FiUploadCloud,FiX,
} from "react-icons/fi";
import { authApi, endpoints } from "../../../utils/api";
import "./Applications.css";
function Applications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState("");
  const [fileCv, setFileCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setFileCv(file);
    setMessage("");
    setMessageType("");
  };

  const handleRemoveFile = () => {
    setFileCv(null);
  };

  const formatFileSize = (size) => {
    if (!size) {
      return "0 KB";
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const trimmedCoverLetter = coverLetter.trim();

    if (!trimmedCoverLetter) {
      setMessage("Vui lòng nhập thư ứng tuyển.");
      setMessageType("error");
      return;
    }

    if (trimmedCoverLetter.length > 3000) {
      setMessage(
        "Thư ứng tuyển không được vượt quá 3000 ký tự."
      );
      setMessageType("error");
      return;
    }

    if (!fileCv) {
      setMessage("Vui lòng chọn CV để ứng tuyển.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem(
        "access-token"
      );

      if (!token) {
        setMessage(
          "Bạn cần đăng nhập để ứng tuyển."
        );
        setMessageType("error");
        return;
      }

      const formData = new FormData();

      formData.append(
        "coverLetter",
        trimmedCoverLetter
      );

      formData.append(
        "fileCv",
        fileCv
      );

      const response = await authApi(
        token
      ).post(
        endpoints.applyJob(jobId),
        formData
      );

      setMessage(
        response.data?.message ||
          "Ứng tuyển thành công."
      );

      setMessageType("success");

      setCoverLetter("");
      setFileCv(null);
    } catch (error) {
      console.error(
        "Lỗi khi ứng tuyển:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Data:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.message ||
          "Không thể ứng tuyển. Vui lòng thử lại."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="application-page">
      <div className="application-container">
        <header className="application-header">
          <div>
            <span className="application-label">
              ỨNG TUYỂN CÔNG VIỆC
            </span>

            <h1>
              Gửi hồ sơ ứng tuyển
            </h1>

            <p>
              Hoàn thiện thông tin bên dưới
              để gửi hồ sơ của bạn đến nhà
              tuyển dụng.
            </p>
          </div>

          <div className="application-step">
            <span>01</span>

            <div>
              <strong>
                Thông tin ứng tuyển
              </strong>

              <small>
                CV và thư giới thiệu
              </small>
            </div>
          </div>
        </header>

        <div className="application-layout">
          <form
            className="application-form-card"
            onSubmit={handleSubmit}
          >
            <div className="form-card-header">
              <div className="form-header-icon">
                <FiFileText />
              </div>

              <div>
                <h2>
                  Hồ sơ ứng tuyển
                </h2>

                <p>
                  Cung cấp CV và lời giới
                  thiệu ngắn về bản thân.
                </p>
              </div>
            </div>

            {message && (
              <div
                className={`application-message ${messageType}`}
              >
                {messageType ===
                "success" ? (
                  <FiCheckCircle />
                ) : (
                  <FiInfo />
                )}

                <span>
                  {message}
                </span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="coverLetter">
                Thư ứng tuyển
                <span>*</span>
              </label>

              <textarea
                id="coverLetter"
                rows="7"
                maxLength={3000}
                value={coverLetter}
                onChange={(event) =>
                  setCoverLetter(
                    event.target.value
                  )
                }
                placeholder="Giới thiệu ngắn gọn về bản thân, kỹ năng và lý do bạn phù hợp với vị trí này..."
              />

              <div className="input-footer">
                <span>
                  Viết ngắn gọn và tập
                  trung vào những điểm
                  nổi bật.
                </span>

                <strong>
                  {coverLetter.length}
                  /3000
                </strong>
              </div>
            </div>

            <div className="form-group">
              <label>
                CV ứng tuyển
                <span>*</span>
              </label>

              {!fileCv ? (
                <label className="upload-area">
                  <div className="upload-icon">
                    <FiUploadCloud />
                  </div>

                  <h3>
                    Tải CV của bạn lên
                  </h3>

                  <p>
                    Nhấn để{" "}
                    <strong>
                      chọn CV
                    </strong>{" "}
                    từ máy tính
                  </p>

                  <small>
                    Chọn file CV mà bạn
                    muốn gửi cho nhà tuyển
                    dụng
                  </small>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={
                      handleFileChange
                    }
                  />
                </label>
              ) : (
                <div className="uploaded-file">
                  <div className="uploaded-file-icon">
                    <FiFileText />
                  </div>

                  <div className="uploaded-file-info">
                    <strong>
                      {fileCv.name}
                    </strong>

                    <span>
                      {formatFileSize(
                        fileCv.size
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="remove-file-button"
                    onClick={
                      handleRemoveFile
                    }
                    title="Xóa CV"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>

            <div className="application-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate(-1)
                }
                disabled={loading}
              >
                <FiArrowLeft />
                Quay lại
              </button>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-loader" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Gửi ứng tuyển
                  </>
                )}
              </button>
            </div>
          </form>

          <aside className="application-sidebar">
            <div className="application-info-card">
              <div className="info-card-icon">
                <FiInfo />
              </div>

              <h3>
                Lưu ý khi ứng tuyển
              </h3>

              <ul>
                <li>
                  <i>
                    <FiCheckCircle />
                  </i>

                  <span>
                    Kiểm tra lại nội dung
                    CV trước khi gửi.
                  </span>
                </li>

                <li>
                  <i>
                    <FiCheckCircle />
                  </i>

                  <span>
                    Thư ứng tuyển nên
                    ngắn gọn và phù hợp
                    với vị trí.
                  </span>
                </li>

                <li>
                  <i>
                    <FiCheckCircle />
                  </i>

                  <span>
                    Đảm bảo thông tin
                    liên hệ trong CV là
                    chính xác.
                  </span>
                </li>
              </ul>
            </div>

            <div className="security-card">
              <div className="security-icon">
                <FiShield />
              </div>

              <div>
                <strong>
                  Hồ sơ của bạn được bảo mật
                </strong>

                <p>
                  CV chỉ được gửi đến nhà
                  tuyển dụng của công việc
                  mà bạn ứng tuyển.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Applications;