import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Auth.module.css';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (isSignUp) {
      // Kayıt işlemi
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Kayıt sırasında bir hata oluştu');
        }
        
        // Başarılı kayıttan sonra oturum aç
        await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        
        router.push('/');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    } else {
      // Giriş işlemi
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result.error) {
        setError('Geçersiz e-posta veya şifre');
        setLoading(false);
      } else {
        router.push('/');
      }
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <Layout>
      <Head>
        <title>{isSignUp ? 'Kayıt Ol' : 'Giriş Yap'} | DragonQuest AI</title>
      </Head>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authCardInner}>
            <div className={styles.authHeader}>
              <h1>{isSignUp ? 'Maceraya Başla' : 'Maceraya Dön'}</h1>
              <p>{isSignUp ? 'Yeni bir kahraman yarat' : 'Destanına kaldığın yerden devam et'}</p>
            </div>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <form onSubmit={handleSubmit} className={styles.authForm}>
              {isSignUp && (
                <div className={styles.formGroup}>
                  <label htmlFor="name">İsim</label>
                  <div className={styles.inputWithIcon}>
                    <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                    <input
                      type="text"
                      id="name"
                      placeholder="Karakter ismin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="email">E-posta</label>
                <div className={styles.inputWithIcon}>
                  <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    placeholder="senin@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password">Şifre</label>
                <div className={styles.inputWithIcon}>
                  <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Gizli şifren"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              
              {!isSignUp && (
                <div className={styles.forgotPassword}>
                  <Link href="/forgot-password">Şifreni mi unuttun?</Link>
                </div>
              )}
              
              <button
                type="submit"
                className={`${styles.authButton} ${styles.primaryButton}`}
                disabled={loading}
              >
                {loading ? 'Yükleniyor...' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </form>
            
            <div className={styles.divider}>
              <span>VEYA</span>
            </div>
            
            <div className={styles.socialAuth}>
              <button
                type="button"
                className={styles.googleButton}
                onClick={handleGoogleSignIn}
              >
                <FontAwesomeIcon icon={faGoogle} />
                <span>Google ile devam et</span>
              </button>
            </div>
            
            <div className={styles.switchMode}>
              {isSignUp ? (
                <>Zaten hesabın var mı? <button onClick={() => setIsSignUp(false)}>Giriş Yap</button></>
              ) : (
                <>Hesabın yok mu? <button onClick={() => setIsSignUp(true)}>Kayıt Ol</button></>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}