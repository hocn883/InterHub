import './FollowedCompanies.css'
import FollowedCompanyCard from './FollowedCompaniesCard'

const FollowedCompanies = () => {

    // ==========================================
    // DỮ LIỆU GIẢ
    // Sau này thay bằng API:
    // GET /api/students/followed-companies
    // ==========================================
    const followedCompanies = [
        {
            id: 1,
            companyName: 'FPT Software',
            shortName: 'FPT',
            field: 'Công nghệ thông tin',
            location: 'TP. Hồ Chí Minh',
            followers: 1250,
            openJobs: 12,
            description:
                'Công ty công nghệ hàng đầu Việt Nam với nhiều cơ hội thực tập cho sinh viên.',
        },
        {
            id: 2,
            companyName: 'VNG Corporation',
            shortName: 'VNG',
            field: 'Phần mềm & Internet',
            location: 'TP. Hồ Chí Minh',
            followers: 980,
            openJobs: 8,
            description:
                'Môi trường trẻ trung, năng động với nhiều vị trí Backend, Frontend và Mobile.',
        },
        {
            id: 3,
            companyName: 'NashTech',
            shortName: 'NT',
            field: 'Software Outsourcing',
            location: 'TP. Hồ Chí Minh',
            followers: 720,
            openJobs: 5,
            description:
                'Doanh nghiệp phát triển phần mềm quốc tế với nhiều chương trình Internship.',
        },
    ]

    // ==========================================
    // HỦY FOLLOW
    // Sau này gọi API DELETE hoặc POST unfollow
    // ==========================================
    const handleUnfollow = (companyId) => {
        console.log('Unfollow company:', companyId)
    }

    return (
        <main className="followed-companies-page">

            <section className="page-container">

                <div className="followed-company-heading">

                    <div>
                        <span className="page-badge">
                            🏢 DOANH NGHIỆP
                        </span>

                        <h1 className="page-title">
                            Doanh nghiệp <span>đã theo dõi</span>
                        </h1>

                        <p className="page-description">
                            Theo dõi các doanh nghiệp bạn quan tâm và
                            cập nhật cơ hội thực tập mới nhất.
                        </p>
                    </div>


                    <div className="followed-company-stat">
                        <strong>
                            {followedCompanies.length}
                        </strong>

                        <span>Đang theo dõi</span>
                    </div>

                </div>


                <div className="followed-company-grid">

                    {followedCompanies.map((company) => (
                        <FollowedCompanyCard
                            key={company.id}
                            company={company}
                            onUnfollow={handleUnfollow}
                        />
                    ))}

                </div>

            </section>

        </main>
    )
}

export default FollowedCompanies