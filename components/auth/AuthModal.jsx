import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import VerificationForm from './VerificationForm';

const AuthModal = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState('login'); // login, signup, verification
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && !isVerifying) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    // Tüm sayfayı blurlamak için body'e blur class'ı ekle
    if (isOpen) {
      document.body.classList.add('body-blur');
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      // Modal kapandığında blur class'ını kaldır
      document.body.classList.remove('body-blur');
    };
  }, [onClose, isVerifying, isOpen]);

  // Persist verification state in session storage
  useEffect(() => {
    // When component mounts, check if there's a saved verification state
    if (isOpen) {
      const savedState = sessionStorage.getItem('authVerificationState');
      if (savedState) {
        const { email, isVerifying } = JSON.parse(savedState);
        if (isVerifying) {
          setVerificationEmail(email);
          setIsVerifying(true);
          setAuthMode('verification');
        }
      }
    }
  }, [isOpen]);

  // Save verification state when it changes
  useEffect(() => {
    if (isVerifying && verificationEmail) {
      sessionStorage.setItem('authVerificationState', JSON.stringify({
        email: verificationEmail,
        isVerifying: true
      }));
    } else if (!isVerifying) {
      sessionStorage.removeItem('authVerificationState');
    }
  }, [isVerifying, verificationEmail]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleLoginSuccess = (email) => {
    setVerificationEmail(email);
    setIsVerifying(true);
    setAuthMode('verification');
  };

  const handleSignupSuccess = (email) => {
    setVerificationEmail(email);
    setIsVerifying(true);
    setAuthMode('verification');
  };

  const handleVerificationSuccess = () => {
    setIsVerifying(false);
    sessionStorage.removeItem('authVerificationState');
    onClose();
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop and not during verification
    if (e.target === e.currentTarget && !isVerifying) {
      onClose();
    }
  };

  const handleBackToLogin = () => {
    setIsVerifying(false);
    setAuthMode('login');
    sessionStorage.removeItem('authVerificationState');
  };

  const renderAuthForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setAuthMode('signup')}
          />
        );
      case 'signup':
        return (
          <SignupForm 
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        );
      case 'verification':
        return (
          <VerificationForm 
            email={verificationEmail}
            onSuccess={handleVerificationSuccess}
            onBack={handleBackToLogin}
          />
        );
      default:
        return <LoginForm />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            {/* Modal content */}
            <motion.div 
              className="auth-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              {!isVerifying && (
                <button className="modal-close-btn" onClick={onClose}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
              
              <div className="auth-form-container">
                {renderAuthForm()}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;