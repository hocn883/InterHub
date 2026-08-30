import "./SendCv.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../contexts/UserContext";
import { authApi, endpoints } from "../../../../utils/api";

function SendCv() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  const lecturer = currentUser?.lecturer;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const sendCV = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("fileCv", file);

      const token = localStorage.getItem("access-token");

      await authApi(token).post(
        endpoints.sendCv,
        formData
      );

      alert("Gửi CV thành công");

      navigate("/myCv");

    } catch (error) {
      console.error("Lỗi gửi CV:", error);

      alert(
        error.response?.data?.message ||
        "Gửi CV thất bại"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Vui lòng chọn CV");
      return;
    }

    await sendCV();
  };

  // =========================================
  // CHƯA ĐƯỢC PHÂN CÔNG GIẢNG VIÊN
  // =========================================

  if (!lecturer) {
    return (
      <div className="send-cv-page">
        <div className="send-cv-container">

          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </button>

          <div className="send-cv-form">

            <h1>
              Gửi CV cho giảng viên
            </h1>

            <p className="form-description">
              Gửi CV để nhận góp ý từ giảng viên hướng dẫn.
            </p>

            <div className="no-lecturer">

              <div className="no-lecturer-icon">
                GV
              </div>

              <h3>
                Bạn chưa được phân công giảng viên thực tập
              </h3>

              <p>
                Hiện tại bạn chưa có giảng viên hướng dẫn.
                Vui lòng quay lại sau khi được phân công.
              </p>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // =========================================
  // ĐÃ CÓ GIẢNG VIÊN
  // =========================================

  return (
    <div className="send-cv-page">

      <div className="send-cv-container">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>

        <div className="send-cv-form">

          <h1>
            Gửi CV cho giảng viên
          </h1>

          <p className="form-description">
            Gửi CV để nhận góp ý từ giảng viên hướng dẫn.
          </p>


          <form onSubmit={handleSubmit}>

            {/* GIẢNG VIÊN */}
            <div className="form-group">

              <label>
                Giảng viên nhận CV
              </label>

              <input
                type="text"
                value={lecturer.fullName || ""}
                disabled
              />

            </div>


            {/* USERNAME */}
            <div className="form-group">

              <label>
                Tài khoản giảng viên
              </label>

              <input
                type="text"
                value={lecturer.username || ""}
                disabled
              />

            </div>


            {/* FILE */}
            <div className="form-group">

              <label>
                Chọn CV
              </label>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={loading}
              />

            </div>


            {/* FILE ĐÃ CHỌN */}
            {file && (
              <div className="selected-file">

                <div>
                  <span>
                    File đã chọn
                  </span>

                  <strong>
                    {file.name}
                  </strong>
                </div>

                {!loading && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                  >
                    Xóa
                  </button>
                )}

              </div>
            )}


            {/* SUBMIT */}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang gửi CV...
                </>
              ) : (
                "Gửi CV"
              )}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default SendCv;