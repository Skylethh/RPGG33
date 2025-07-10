import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Layout({ children, title = 'SAGAI - Interactive D&D Experience' }) {
  const router = useRouter();
  
  // Header'ın görünmesi gereken sayfalar
  const showHeaderPaths = ['/', '/rules', '/existing-characters', '/profile'];
  const shouldShowHeader = showHeaderPaths.some(path => 
    router.pathname === path || router.pathname.startsWith(path + '/')
  );
  
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
        <meta name="description" content="SAGAI - AI-powered D&D adventure experience" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Fontları doğrudan import edelim - _document.js'te style tanımlanmalı */}
      </Head>
      
      <div className="bg-container">
        <div className="moving-bg"></div>
      </div>
      
      {shouldShowHeader && <Header />}
      
      <main>{children}</main>
      
      <Footer />
    </>
  );
}