import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { useEffect } from 'react';

export default function Layout({ children, title = 'DragonQuest AI - Interactive D&D Experience' }) {
  useEffect(() => {
    // Enhanced background parallax effect
    const handleScroll = () => {
      const movingBg = document.querySelector('.moving-bg');
      if (movingBg) {
        const scrollPosition = window.scrollY;
        movingBg.style.transform = `translateY(${scrollPosition * 0.15}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="AI-powered D&D adventure experience" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Spectral:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      <div className="bg-container">
        <div className="moving-bg"></div>
      </div>
      
      <Header />
      
      <main>{children}</main>
      
      <Footer />
    </>
  );
}