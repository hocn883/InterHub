import { useState } from "react";
import LocationPicker from "../../../screens/Maps/LocationPicker";
import "./SearchJobs.css";

function SearchJobs({
  keyword,
  setKeyword,
  salary,
  setSalary,
  location,
  setLocation,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  radius,
  setRadius,
  handleSearch,
  handleReset,
}) {
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleLocationConfirm = (locationData) => {
    setLocation(locationData.location);
    setLatitude(locationData.latitude);
    setLongitude(locationData.longitude);
  };

  const handleClearLocation = (event) => {
    event.stopPropagation();
    setLocation("");
    setLatitude(null);
    setLongitude(null);
  };

  return (
    <div className="home-job-search">
      <form className="home-job-search-form" onSubmit={handleSearch}>
        <div className="home-search-field home-search-keyword">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Tìm kiếm theo tên công việc"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>

        <div className="home-search-field home-search-select home-search-salary">
          <i className="bi bi-cash-stack"></i>

          <select
            value={salary}
            onChange={(event) => setSalary(event.target.value)}
          >
            <option value="">Mức lương</option>
            <option value="3000000">Từ 3 triệu</option>
            <option value="5000000">Từ 5 triệu</option>
            <option value="7000000">Từ 7 triệu</option>
            <option value="10000000">Từ 10 triệu</option>
            <option value="15000000">Từ 15 triệu</option>
          </select>

          <i className="bi bi-chevron-down home-select-arrow"></i>
        </div>

        <div
          className="home-search-field home-search-location"
          onClick={() => setShowLocationPicker(true)}
        >
          <i className="bi bi-geo-alt"></i>

          <input
            type="text"
            placeholder="Chọn địa điểm"
            value={location}
            readOnly
          />

          {location && (
            <button
              type="button"
              className="home-location-clear"
              onClick={handleClearLocation}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        <div className="home-search-field home-search-select home-search-radius">
          <select
            value={radius}
            onChange={(event) => setRadius(Number(event.target.value))}
            disabled={!location}
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={30}>30 km</option>
            <option value={50}>50 km</option>
          </select>

          <i className="bi bi-chevron-down home-select-arrow"></i>
        </div>

        <div className="home-search-actions">
          <button className="home-search-submit" type="submit">
            <i className="bi bi-search"></i>
            <span>Tìm kiếm</span>
          </button>

          <button
            className="home-search-reset"
            type="button"
            onClick={handleReset}
          >
            <i className="bi bi-x-circle"></i>
            <span>Bỏ lọc</span>
          </button>
        </div>
      </form>

      <LocationPicker
        open={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        value={{ location, latitude, longitude }}
        onConfirm={handleLocationConfirm}
      />
    </div>
  );
}

export default SearchJobs;