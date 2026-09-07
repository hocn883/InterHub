import { useEffect, useMemo, useState } from "react";
import {  FiUsers, FiXCircle } from "react-icons/fi";
import { authApi, endpoints } from "../../../utils/api";
import PageHeroEmployer from "../../../components/PageHeroEmployer/PageHeroEmployer";
import StudentApplyCard from "./StudentApplyCard/StudentApplyCard";
import "./EmployerStudents.css";

function EmployerStudents() {
  const [activeTab, setActiveTab] = useState("INTERNSHIP");
  const [internStudents, setInternStudents] = useState([]);
  const [rejectedStudents, setRejectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access-token");
      const [approvedResponse, rejectedResponse] = await Promise.all([
        authApi(token).get(endpoints.employerStudentApproved),
        authApi(token).get(endpoints.employerStudentRejected),
      ]);
      setInternStudents(approvedResponse.data.result?.content || []);
      setRejectedStudents(rejectedResponse.data.result?.content || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sinh viên:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const currentStudents = useMemo(() => {
    if (activeTab === "INTERNSHIP") return internStudents;
    return rejectedStudents;
  }, [activeTab, internStudents, rejectedStudents]);
    const filteredStudents = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    if (!search) return currentStudents;
    return currentStudents.filter((application) => {
      const student = application.student;
      const job = application.job;

      return (
        student.fullName?.toLowerCase().includes(search) ||
        student.mssv?.toLowerCase().includes(search) ||
        student.email?.toLowerCase().includes(search) ||
        student.major?.toLowerCase().includes(search) ||
        student.className?.toLowerCase().includes(search) ||
        job?.title?.toLowerCase().includes(search)
      );
    });
  }, [currentStudents, keyword]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setKeyword("");
  };

  return (
    <div className="employer-students-page">
      <PageHeroEmployer
        badge="SINH VIÊN"
        title="Quản lý sinh viên"
        highlight="doanh nghiệp"
        description="Theo dõi sinh viên đang thực tập và các hồ sơ đã từ chối."
      />

      <main className="page-container employer-students-main">
        <section className="employer-students-content">
          <div className="employer-students-heading">
            <div>
              <span className="section-label">QUẢN LÝ SINH VIÊN</span>
              <h2>Danh sách sinh viên</h2>
            </div>
          </div>

          <div className="employer-students-tabs">
            <button
              type="button"
              className={activeTab === "INTERNSHIP" ? "active internship" : ""}
              onClick={() => changeTab("INTERNSHIP")}
            >
              <FiUsers />
              Đang thực tập
              <span>{internStudents.length}</span>
            </button>

            <button
              type="button"
              className={activeTab === "REJECTED" ? "active rejected" : ""}
              onClick={() => changeTab("REJECTED")}
            >
              <FiXCircle />
              Đã từ chối
              <span>{rejectedStudents.length}</span>
            </button>
          </div>
          {loading ? (
            <div className="employer-students-empty">
              <i className="bi bi-hourglass-split"></i>
              <p>Đang tải danh sách sinh viên...</p>
            </div>
          ) : (
            <div className="employer-students-list">
              {filteredStudents.map((application, index) => (
                <StudentApplyCard
                  key={application.applicationId || application.id || index}
                  application={application}
                  type={activeTab}
                />
              ))}

              {filteredStudents.length === 0 && (
                <div className="employer-students-empty">
                  {activeTab === "INTERNSHIP" ? <FiUsers /> : <FiXCircle />}

                  <h3>
                    {activeTab === "INTERNSHIP"
                      ? "Chưa có sinh viên thực tập"
                      : "Chưa có sinh viên bị từ chối"}
                  </h3>

                  <p>Không có dữ liệu sinh viên trong trạng thái này.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default EmployerStudents;