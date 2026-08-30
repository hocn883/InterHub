import "./SearchJobs.css";

function SearchJobs({
  keyword,
  setKeyword,
  salary,
  setSalary,
  location,
  setLocation,
  handleSearch,
  handleReset,
}) {
  return (
    <div className="home-job-search">

      <form
        className="home-job-search-form"
        onSubmit={handleSearch}
      >

        {/* JOB NAME */}

        <div className="home-search-field home-search-keyword">

          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Tìm kiếm theo tên công việc"
            value={keyword}
            onChange={(event) =>
              setKeyword(event.target.value)
            }
          />

        </div>


        {/* SALARY */}

        <div className="home-search-field home-search-select">

          <i className="bi bi-cash-stack"></i>

          <select
            value={salary}
            onChange={(event) =>
              setSalary(event.target.value)
            }
          >
            <option value="">
              Mức lương
            </option>

            <option value="3000000">
              Từ 3 triệu
            </option>

            <option value="5000000">
              Từ 5 triệu
            </option>

            <option value="7000000">
              Từ 7 triệu
            </option>

            <option value="10000000">
              Từ 10 triệu
            </option>

            <option value="15000000">
              Từ 15 triệu
            </option>
          </select>

          <i className="bi bi-chevron-down home-select-arrow"></i>

        </div>


        {/* LOCATION */}

        <div className="home-search-field">

          <i className="bi bi-geo-alt"></i>

          <input
            type="text"
            placeholder="Nhập địa điểm"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
          />

        </div>


        {/* SEARCH */}

        <button
          className="home-search-submit"
          type="submit"
        >
          <i className="bi bi-search"></i>

          <span>
            Tìm kiếm
          </span>
        </button>


        {/* RESET */}

        <button
          className="home-search-reset"
          type="button"
          onClick={handleReset}
        >
          <i className="bi bi-funnel"></i>

          <span>
            Bỏ lọc
          </span>
        </button>

      </form>

    </div>
  );
}

export default SearchJobs;