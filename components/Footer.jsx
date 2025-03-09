import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>DragonQuestAI</h2>
            <p>The next generation of role-playing adventures</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h3>Navigation</h3>
              <Link href="/#home">Home</Link>
              <Link href="/#rules">Rules</Link>
              <Link href="/#plans">Plans</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="link-group">
              <h3>Legal</h3>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/disclaimer">Disclaimer</Link>
            </div>
            <div className="link-group">
              <h3>Connect</h3>
              <a href="https://discord.gg/dragonquestai">Discord</a>
              <a href="https://twitter.com/dragonquestai">Twitter</a>
              <a href="https://reddit.com/r/dragonquestai">Reddit</a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {currentYear} DragonQuestAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}