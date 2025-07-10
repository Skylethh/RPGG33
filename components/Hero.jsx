import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>Embark on Your <span className="ai-highlight">AI</span>-Powered<br/>D&D Adventure</h1>
        <p>Explore endless realms, craft epic stories, and battle legendary creatures with our advanced <span className="ai-highlight">SAG</span><span className="ai-color">AI</span> Dungeon Master</p>
        <div className="cta-buttons">
          <Link href="/start" className="btn primary-btn">Begin Your Quest</Link>
          <Link href="/#rules" className="btn secondary-btn">Learn The Rules</Link>
        </div>
      </div>
    </section>
  );
}