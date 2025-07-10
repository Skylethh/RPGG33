import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';
import AuthModal from './AuthModal';
import { useAuth } from '../hooks/useAuth';
import { FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAbout = () => {
    // Check if we're on the homepage
    if (router.pathname === '/') {
      // Get the about section element
      const aboutSection = document.getElementById('about-section');
      
      // If the element exists, scroll to it
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on homepage, navigate to homepage and then scroll to about
      router.push('/#about-section');
    }
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <span className={styles.logoText}><span className={styles.sagText}>SAG</span><span className={styles.aiText}>AI</span></span>
          </Link>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={router.pathname === '/' ? styles.active : ''}>
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/rules" className={router.pathname === '/rules' ? styles.active : ''}>
                Rulebook
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/existing-characters" className={router.pathname === '/existing-characters' ? styles.active : ''}>
                Characters
              </Link>
            </li>
            <li className={styles.navItem}>
              <a onClick={scrollToAbout} className={styles.aboutLink}>
                About
              </a>
            </li>
          </ul>
        </nav>
        
        <div className={styles.auth}>
          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.userButton} onClick={toggleUserMenu}>
                <FaUser className={styles.userIcon} />
                <span>{user.user_metadata?.username || user.email.split('@')[0]}</span>
                <FaChevronDown className={`${styles.chevron} ${showUserMenu ? styles.chevronUp : ''}`} />
              </button>
              
              {showUserMenu && (
                <div className={styles.userDropdown}>
                  <Link href="/profile" className={styles.userDropdownItem}>
                    <FaUser className={styles.dropdownIcon} />
                    <span>My Profile</span>
                  </Link>
                  <button className={styles.userDropdownItem} onClick={handleLogout}>
                    <FaSignOutAlt className={styles.dropdownIcon} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className={styles.loginButton} onClick={handleLogin}>
                Login
              </button>
              <button className={styles.signupButton} onClick={handleSignup}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
      
      {showAuthModal && (
        <AuthModal 
          mode={authMode} 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={() => {
            setShowAuthModal(false);
          }}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </header>
  );
};

export default Header;