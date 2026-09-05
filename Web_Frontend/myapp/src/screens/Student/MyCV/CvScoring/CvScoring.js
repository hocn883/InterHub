import { useState } from 'react';
import './CvScoring.css';
import { authApi, endpoints } from "../../../../utils/api";

function CvScoring() {
  const [file, setFile] = useState(null)
  const [targetPosition, setTargetPosition] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      setError('Vui lòng chọn file PDF.')
      setFile(null)
      return
    }

    setFile(selectedFile)
    setResult(null)
    setError('')
  }
  const handleScore = async () => {
  if (!file) {
    setError("Vui lòng chọn CV PDF.");
    return;
  }

  if (!targetPosition.trim()) {
    setError("Vui lòng nhập vị trí ứng tuyển.");
    return;
  }

  setLoading(true);
  setError("");
  setResult(null);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetPosition", targetPosition.trim());
    const token = localStorage.getItem("access-token");
    const response = await authApi(token).post(
      endpoints.cvScore,
      formData
    );
    setResult(response.data);
  } catch (error) {
    console.error("CV SCORING ERROR:", error);
    setError(
      error.response?.data?.message ||
      error.response?.data ||
      "Không thể chấm điểm CV. Vui lòng kiểm tra Backend."
    );
  } finally {
    setLoading(false);
  }
};
  const handleRemoveFile = () => {
    setFile(null)
    setResult(null)
    setError('')
  }
  const handleRetry = () => {
    setFile(null)
    setTargetPosition('')
    setResult(null)
    setError('')
  }
  const getScoreStatus = (score) => {

    if (score >= 80) {
      return {
        title: 'CV tốt',
        description:
          'CV có chất lượng tốt và đáp ứng khá đầy đủ các tiêu chí.',
        className: 'score-good',
      }
    }

    if (score >= 60) {
      return {
        title: 'CV khá',
        description:
          'CV có nền tảng khá tốt nhưng vẫn còn một số điểm cần cải thiện.',
        className: 'score-average',
      }
    }

    return {
      title: 'Cần cải thiện',
      description:
        'CV còn nhiều điểm cần bổ sung và tối ưu trước khi ứng tuyển.',
      className: 'score-low',
    }
  }

  const score = result
    ? Number(result.score) || 0
    : 0

  const scoreStatus =
    getScoreStatus(score)

  return (
    <div className="cv-scoring-page">

      <div className="cv-scoring-container">

        {/* ================================
            HEADER
        ================================= */}

        <div className="cv-scoring-header">

          <div className="header-label">
            AI CV ANALYZER
          </div>

          <h1>
            Chấm điểm CV
          </h1>

          <p>
            Tải CV của bạn lên để hệ thống AI
            phân tích, đánh giá chất lượng và
            đưa ra nhận xét chi tiết.
          </p>

        </div>


        {/* ================================
            UPLOAD CARD
        ================================= */}

        <div className="upload-card">

          <div className="upload-card-header">

            <div>

              <span className="section-number">
                01
              </span>

              <h2>
                Thông tin CV
              </h2>

              <p>
                Chọn CV PDF và nhập vị trí
                bạn muốn ứng tuyển.
              </p>

            </div>

          </div>


          {/* ================================
              TARGET POSITION
          ================================= */}

          <div className="target-position-field">

            <label>
              Vị trí ứng tuyển
            </label>

            <input
              type="text"
              value={targetPosition}
              onChange={(e) =>
                setTargetPosition(e.target.value)
              }
              placeholder="Ví dụ: Backend Developer"
              disabled={loading}
            />

          </div>


          {/* ================================
              FILE UPLOAD
          ================================= */}

          {!file ? (

            <label className="upload-box">

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                hidden
              />

              <div className="upload-content">

                <strong>
                  Chọn CV PDF để phân tích
                </strong>

                <span>
                  Hệ thống hiện chỉ hỗ trợ file PDF.
                </span>

                <div className="select-file-button">
                  Chọn file PDF
                </div>

              </div>

            </label>

          ) : (

            <div className="selected-file-box">

              <div className="pdf-label">
                PDF
              </div>

              <div className="selected-file-info">

                <strong>
                  {file.name}
                </strong>

                <span>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>

              </div>

              <button
                type="button"
                className="remove-file-button"
                onClick={handleRemoveFile}
                disabled={loading}
              >
                Xóa file
              </button>

            </div>

          )}


          {/* ================================
              ERROR
          ================================= */}

          {error && (

            <div className="cv-error">
              {error}
            </div>

          )}


          {/* ================================
              SCORE BUTTON
          ================================= */}

          <button
            type="button"
            className="score-button"
            onClick={handleScore}
            disabled={
              !file ||
              !targetPosition.trim() ||
              loading
            }
          >

            {loading
              ? 'Đang phân tích CV...'
              : 'Bắt đầu chấm điểm'
            }

          </button>

        </div>


        {/* ================================
            LOADING
        ================================= */}

        {loading && (

          <div className="analysis-loading">

            <div className="loading-line" />

            <div className="loading-content">

              <h3>
                AI đang phân tích CV
              </h3>

              <p>
                Hệ thống đang đọc và đánh giá
                nội dung CV. Vui lòng chờ trong giây lát.
              </p>

            </div>

          </div>

        )}


        {/* ================================
            RESULT
        ================================= */}

        {result && !loading && (

          <div className="result-card">

            <div className="result-card-header">

              <div>

                <span className="section-number">
                  02
                </span>

                <h2>
                  Kết quả phân tích
                </h2>

                <p>
                  Kết quả được trả về từ hệ thống AI.
                </p>

              </div>

              <div className="result-file-name">
                {file?.name}
              </div>

            </div>


            {/* SCORE */}

            <div className="score-overview">

              <div className="score-main">

                <div className="score-number">
                  {score}
                </div>

                <div className="score-max">
                  /100
                </div>

              </div>

              <div className="score-info">

                <div
                  className={`score-status ${scoreStatus.className}`}
                >
                  {scoreStatus.title}
                </div>

                <h3>
                  Điểm đánh giá CV
                </h3>

                <p>
                  {scoreStatus.description}
                </p>

              </div>

            </div>


            {/* SCORE BAR */}

            <div className="score-progress-section">

              <div className="progress-header">

                <span>
                  Mức độ hoàn thiện
                </span>

                <strong>
                  {score}/100
                </strong>

              </div>

              <div className="progress-track">

                <div
                  className="progress-value"
                  style={{
                    width: `${Math.min(
                      Math.max(score, 0),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>


            {/* FEEDBACK */}

            <div className="feedback-section">

              <div className="feedback-header">

                <span className="section-number">
                  03
                </span>

                <div>

                  <h2>
                    Nhận xét của AI
                  </h2>

                  <p>
                    Phân tích chi tiết dựa trên
                    nội dung CV.
                  </p>

                </div>

              </div>


              <div className="feedback-box">

                {result.summary && (

                  <div className="feedback-text">
                    {result.summary}
                  </div>

                )}

                {result.feedback && (

                  <div className="feedback-text">
                    {result.feedback}
                  </div>

                )}

                {!result.summary &&
                  !result.feedback && (

                    <div className="empty-feedback">
                      Hệ thống không trả về nhận xét.
                    </div>

                  )}

              </div>

            </div>


            {/* STRENGTHS */}

            {result.strengths?.length > 0 && (

              <div className="feedback-section">

                <div className="feedback-header">

                  <span className="section-number">
                    04
                  </span>

                  <div>

                    <h2>
                      Điểm mạnh
                    </h2>

                  </div>

                </div>

                <div className="feedback-box">

                  <ul>
                    {result.strengths.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                </div>

              </div>

            )}


            {/* WEAKNESSES */}

            {result.weaknesses?.length > 0 && (

              <div className="feedback-section">

                <div className="feedback-header">

                  <span className="section-number">
                    05
                  </span>

                  <div>

                    <h2>
                      Điểm yếu
                    </h2>

                  </div>

                </div>

                <div className="feedback-box">

                  <ul>
                    {result.weaknesses.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                </div>

              </div>

            )}


            {/* SUGGESTIONS */}

            {result.suggestions?.length > 0 && (

              <div className="feedback-section">

                <div className="feedback-header">

                  <span className="section-number">
                    06
                  </span>

                  <div>

                    <h2>
                      Đề xuất cải thiện
                    </h2>

                  </div>

                </div>

                <div className="feedback-box">

                  <ul>
                    {result.suggestions.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                </div>

              </div>

            )}


            {/* ACTION */}

            <div className="result-actions">

              <button
                type="button"
                className="retry-button"
                onClick={handleRetry}
              >
                Chấm CV khác
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  )
}

export default CvScoring