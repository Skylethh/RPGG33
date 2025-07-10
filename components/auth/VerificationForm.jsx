import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const VerificationForm = ({ email, onSuccess, onBack }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // If pasted data is a 6-digit number, fill all inputs
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits);
      
      // Focus last input
      const lastInput = document.getElementById('code-5');
      if (lastInput) lastInput.focus();
    }
  };
  
  const handleResendCode = async () => {
    setResending(true);
    setError('');
    
    try {
      // Make API call to resend verification code
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Doğrulama kodu gönderilirken bir hata oluştu');
      }
      
      // Reset timer
      setTimeLeft(60);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setResending(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if code is complete
    if (code.some(digit => !digit)) {
      setError('Lütfen 6 haneli doğrulama kodunu giriniz');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Make API call to verify code
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: code.join(''),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Doğrulama kodu geçersiz');
      }
      
      // Call onSuccess to complete the authentication process
      onSuccess();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="auth-form verification-form"
    >
      <button 
        onClick={onBack} 
        className="back-button"
        type="button"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Geri
      </button>
      
      <h2>E-posta Doğrulama</h2>
      
      <p className="verification-info">
        <span className="email-highlight">{email}</span> adresine bir doğrulama kodu gönderdik.
        Lütfen gelen 6 haneli kodu giriniz.
      </p>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="verification-code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              autoFocus={index === 0}
            />
          ))}
        </div>
        
        <div className="timer-container">
          <span>Kodu yeniden gönder</span>
          {timeLeft > 0 ? (
            <span className="timer">{formatTime(timeLeft)}</span>
          ) : (
            <button
              type="button"
              className="resend-btn"
              onClick={handleResendCode}
              disabled={resending}
            >
              {resending ? 'Gönderiliyor...' : 'Şimdi gönder'}
            </button>
          )}
        </div>
        
        <button
          type="submit"
          className="btn primary-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Doğrulanıyor...' : 'Doğrula'}
        </button>
      </form>
    </motion.div>
  );
};

export default VerificationForm;