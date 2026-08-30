import "./PageHeroEmployer.css";

function PageHeroEmployer({
  badge,
  title,
  highlight,
  description,
}) {
  return (
    <section className="employer-page-hero">
      <div className="employer-hero-decoration employer-decoration-one"></div>
      <div className="employer-hero-decoration employer-decoration-two"></div>

      <div className="page-container employer-hero-content">
        <div>
          {badge && (
            <div className="employer-hero-badge">
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

export default PageHeroEmployer;