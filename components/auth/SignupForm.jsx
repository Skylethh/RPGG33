import { useState } from 'react';
import { motion } from 'framer-motion';

const SignupForm = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    const feedback = [];
    
    // Length check
    if (password.length < 8) {
      feedback.push('Şifre en az 8 karakter olmalıdır');
    } else {
      strength += 1;
    }
    
    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      feedback.push('En az bir büyük harf içermelidir');
    } else {
      strength += 1;
    }
    
    // Lowercase check
    if (!/[a-z]/.test(password)) {
      feedback.push('En az bir küçük harf içermelidir');
    } else {
      strength += 1;
    }
    
    // Number check
    if (!/[0-9]/.test(password)) {
      feedback.push('En az bir rakam içermelidir');
    } else {
      strength += 1;
    }
    
    // Special character check
    if (!/[^A-Za-z0-9]/.test(password)) {
      feedback.push('En az bir özel karakter içermelidir');
    } else {
      strength += 1;
    }
    
    let strengthText = '';
    let strengthClass = '';
    
    if (strength === 0) {
      strengthText = 'Çok zayıf';
      strengthClass = 'very-weak';
    } else if (strength === 1 || strength === 2) {
      strengthText = 'Zayıf';
      strengthClass = 'weak';
    } else if (strength === 3) {
      strengthText = 'Orta';
      strengthClass = 'medium';
    } else if (strength === 4) {
      strengthText = 'Güçlü';
      strengthClass = 'strong';
    } else {
      strengthText = 'Çok güçlü';
      strengthClass = 'very-strong';
    }
    
    return {
      strength,
      strengthText,
      strengthClass,
      feedback,
      isStrong: strength >= 4,
    };
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username) {
      newErrors.username = 'Kullanıcı adı gerekli';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'E-posta adresi gerekli';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Şifre gerekli';
    } else {
      const { isStrong, feedback } = checkPasswordStrength(formData.password);
      if (!isStrong) {
        newErrors.password = feedback.join(', ');
      }
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }
    
    // Terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Devam etmek için koşulları kabul etmelisiniz';
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Make API call to signup endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Kayıt olurken bir hata oluştu');
      }
      
      // Call onSuccess to trigger verification
      onSuccess(formData.email);
      
    } catch (error) {
      setErrors({
        ...errors,
        form: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show password strength indicator
  const getPasswordStrengthInfo = () => {
    if (!formData.password) return null;
    
    const { strengthText, strengthClass, feedback } = checkPasswordStrength(formData.password);
    
    return (
      <div className="password-strength">
        <div className="strength-meter">
          <div className={`strength-meter-fill ${strengthClass}`}></div>
        </div>
        <div className="strength-text">
          Şifre gücü: <span className={strengthClass}>{strengthText}</span>
        </div>
        {feedback.length > 0 && (
          <ul className="strength-feedback">
            {feedback.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="auth-form"
    >
      <h2>Kayıt Ol</h2>
      
      {errors.form && (
        <div className="error-message">{errors.form}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Kullanıcı Adı</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && (
            <span className="error-text">{errors.username}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && (
            <span className="error-text">{errors.email}</span>
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
          {getPasswordStrengthInfo()}
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Şifre Tekrarı</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && (
            <span className="error-text">{errors.confirmPassword}</span>
          )}
        </div>
        
        <div className="checkbox-group terms-group">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className={errors.agreeTerms ? 'error' : ''}
          />
          <label htmlFor="agreeTerms">
            <a href="/terms" target="_blank">Kullanım Şartları</a> ve <a href="/privacy" target="_blank">Gizlilik Politikası</a>'nı kabul ediyorum.
          </label>
          {errors.agreeTerms && (
            <span className="error-text">{errors.agreeTerms}</span>
          )}
        </div>
        
        <button
          type="submit"
          className="btn primary-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </button>
      </form>
      
      <div className="auth-separator">
        <span>veya</span>
      </div>
      
      <button
        type="button"
        className="btn google-btn"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Google icon SVG path */}
          <path d="M19.8055 10.2275C19.8055 9.51691 19.7516 8.83941 19.6516 8.17969H10.2055V11.8719H15.6094C15.3883 13.0922 14.7078 14.1328 13.7109 14.7844V17.2516H16.9572C18.8883 15.4797 19.8055 13.0578 19.8055 10.2275Z" fill="#4285F4"/>
          <path d="M10.2055 20.0008C12.9055 20.0008 15.1742 19.1133 16.9602 17.2516L13.7138 14.7844C12.8055 15.4008 11.6234 15.7516 10.2086 15.7516C7.58008 15.7516 5.35938 14.0344 4.58555 11.6625H1.24414V14.2078C3.04102 17.7063 6.39258 20.0008 10.2055 20.0008Z" fill="#34A853"/>
          <path d="M4.58249 11.6625C4.16718 10.4422 4.16718 9.10781 4.58249 7.88749V5.34219H1.24412C-0.154256 8.00781 -0.154256 11.5422 1.24412 14.2078L4.58249 11.6625Z" fill="#FBBC05"/>
          <path d="M10.2055 4.24844C11.6273 4.23125 13.0008 4.73594 14.0617 5.675L16.9742 2.76094C15.1461 1.03594 12.7336 0.0328126 10.2055 0.046875C6.39258 0.046875 3.04102 2.34375 1.24414 5.84219L4.58252 8.3875C5.35939 6.01563 7.58008 4.29844 10.2055 4.24844Z" fill="#EA4335"/>
        </svg>
        Google ile kayıt ol
      </button>
      
      <p className="auth-switch">
        Zaten hesabın var mı? <a href="#" onClick={onSwitchToLogin}>Giriş yap</a>
      </p>
    </motion.div>
  );
};

export default SignupForm;