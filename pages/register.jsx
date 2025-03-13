import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Password validation
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          throw new Error('Bu e-posta adresi zaten kullanılıyor');
        } else if (response.status === 400) {
          throw new Error(data.message || 'Geçersiz kayıt bilgileri');
        } else {
          throw new Error(data.message || 'Kayıt sırasında bir hata oluştu');
        }
      }

      // Registration successful, redirect to login page
      router.push('/login?registered=true');
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Kayıt Ol | DragonQuest AI">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Maceraya Katıl</h1>
            <p>Yeni bir hesap oluşturarak efsanevi dünyada yerini al</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Kullanıcı Adı</label>
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Cesur Kahraman"
                disabled={isLoading}
              />
            </div>

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

            <div className="form-group">
              <label htmlFor="confirmPassword">Şifre Tekrarı</label>
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div className="terms-agreement">
              <label className="remember-me">
                <input type="checkbox" required /> 
                <span><Link href="/terms" target="_blank">Kullanım Koşullarını</Link> ve <Link href="/privacy" target="_blank">Gizlilik Politikasını</Link> kabul ediyorum.</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="login-button" 
              disabled={isLoading}
            >
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Kayıt Ol'}
            </button>
          </form>

          <div className="register-link">
            <p>
              Zaten bir hesabın var mı? <Link href="/login">Giriş Yap</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}