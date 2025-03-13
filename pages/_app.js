import '../styles/globals.css';
import '../styles/auth.css';
import { SessionProvider } from "next-auth/react";
// Diğer import'larınız buraya

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;