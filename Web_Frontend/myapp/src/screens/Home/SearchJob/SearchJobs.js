import { useState } from 'react'
import './SearchJobs.css'

function SearchJobs() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()

    console.log({ keyword, location, category })
    // Sau này gọi API tìm việc tại đây.
  }

  const applyKeyword = (value) => {
    setKeyword(value)
  }

  return (
    <section className="job-search-section">
      <div className="section-container">
        <div className="job-search-heading">
          <div>
            <span>Tìm kiếm cơ hội</span>
            <h2>Tìm công việc phù hợp với bạn</h2>
          </div>
          <p>Lọc nhanh theo từ khóa, địa điểm và ngành nghề.</p>
        </div>

        <form className="job-search-box" onSubmit={handleSearch}>
          <div className="job-search-field job-search-keyword">
            <span className="job-search-icon">⌕</span>
            <input
              type="text"
              value={keyword}
              placeholder="Tên công việc, vị trí hoặc kỹ năng..."
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>

          <div className="job-search-divider" />

          <div className="job-search-field">
            <span className="job-search-icon">⌖</span>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              aria-label="Chọn địa điểm"
            >
              <option value="">Tất cả địa điểm</option>
              <option value="HCM">TP. Hồ Chí Minh</option>
              <option value="HN">Hà Nội</option>
              <option value="DN">Đà Nẵng</option>
              <option value="CT">Cần Thơ</option>
            </select>
          </div>

          <div className="job-search-divider" />

          <div className="job-search-field">
            <span className="job-search-icon">▦</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Chọn ngành nghề"
            >
              <option value="">Tất cả ngành nghề</option>
              <option value="IT">Công nghệ thông tin</option>
              <option value="MARKETING">Marketing</option>
              <option value="BUSINESS">Kinh doanh</option>
              <option value="ACCOUNTING">Kế toán</option>
              <option value="DESIGN">Thiết kế</option>
            </select>
          </div>

          <button className="job-search-button" type="submit">
            Tìm việc
          </button>
        </form>

        <div className="job-search-keywords">
          <span>Từ khóa phổ biến:</span>
          {['Java', 'React JS', 'Marketing', 'Không yêu cầu kinh nghiệm'].map((item) => (
            <button key={item} type="button" onClick={() => applyKeyword(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SearchJobs