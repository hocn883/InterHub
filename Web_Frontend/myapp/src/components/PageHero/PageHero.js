import "./PageHero.css";

function PageHero({ badge, title, highlight, description }) {
  return (
    <section className="page-hero">
      <div className="page-hero-decoration decoration-one"></div>
      <div className="page-hero-decoration decoration-two"></div>

      <div className="page-container page-hero-content">
        <div>
          {badge && <div className="page-hero-badge">{badge}</div>}

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

export default PageHero;