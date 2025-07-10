import { AuthProvider } from '../contexts/AuthContext';
import { useEffect } from 'react';
import '../styles/globals.css';
import '../styles/rulebook.css';
import '../styles/character-creator.css';
import '../styles/auth.css';
//import '../styles/existing-characters.css';
import '../styles/start.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Tell Font Awesome to skip adding CSS automatically
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  // Initialize database on application start
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await fetch('/api/init-db');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDatabase();
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;