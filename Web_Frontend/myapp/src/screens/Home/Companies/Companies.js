function Companies({ company }) {
    return (
        <article className="company-card" key={company.id}>
                <div className="company-card-cover">
                  <span>{company.field}</span>
                </div>

                <div className="company-card-body">
                  <div className="company-card-logo">{company.logo}</div>

                  <div className="company-card-content">
                    <h3>{company.name}</h3>
                    <p>{company.field}</p>

                    <div className="company-jobs">
                      <span>💼</span>
                      {company.jobs} vị trí đang tuyển
                    </div>

                    <a href={`/companies/${company.id}`}>
                      Xem doanh nghiệp
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </article>
    );
}
export default Companies;