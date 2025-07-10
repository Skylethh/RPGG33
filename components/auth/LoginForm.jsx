import { useState } from 'react';
import { motion } from 'framer-motion';

const LoginForm = ({ onSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.emailOrUsername) {
      newErrors.emailOrUsername = 'Email veya kullanıcı adı gerekli';
    }
    
    if (!formData.password) {
      newErrors.password = 'Şifre gerekli';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error on change
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
// In the handleSubmit function, update the successful verification response handler:

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsLoading(true);
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Giriş yapılırken bir hata oluştu');
    }
    
    if (data.requiresVerification) {
      // Use the email from the server response, not from the form
      onSuccess(data.email);
      return;
    }
    
    // Success login, no verification needed
    window.location.href = '/';
    
  } catch (error) {
    setErrors({ form: error.message });
  } finally {
    setIsLoading(false);
  }
};
  
  const handleGoogleLogin = async () => {
    // Implement Google login logic here
    try {
      window.location.href = '/api/auth/google';
    } catch (error) {
      setErrors({
        ...errors,
        form: 'Google ile giriş sırasında bir hata oluştu',
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="auth-form"
    >
      <h2>Giriş Yap</h2>
      
      {errors.form && (
        <div className="error-message">{errors.form}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="emailOrUsername">E-posta veya kullanıcı adı</label>
          <input
            type="text"
            id="emailOrUsername"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
            className={errors.emailOrUsername ? 'error' : ''}
          />
          {errors.emailOrUsername && (
            <span className="error-text">{errors.emailOrUsername}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>
        
        <div className="form-options">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">Beni hatırla</label>
          </div>
          
          <a href="#" className="forgot-password">
            Şifremi unuttum
          </a>
        </div>
        
        <button
          type="submit"
          className="btn primary-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
      
      <div className="auth-separator">
        <span>veya</span>
      </div>
      
      <button
        type="button"
        className="btn google-btn"
        onClick={handleGoogleLogin}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Google icon SVG path */}
          <path d="M19.8055 10.2275C19.8055 9.51691 19.7516 8.83941 19.6516 8.17969H10.2055V11.8719H15.6094C15.3883 13.0922 14.7078 14.1328 13.7109 14.7844V17.2516H16.9572C18.8883 15.4797 19.8055 13.0578 19.8055 10.2275Z" fill="#4285F4"/>
          <path d="M10.2055 20.0008C12.9055 20.0008 15.1742 19.1133 16.9602 17.2516L13.7138 14.7844C12.8055 15.4008 11.6234 15.7516 10.2086 15.7516C7.58008 15.7516 5.35938 14.0344 4.58555 11.6625H1.24414V14.2078C3.04102 17.7063 6.39258 20.0008 10.2055 20.0008Z" fill="#34A853"/>
          <path d="M4.58249 11.6625C4.16718 10.4422 4.16718 9.10781 4.58249 7.88749V5.34219H1.24412C-0.154256 8.00781 -0.154256 11.5422 1.24412 14.2078L4.58249 11.6625Z" fill="#FBBC05"/>
          <path d="M10.2055 4.24844C11.6273 4.23125 13.0008 4.73594 14.0617 5.675L16.9742 2.76094C15.1461 1.03594 12.7336 0.0328126 10.2055 0.046875C6.39258 0.046875 3.04102 2.34375 1.24414 5.84219L4.58252 8.3875C5.35939 6.01563 7.58008 4.29844 10.2055 4.24844Z" fill="#EA4335"/>
        </svg>
        Google ile giriş yap
      </button>
      
      <p className="auth-switch">
        Hesabın yok mu? <a href="#" onClick={onSwitchToSignup}>Kayıt ol</a>
      </p>
    </motion.div>
  );
};

export default LoginForm;