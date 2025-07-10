import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Auth.module.css';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();
  
  // Get email from query parameter
  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email);
    }
  }, [router.query]);
  
  // Timer countdown effect for resend button
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleResend() {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }
      
      setMessage('A new verification code has been sent to your email');
      setTimeLeft(60); // 60 seconds cooldown for resend
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Verify Your Email</h1>
        <p className={styles.description}>
          Enter the 6-digit verification code sent to your email
        </p>
        
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="code">Verification Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="Enter 6-digit code"
              className={styles.input}
              maxLength={6}
              pattern="\d{6}"
              title="Please enter a 6-digit code"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          
          <button 
            type="button" 
            className={styles.secondaryButton}
            onClick={handleResend}
            disabled={loading || !email || timeLeft > 0}
          >
            {timeLeft > 0 ? `Resend Code (${timeLeft}s)` : 'Resend Code'}
          </button>
        </form>
      </div>
    </div>
  );
}