import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={menuOpen ? 'menu-open' : ''}>
      <div className="logo">
        <Link href="/">
          <h1>Dragon<span>QuestAI</span></h1>
        </Link>
      </div>

      <div className="menu-toggle" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <nav>
        <ul className="main-nav">
          <li><Link href="/">Ana Sayfa</Link></li>
          <li><Link href="/#rules">Kurallar</Link></li>
          <li><Link href="/about">Hakkında</Link></li>
          <li><Link href="/existing-characters">Karakterler</Link></li>
          <li><Link href="/rules">Kitapçık</Link></li>
        </ul>

        <ul className="auth-nav">
          {session ? (
            <li className="user-dropdown">
              <button className="auth-button">
                <FontAwesomeIcon icon={faUser} />
                <span>{session.user.name}</span>
              </button>
              <div className="dropdown-content">
                <Link href="/profile">Profil</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })}>Çıkış Yap</button>
              </div>
            </li>
          ) : (
            <li>
              <Link href="/login" className="auth-button">
                <FontAwesomeIcon icon={faUser} /> Giriş Yap
              </Link>
            </li>
          )}
          <li>
            <Link href="/start" className="start-btn">Oyna</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}