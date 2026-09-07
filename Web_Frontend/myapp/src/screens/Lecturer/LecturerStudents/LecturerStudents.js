import { useEffect, useState } from "react";
import { authApi, endpoints } from "../../../utils/api";
import StudentCard from "./StudentCard/StudentCard";
import PageHeroLecturer from "../../../components/PageHeroLecturer/PageHeroLecturer";
import "./LecturerStudents.css";

function LecturerStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("access-token");

      if (!token) {
        setError("Bạn chưa đăng nhập");
        return;
      }

      const response = await authApi(token).get(
        endpoints.lecturer
      );

      setStudents(response.data?.result || []);
    } catch (error) {
      console.error(
        "Load students error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Không thể tải danh sách sinh viên"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="lecturer-students-page">
      <PageHeroLecturer
        badge="SINH VIÊN PHỤ TRÁCH"
        title="Danh sách"
        highlight="sinh viên"
        description="Quản lý và theo dõi thông tin các sinh viên được phân công hướng dẫn."
      />

      <main className="lecturer-students-container lecturer-students-main">
        {loading ? (
          <div className="lecturer-students-state">
            <i className="bi bi-hourglass-split"></i>
            Đang tải danh sách sinh viên...
          </div>
        ) : error ? (
          <div className="lecturer-students-error">
            {error}
          </div>
        ) : students.length > 0 ? (
          <div className="lecturer-students-list">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
              />
            ))}
          </div>
        ) : (
          <div className="lecturer-students-empty">
            <h3>Chưa có sinh viên</h3>

            <p>
              Hiện chưa có sinh viên nào được phân công.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default LecturerStudents;