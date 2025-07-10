import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2><span className="ai-highlight">SAG</span><span className="ai-color">AI</span></h2>
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
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/disclaimer">Disclaimer</Link>
            </div>
            <div className="link-group">
              <h3>Connect</h3>
              <a href="https://discord.gg/sagai">Discord</a>
              <a href="https://twitter.com/sagai">Twitter</a>
              <a href="https://reddit.com/r/sagai">Reddit</a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {currentYear} <span className="ai-highlight">SAG</span><span className="ai-color">AI</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}