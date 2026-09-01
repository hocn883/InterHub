import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { FiMapPin, FiSearch, FiX } from "react-icons/fi";
import "./LocationPicker.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(
      [position.latitude, position.longitude],
      17
    );
  }, [position, map]);

  return null;
}

function LocationPicker({
  open,
  onClose,
  value,
  onConfirm,
}) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [gettingAddress, setGettingAddress] = useState(false);

  const defaultPosition = {
    latitude: 10.7769,
    longitude: 106.7009,
  };

  useEffect(() => {
    if (!open) return;

    const hasLocation =
      value?.latitude !== null &&
      value?.latitude !== undefined &&
      value?.longitude !== null &&
      value?.longitude !== undefined;

    if (hasLocation) {
      const currentLocation = {
        location: value.location || "",
        latitude: Number(value.latitude),
        longitude: Number(value.longitude),
      };

      setSelectedLocation(currentLocation);
      setSearchText(value.location || "");
    } else {
      setSelectedLocation(null);
      setSearchText("");
    }

    setSearchResults([]);
  }, [
    open,
    value?.location,
    value?.latitude,
    value?.longitude,
  ]);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      setGettingAddress(true);

      const url =
        "https://nominatim.openstreetmap.org/reverse" +
        "?format=jsonv2" +
        `&lat=${latitude}` +
        `&lon=${longitude}` +
        "&accept-language=vi";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Không thể lấy địa chỉ");
      }

      const data = await response.json();

      return data.display_name || `${latitude}, ${longitude}`;
    } catch (error) {
      console.error("Reverse geocode error:", error);
      return `${latitude}, ${longitude}`;
    } finally {
      setGettingAddress(false);
    }
  };

  const handleMapSelect = async (latitude, longitude) => {
    const address = await reverseGeocode(latitude, longitude);

    const locationData = {
      location: address,
      latitude,
      longitude,
    };

    setSelectedLocation(locationData);
    setSearchText(address);
    setSearchResults([]);
  };

  const selectSearchLocation = (item, clearResults = true) => {
    const locationData = {
      location: item.display_name,
      latitude: Number(item.lat),
      longitude: Number(item.lon),
    };

    setSelectedLocation(locationData);
    setSearchText(item.display_name);

    if (clearResults) {
      setSearchResults([]);
    }
  };

  const handleSearch = async () => {
    const keyword = searchText.trim();

    if (!keyword) {
      alert("Vui lòng nhập địa chỉ cần tìm");
      return;
    }

    try {
      setSearching(true);

      const url =
        "https://nominatim.openstreetmap.org/search" +
        "?format=jsonv2" +
        `&q=${encodeURIComponent(keyword)}` +
        "&limit=5" +
        "&countrycodes=vn" +
        "&accept-language=vi" +
        "&addressdetails=1";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Không thể tìm địa điểm");
      }

      const data = await response.json();

      if (data.length === 0) {
        setSearchResults([]);
        alert("Không tìm thấy địa điểm phù hợp");
        return;
      }

      setSearchResults(data);

      // TỰ ĐỘNG GHIM KẾT QUẢ ĐẦU TIÊN
      selectSearchLocation(data[0], false);
    } catch (error) {
      console.error("Search location error:", error);
      alert("Không thể tìm kiếm địa điểm");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (item) => {
    selectSearchLocation(item);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleMarkerDragEnd = async (event) => {
    const position = event.target.getLatLng();

    await handleMapSelect(
      position.lat,
      position.lng
    );
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      alert("Vui lòng chọn địa điểm");
      return;
    }

    onConfirm(selectedLocation);
    onClose();
  };

  if (!open) return null;

  const mapPosition = selectedLocation || defaultPosition;

  return (
    <div
      className="location-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="location-modal">
        <div className="location-modal-header">
          <div>
            <h2>
              <FiMapPin />
              Chọn địa điểm làm việc
            </h2>

            <p>
              Nhập địa chỉ hoặc click trực tiếp trên bản đồ.
            </p>
          </div>

          <button
            type="button"
            className="location-close-button"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <div className="location-search-section">
          <div className="location-search-box">
            <FiSearch />

            <input
              type="text"
              placeholder="Ví dụ: 97 Võ Văn Tần, TP.HCM"
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
            >
              {searching ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="location-search-results">
              {searchResults.map((item) => (
                <button
                  key={item.place_id}
                  type="button"
                  className="location-search-result"
                  onClick={() =>
                    handleSelectSearchResult(item)
                  }
                >
                  <FiMapPin />
                  <span>{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="location-map-help">
          <FiMapPin />

          <span>
            Tìm kiếm sẽ tự động ghim địa điểm đầu tiên.
            Bạn cũng có thể click bản đồ hoặc kéo marker để điều chỉnh.
          </span>
        </div>

        <div className="location-map-wrapper">
          <MapContainer
            center={[
              mapPosition.latitude,
              mapPosition.longitude,
            ]}
            zoom={selectedLocation ? 17 : 13}
            className="location-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler
              onSelect={handleMapSelect}
            />

            <MapController
              position={selectedLocation}
            />

            {selectedLocation && (
              <Marker
                draggable
                position={[
                  selectedLocation.latitude,
                  selectedLocation.longitude,
                ]}
                eventHandlers={{
                  dragend: handleMarkerDragEnd,
                }}
              />
            )}
          </MapContainer>

          {gettingAddress && (
            <div className="location-loading">
              Đang lấy địa chỉ...
            </div>
          )}
        </div>

        {selectedLocation && (
          <div className="selected-location-card">
            <div className="selected-location-icon">
              <FiMapPin />
            </div>

            <div className="selected-location-content">
              <strong>Địa điểm đã chọn</strong>

              <p>{selectedLocation.location}</p>

              <div className="selected-coordinates">
                <span>
                  Latitude: {selectedLocation.latitude}
                </span>

                <span>
                  Longitude: {selectedLocation.longitude}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="location-modal-actions">
          <button
            type="button"
            className="location-cancel-button"
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            type="button"
            className="location-confirm-button"
            onClick={handleConfirm}
            disabled={!selectedLocation}
          >
            <FiMapPin />
            Xác nhận địa điểm
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationPicker;