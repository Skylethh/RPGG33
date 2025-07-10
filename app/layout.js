import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';
import '../styles/rulebook.css';
import '../styles/character-creator.css';
import '../styles/auth.css';
import '../styles/start.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Font Awesome'ın otomatik CSS eklemesini engelle
config.autoAddCss = false;

export const metadata = {
  title: 'SAGAI - RPG Adventure',
  description: 'Your personal AI Dungeon Master for epic adventures.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Spectral:wght@400;500;600&family=Roboto:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}