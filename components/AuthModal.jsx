import { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaUser, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { signIn, signUp, supabase } from '../lib/supabase';

// Şifre güçlülüğünü değerlendiren fonksiyon
const evaluatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Empty', color: '#ccc' };
  
  let score = 0;
  
  // Uzunluk kontrolü
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Karakter çeşitliliği kontrolü
  if (/[A-Z]/.test(password)) score += 1; // Büyük harf
  if (/[a-z]/.test(password)) score += 1; // Küçük harf
  if (/[0-9]/.test(password)) score += 1; // Rakam
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Özel karakter
  
  // Skor değerlendirmesi
  let label, color;
  if (score <= 2) {
    label = 'Weak';
    color = '#ff4d4d';
  } else if (score <= 4) {
    label = 'Medium';
    color = '#ffaa00';
  } else if (score <= 5) {
    label = 'Strong';
    color = '#2bd965';
  } else {
    label = 'Very Strong';
    color = '#00b300';
  }
  
  // Normalize score to 0-100 for progress bar
  const normalizedScore = Math.min(Math.floor((score / 6) * 100), 100);
  
  return { score: normalizedScore, label, color };
};

const AuthModal = ({ mode = 'login', onClose, onSuccess, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Empty', color: '#ccc' });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    // Tüm sayfayı bulanıklaştırmak için body'e blur class'ı ekle
    document.body.classList.add('body-blur');
    
    // Modal açıldığında scroll'u engelle
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      // Modal kapandığında blur class'ını kaldır
      document.body.classList.remove('body-blur');
      // Modal kapandığında scroll'u tekrar etkinleştir
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Şifre değiştiğinde güçlülük değerlendirmesi yap
    if (name === 'password') {
      setPasswordStrength(evaluatePasswordStrength(value));
    }
    
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!formData.username.trim()) {
          throw new Error('Username is required');
        }

        if (!validateEmail(formData.email)) {
          throw new Error('Please enter a valid email address');
        }

        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        if (passwordStrength.score < 40) {
          throw new Error('Please use a stronger password');
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Supabase'e kayıt işlemi
        const userData = await signUp({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          name: formData.username // Name alanını kaldırdığımız için username'i kullanıyoruz
        });
        
        // Kayıt başarılı, email doğrulama ekranını göster
        setVerificationEmailSent(true);
      } else {
        if (!formData.email || !validateEmail(formData.email)) {
          throw new Error('Please enter a valid email address');
        }

        if (!formData.password) {
          throw new Error('Password is required');
        }

        await signIn({
          email: formData.email,
          password: formData.password
        });
        
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google ile giriş yapma 
  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Google sign in failed. Please try again.');
    }
  };

  // Backdrop tıklaması için daha güvenilir kapatma mekanizması
  const handleBackdropClick = (e) => {
    // Sadece arka planın kendisine tıklandığında kapatma işlemi yapılır
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (verificationEmailSent) {
    return (
      <div className="modalOverlay" onClick={handleBackdropClick}>
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
          
          <div className="auth-form-container">
            <h2>Check Your Email</h2>
            <p>Verify your email to continue</p>
          
            <div className="verification-code-container">
              <FaCheckCircle style={{ fontSize: '3.5rem', color: '#4caf50', marginBottom: '1rem' }} />
              <p>
                We've sent a verification link to: <br />
                <strong className="email-highlight">{formData.email}</strong>
              </p>
              <p className="verification-info">
                Please check your email and click the verification link to complete your registration.
                The link will expire in 24 hours.
              </p>
              
              <button 
                className="btn primary-btn"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modalOverlay" onClick={handleBackdropClick}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="auth-form-container">
          <div className="auth-form">
            <h2>{mode === 'login' ? 'Log In' : 'Sign Up'}</h2>
            <p>
              {mode === 'login' 
                ? 'Welcome back, adventurer!' 
                : 'Join us on epic adventures!'}
            </p>
          
            {error && <div className="error-message">{error}</div>}
          
            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="form-group">
                  <label htmlFor="username">
                    <FaUser style={{ marginRight: '10px' }} />
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope style={{ marginRight: '10px' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock style={{ marginRight: '10px' }} />
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                
                {mode === 'signup' && formData.password && (
                  <div className="password-strength">
                    <div className="strength-meter">
                      <div 
                        className="strength-meter-fill"
                        style={{ 
                          width: `${passwordStrength.score}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <div className="strength-text">
                      Password strength: <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {mode === 'signup' && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <FaLock style={{ marginRight: '10px' }} />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn primary-btn"
                disabled={loading}
              >
                {loading 
                  ? 'Processing...' 
                  : mode === 'login' ? 'Log In' : 'Create Account'}
              </button>
              
              {mode === 'login' && (
                <button 
                  type="button"
                  className="google-btn"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle style={{ fontSize: '1.5rem' }} />
                  Sign in with Google
                </button>
              )}
            </form>
            
            <div className="auth-switch">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <a href="#" onClick={() => onSwitchMode('signup')}>
                    Sign Up
                  </a>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <a href="#" onClick={() => onSwitchMode('login')}>
                    Log In
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;