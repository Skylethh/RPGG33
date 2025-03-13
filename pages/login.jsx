import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { callbackUrl } = router.query;

  // Handle form submission for email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        rememberMe,
      });

      if (result.error) {
        setError('Giriş bilgileri hatalı. Lütfen tekrar deneyin.');
        setIsLoading(false);
      } else {
        router.push(callbackUrl || '/');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: callbackUrl || '/' });
  };

  return (
    <Layout title="Giriş Yap | DragonQuest AI">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Maceraya Giriş</h1>
            <p>Hesabınıza giriş yaparak efsanevi yolculuğunuza devam edin</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="savaşçı@eposta.com"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                /> Beni Hatırla
              </label>
              <Link href="/forgot-password" className="forgot-password">
                Şifremi Unuttum
              </Link>
            </div>

            <button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
            >
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Giriş Yap'}
            </button>
          </form>

          <div className="social-login">
            <p>Veya şununla giriş yap:</p>
            <div className="social-buttons">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="google-login"
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faGoogle} /> Google
              </button>
              <button 
                onClick={() => handleSocialLogin('discord')}
                className="discord-login"
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faDiscord} /> Discord
              </button>
            </div>
          </div>

          <div className="register-link">
            <p>
              Hesabın yok mu? <Link href="/register">Kayıt Ol</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}