import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="logo">
        <Link href="/">
          <h1>DragonQuest<span>AI</span></h1>
        </Link>
      </div>
      <nav>
        <ul>
          <li><Link href="/#home">Home</Link></li>
          <li><Link href="/#rules">Rules</Link></li>
          <li><Link href="/#plans">Plans</Link></li>
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/start" className="start-btn">Start</Link></li>
        </ul>
      </nav>
    </header>
  );
}