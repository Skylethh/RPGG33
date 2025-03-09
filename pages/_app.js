import '../styles/globals.css';
import '../styles/rulebook.css';
import '../styles/character-creator.css';
import '../styles/existing-characters.css';
import '../styles/start.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Tell Font Awesome to skip adding CSS automatically
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;