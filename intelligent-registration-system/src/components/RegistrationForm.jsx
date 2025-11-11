import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Lock, Eye, EyeOff, 
  CheckCircle, XCircle, AlertCircle, Clock,
  Star, Shield, Zap, Contact, Key, FileText
} from 'lucide-react';
import { validators, countries, cities, getPasswordStrength } from '../utils/validators';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    country: '',
    state: '',
    city: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Star field animation
  useEffect(() => {
    const createStars = () => {
      const container = document.getElementById('stars-container');
      if (!container) return;
      container.innerHTML = '';

      for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const animationDelay = Math.random() * 3;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.animationDelay = `${animationDelay}s`;
        container.appendChild(star);
      }
    };

    createStars();
  }, []);

  // Country and state effects
  useEffect(() => {
    if (formData.country) {
      const countryData = countries.find(c => c.name === formData.country);
      setAvailableStates(countryData?.states || []);
      setFormData(prev => ({ ...prev, state: '', city: '' }));
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      setAvailableCities(cities[formData.state] || []);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.state]);

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return validators.required(value, 'First Name');
      case 'lastName':
        return validators.required(value, 'Last Name');
      case 'email':
        return validators.email(value);
      case 'phone':
        return validators.phone(value, formData.country);
      case 'age':
        return validators.age(value);
      case 'gender':
        return validators.required(value, 'Gender');
      case 'password':
        return validators.password(value);
      case 'confirmPassword':
        return validators.confirmPassword(formData.password, value);
      case 'terms':
        return !value ? 'You must accept the terms and conditions' : '';
      default:
        return '';
    }
  };

  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field] || showAllErrors) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched and validate all
    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);
    setShowAllErrors(true);
    
    const newErrors = validateAllFields();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitStatus('processing');
      setSubmitMessage('Processing your registration...');
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setSubmitMessage('Registration Successful! Your profile has been submitted successfully.');
        
        // Reset form
        setFormData({
          firstName: '', lastName: '', email: '', phone: '', age: '', gender: '',
          address: '', country: '', state: '', city: '', password: '', confirmPassword: '', terms: false
        });
        setTouched({});
        setErrors({});
        setShowAllErrors(false);
        
        // Auto hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
          setSubmitMessage('');
        }, 5000);
      }, 2000);
    } else {
      setSubmitStatus('error');
      setSubmitMessage(`Please fix ${Object.keys(newErrors).length} error(s) before submitting.`);
      
      // Add shake animation to all error fields
      document.querySelectorAll('.input-error').forEach(field => {
        field.classList.add('animate-shake');
        setTimeout(() => field.classList.remove('animate-shake'), 500);
      });

      // Auto hide error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 5000);
    }
  };

  const getInputClassName = (field) => {
    const baseClasses = "compact-input";
    const hasError = errors[field] && (touched[field] || showAllErrors);
    
    if (hasError) {
      return `${baseClasses} input-error ${showAllErrors ? 'animate-pulse-red' : ''}`;
    } else if (touched[field] && !errors[field] && formData[field]) {
      return `${baseClasses} input-success`;
    }
    
    return baseClasses;
  };

  const getFieldStatus = (field) => {
    if (errors[field] && (touched[field] || showAllErrors)) {
      return 'error';
    } else if (touched[field] && !errors[field] && formData[field]) {
      return 'success';
    }
    return 'neutral';
  };

  // Function to close alerts manually
  const closeAlert = () => {
    setSubmitStatus(null);
    setSubmitMessage('');
  };

  // Count required fields with errors
  const errorCount = Object.keys(errors).filter(key => 
    errors[key] && (touched[key] || showAllErrors)
  ).length;

  return (
    <div className="min-h-screen bg-dark-space py-8 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="cosmic-bg"></div>
      <div className="stars" id="stars-container"></div>

      <div className="form-block-container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-neon-blue to-neon-purple rounded-3xl mb-4 shadow-2xl neon-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent mb-2">
            QUANTUM REGISTER
          </h1>
          <p className="text-lg text-gray-300">
            Create your account and unlock exclusive features
          </p>
        </div>

        {/* Error Counter Badge */}
        {errorCount > 0 && (
          <div className="mb-6 p-4 error-counter animate-pulse">
            <div className="flex items-center justify-center space-x-3">
              <AlertCircle className="w-6 h-6 text-neon-pink" />
              <span className="text-white font-semibold">
                {errorCount} field{errorCount !== 1 ? 's' : ''} require{errorCount !== 1 ? '' : 's'} attention
              </span>
              <div className="w-3 h-3 bg-neon-pink rounded-full animate-ping"></div>
            </div>
          </div>
        )}

        {/* ALERT SYSTEM */}
        {/* Success Alert */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-6 rounded-2xl success-alert animate-slideIn">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">🎉 Registration Successful!</h3>
                  <p className="text-white opacity-90 text-lg">{submitMessage}</p>
                  <div className="mt-3 flex items-center space-x-2 text-green-200">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">You will be redirected shortly...</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeAlert}
                className="flex-shrink-0 text-white hover:text-green-200 transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-6 rounded-2xl error-alert animate-slideIn">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">❌ Registration Failed</h3>
                  <p className="text-white opacity-90 text-lg">{submitMessage}</p>
                  <div className="mt-3">
                    <p className="text-red-200 text-sm font-semibold mb-2">Please fix the following issues:</p>
                    <ul className="text-red-200 text-sm list-disc list-inside space-y-1">
                      {Object.keys(errors).map(key => errors[key] && (
                        <li key={key}>{errors[key]}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={closeAlert}
                className="flex-shrink-0 text-white hover:text-red-200 transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Processing Alert */}
        {submitStatus === 'processing' && (
          <div className="mb-6 p-6 rounded-2xl processing-alert animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">⏳ Processing Registration</h3>
                <p className="text-white opacity-90">{submitMessage}</p>
                <div className="mt-3 w-full bg-white/20 rounded-full h-2">
                  <div className="bg-neon-blue h-2 rounded-full animate-progress"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN FORM BLOCK */}
        <div className="form-main-block">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              
              {/* LEFT COLUMN - Personal Information */}
              <div className="form-section">
                <div className="section-header">
                  <div className="flex items-center space-x-3 mb-2">
                    <User className="w-5 h-5 text-neon-blue" />
                    <h2 className="section-title">Personal Information</h2>
                  </div>
                  <p className="section-subtitle">Enter your basic personal details</p>
                </div>

                <div className="personal-info-grid">
                  {/* First Name */}
                  <div className="compact-input-group relative">
                    <label className="compact-label">
                      <span>FIRST NAME *</span>
                      {getFieldStatus('firstName') === 'error' && (
                        <div className="ml-2 w-3 h-3 bg-neon-pink rounded-full animate-ping"></div>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      onBlur={() => handleBlur('firstName')}
                      className={getInputClassName('firstName')}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (touched.firstName || showAllErrors) && (
                      <div className="error-text mt-2">
                        <AlertCircle className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-neon-pink">{errors.firstName}</span>
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="compact-input-group relative">
                    <label className="compact-label">
                      <span>LAST NAME *</span>
                      {getFieldStatus('lastName') === 'error' && (
                        <div className="ml-2 w-3 h-3 bg-neon-pink rounded-full animate-ping"></div>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      onBlur={() => handleBlur('lastName')}
                      className={getInputClassName('lastName')}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (touched.lastName || showAllErrors) && (
                      <div className="error-text mt-2">
                        <AlertCircle className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-neon-pink">{errors.lastName}</span>
                      </div>
                    )}
                  </div>

                  {/* Age */}
                  <div className="compact-input-group">
                    <label className="compact-label">
                      <span>AGE</span>
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      onBlur={() => handleBlur('age')}
                      className={getInputClassName('age')}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                    {errors.age && (touched.age || showAllErrors) && (
                      <div className="error-text mt-2">
                        <AlertCircle className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-neon-pink">{errors.age}</span>
                      </div>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="compact-input-group">
                    <label className="compact-label">
                      <span>GENDER *</span>
                      {getFieldStatus('gender') === 'error' && (
                        <div className="ml-2 w-3 h-3 bg-neon-pink rounded-full animate-ping"></div>
                      )}
                    </label>
                    <div className="cyber-radio-group">
                      {['Male', 'Female', 'Other'].map((option) => (
                        <label 
                          key={option} 
                          className={`cyber-radio-label ${formData.gender === option ? 'selected' : ''} ${
                            getFieldStatus('gender') === 'error' ? 'border-neon-pink animate-pulse-red' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            checked={formData.gender === option}
                            onChange={() => handleChange('gender', option)}
                            onBlur={() => handleBlur('gender')}
                            className="sr-only"
                          />
                          <span className="text-white">{option}</span>
                        </label>
                      ))}
                    </div>
                    {errors.gender && (touched.gender || showAllErrors) && (
                      <div className="error-text mt-2">
                        <AlertCircle className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-neon-pink">{errors.gender}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="compact-input-group full-width">
                  <label className="compact-label">
                    <MapPin className="w-4 h-4 text-neon-blue" />
                    <span>ADDRESS</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    className={getInputClassName('address')}
                    placeholder="Enter your full address"
                    rows="2"
                  />
                  {errors.address && (touched.address || showAllErrors) && (
                    <div className="error-text mt-2">
                      <AlertCircle className="w-4 h-4 text-neon-pink" />
                      <span className="text-sm text-neon-pink">{errors.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN - Contact & Security */}
              <div className="form-section">
                <div className="section-header">
                  <div className="flex items-center space-x-3 mb-2">
                    <Contact className="w-5 h-5 text-neon-purple" />
                    <h2 className="section-title">Contact & Security</h2>
                  </div>
                  <p className="section-subtitle">Your contact details and account security</p>
                </div>

                {/* Contact Information */}
                <div className="contact-section">
                  <div className="compact-input-group relative">
                    <label className="compact-label">
                      <Mail className="w-4 h-4 text-neon-blue" />
                      <span>EMAIL ADDRESS *</span>
                      {getFieldStatus('email') === 'error' && (
                        <div className="ml-2 w-3 h-3 bg-neon-pink rounded-full animate-ping"></div>
                      )}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={getInputClassName('email')}
                      placeholder="your@email.com"
                    />
                    {errors.email && (touched.email || showAllErrors) && (
                      <div className="error-text mt-2">
                        <AlertCircle className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-neon-pink">{errors.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="compact-input-group relative">
                    <label className="compact-label">
                      <Phone className="w-4 h-4 text-neon-blue" />
                      <span>PHONE NUMBER *</span>
                      {getFieldStatus('phone') === 'error' && (
                        <div className="ml-2 w-3 h-3 bg-neon-pink rounded-full animate-ping"></div>
                      )}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      className={getInputClassName('phone')}
                      placeholder="+1234567890"
                    />
                    {errors.phone && (touched.phone || showAllErrors) && (
                      <div className="error-text mt-2">
                        <AlertCircle className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-neon-pink">{errors.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="compact-input-group">
                  <label className="compact-label">
                    <span>LOCATION</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className={getInputClassName('country')}
                    >
                      <option value="">Country</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className={getInputClassName('state')}
                      disabled={!availableStates.length}
                    >
                      <option value="">State</option>
                      {availableStates.map(state => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className={getInputClassName('city')}
                      disabled={!availableCities.length}
                    >
                      <option value="">City</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password Section */}
                <div className="password-section">
                  <div className="compact-input-group relative">
                    <label className="compact-label">
                      <Key className="w-4 h-4 text-neon-blue" />
                      <span>PASSWORD *</span>
                      {getFieldStatus('password') === 'error' && (
                        <div className="ml-2 w-3 h-3 bg-neon-pink rounded-full animate-ping"></div>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        className={getInputClassName('password')}
                        placeholder="Create quantum password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="eye-toggle-btn"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.password && <PasswordStrengthMeter password={formData.password} />}
                    {errors.password && (touched.password || showAllErrors) && (
                      <div className="error-text mt-2">
                        <AlertCircle className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-neon-pink">{errors.password}</span>
                      </div>
                    )}
                  </div>

                  <div className="compact-input-group relative">
                    <label className="compact-label">
                      <Key className="w-4 h-4 text-neon-blue" />
                      <span>CONFIRM PASSWORD *</span>
                      {getFieldStatus('confirmPassword') === 'error' && (
                        <div className="ml-2 w-3 h-3 bg-neon-pink rounded-full animate-ping"></div>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        className={getInputClassName('confirmPassword')}
                        placeholder="Confirm quantum password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="eye-toggle-btn"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (touched.confirmPassword || showAllErrors) && (
                      <div className="error-text mt-2">
                        <AlertCircle className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-neon-pink">{errors.confirmPassword}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className="terms-section">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.terms}
                      onChange={(e) => handleChange('terms', e.target.checked)}
                      onBlur={() => handleBlur('terms')}
                      className={`enhanced-checkbox mt-1 ${
                        getFieldStatus('terms') === 'error' ? 'animate-pulse-red' : ''
                      }`}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-white">
                        I agree to the Quantum Terms & Conditions
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        By creating an account, you agree to our quantum protocols
                      </p>
                    </div>
                    {getFieldStatus('terms') === 'error' && (
                      <div className="ml-2 w-3 h-3 bg-neon-pink rounded-full animate-ping"></div>
                    )}
                  </label>
                  {errors.terms && (touched.terms || showAllErrors) && (
                    <div className="error-text mt-2">
                      <AlertCircle className="w-4 h-4 text-neon-pink" />
                      <span className="text-sm text-neon-pink">{errors.terms}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button - ALWAYS ENABLED */}
            <div className="submit-section">
              <button
                type="submit"
                className={`quantum-button ${errorCount > 0 ? 'has-errors' : ''}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="quantum-spinner" />
                    <span className="text-white">PROCESSING REGISTRATION...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-white">
                      {errorCount > 0 ? `SUBMIT WITH ${errorCount} ERROR${errorCount !== 1 ? 'S' : ''}` : 'CREATE QUANTUM ACCOUNT'}
                    </span>
                    {errorCount > 0 && (
                      <div className="w-3 h-3 bg-neon-pink rounded-full animate-ping"></div>
                    )}
                  </div>
                )}
              </button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-400">
                  Already have a quantum profile?{' '}
                  <a href="#" className="text-neon-blue hover:text-neon-purple font-semibold transition-colors">
                    ACCESS QUANTUM PORTAL
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;