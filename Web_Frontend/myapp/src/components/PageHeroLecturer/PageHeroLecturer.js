import "./PageHeroLecturer.css";

function PageHeroLecturer({
  badge,
  title,
  highlight,
  description,
}) {
  return (
    <section className="lecturer-page-hero">
      <div className="lecturer-hero-decoration lecturer-decoration-one"></div>
      <div className="lecturer-hero-decoration lecturer-decoration-two"></div>

      <div className="page-container lecturer-hero-content">
        <div>
          {badge && (
            <div className="lecturer-hero-badge">
              {badge}
            </div>
          )}

          <h1>
            {title}
            {highlight && <span> {highlight}</span>}
          </h1>

          {description && <p>{description}</p>}
        </div>
      </div>
    </section>
  );
}

export default PageHeroLecturer;