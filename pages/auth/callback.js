import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import styles from '../../styles/AuthCallback.module.css';
import Link from 'next/link';

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your email...');
  const [status, setStatus] = useState('loading'); // loading, success, error

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Supabase otomatik olarak URL parametrelerini işler
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          setStatus('success');
          setMessage('Email verified successfully!');
          
          // Kullanıcı oturumu açıldı, ana sayfaya yönlendir
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Email verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    // URL'de hash veya query parametreleri varsa doğrulama işlemini başlat
    if (router.isReady && (window.location.hash || Object.keys(router.query).length > 0)) {
      handleEmailVerification();
    }
  }, [router.isReady, router.query, router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          {status === 'loading' && <div className={styles.spinner}></div>}
          {status === 'success' && <div className={styles.successIcon}>✓</div>}
          {status === 'error' && <div className={styles.errorIcon}>✗</div>}
        </div>
        
        <h1 className={styles.title}>
          {status === 'loading' && 'Verifying Email'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h1>
        
        <p className={styles.message}>{message}</p>
        
        {status === 'error' && (
          <div className={styles.actions}>
            <Link href="/" className={styles.button}>
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 