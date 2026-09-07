import "./StudentDetails.css";
import {useNavigate,useLocation} from "react-router-dom";

function StudentDetails(){
    const navigate=useNavigate();
  const location=useLocation();
  const student=location.state?.student;
  const genderLabel={
    MALE:"Nam",
    FEMALE:"Nữ",
    OTHER:"Khác"
  };

  const statusLabel={
    TIM_VIEC:"Đang tìm việc",
    DA_CO_VIEC:"Đã có việc"
  };

  if(!student){
    return(
      <div className="student-state">
        <h2>Không thể tải thông tin</h2>
        <p>Không tìm thấy sinh viên.</p>
        <button type="button" onClick={()=>navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return(
    <main className="student-detail-page">
      <div className="student-detail-container">
        <button type="button" className="student-back-button" onClick={()=>navigate(-1)}>← Quay lại</button>

        <section className="student-profile-card">
          <div className="student-profile-header">
            <div className="student-avatar">
              {student.avatarUrl?<img src={student.avatarUrl} alt={student.fullName}/>:<span>{student.fullName?.charAt(0).toUpperCase()||"S"}</span>}
            </div>

            <div className="student-main-info">
              <div className="student-title-row">
                <h1>{student.fullName||"Sinh viên"}</h1>
                <span className={`student-status ${student.status?.toLowerCase()||""}`}>
                  {statusLabel[student.status]||student.status||"Chưa cập nhật"}
                </span>
              </div>

              <p>{student.major||"Chưa cập nhật chuyên ngành"}</p>
              <span className="student-code">MSSV: {student.mssv||"Chưa cập nhật"}</span>
            </div>
          </div>

          <div className="student-information">
            <div className="student-info-item"><span>Họ và tên</span><strong>{student.fullName||"Chưa cập nhật"}</strong></div>
            <div className="student-info-item"><span>Mã số sinh viên</span><strong>{student.mssv||"Chưa cập nhật"}</strong></div>
            <div className="student-info-item"><span>Chuyên ngành</span><strong>{student.major||"Chưa cập nhật"}</strong></div>
            <div className="student-info-item"><span>Lớp</span><strong>{student.className||"Chưa cập nhật"}</strong></div>
          </div>
        </section>

        <section className="student-section">
          <div className="student-section-header">
            <span>THÔNG TIN LIÊN HỆ</span>
            <h2>Thông tin cá nhân</h2>
            <p>Thông tin cơ bản và phương thức liên hệ của sinh viên.</p>
          </div>

          <div className="student-detail-grid">
            <div className="student-detail-item"><span>Email</span><strong>{student.email||"Chưa cập nhật"}</strong></div>
            <div className="student-detail-item"><span>Số điện thoại</span><strong>{student.phone||"Chưa cập nhật"}</strong></div>
            <div className="student-detail-item"><span>Giới tính</span><strong>{genderLabel[student.gender]||student.gender||"Chưa cập nhật"}</strong></div>
            <div className="student-detail-item"><span>Tên đăng nhập</span><strong>{student.username||"Chưa cập nhật"}</strong></div>
          </div>
        </section>

        <section className="student-section">
          <div className="student-section-header">
            <span>HỌC TẬP</span>
            <h2>Thông tin học tập</h2>
            <p>Thông tin lớp học, chuyên ngành và giảng viên phụ trách.</p>
          </div>

          <div className="student-detail-grid">
            <div className="student-detail-item"><span>Chuyên ngành</span><strong>{student.major||"Chưa cập nhật"}</strong></div>
            <div className="student-detail-item"><span>Lớp</span><strong>{student.className||"Chưa cập nhật"}</strong></div>
            <div className="student-detail-item"><span>Trạng thái</span><strong>{statusLabel[student.status]||student.status||"Chưa cập nhật"}</strong></div>
            <div className="student-detail-item"><span>Giảng viên phụ trách</span><strong>{student.lecturer?.fullName||"Chưa có giảng viên phụ trách"}</strong></div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default StudentDetails;