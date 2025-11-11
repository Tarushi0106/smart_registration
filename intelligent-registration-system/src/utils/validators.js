export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', 'mailinator.com',
      '10minutemail.com', 'throwawaymail.com', 'fakeinbox.com'
    ];
    
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) {
      return 'Disposable email addresses are not allowed';
    }
    
    return '';
  },

  phone: (phone, country) => {
    const phoneRegex = {
      'US': /^\+1\d{10}$/,
      'UK': /^\+44\d{10}$/,
      'IN': /^\+91\d{10}$/,
      'CA': /^\+1\d{10}$/,
      'AU': /^\+61\d{9}$/,
    };

    if (!phone) return 'Phone number is required';
    
    if (country && phoneRegex[country]) {
      if (!phoneRegex[country].test(phone)) {
        return `Please enter a valid ${country} phone number with country code`;
      }
    }
    
    const internationalRegex = /^\+\d{1,3}\d{4,14}$/;
    if (!internationalRegex.test(phone)) {
      return 'Please enter a valid international phone number with country code';
    }
    
    return '';
  },

  password: (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    
    return '';
  },

  confirmPassword: (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  },

  required: (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return '';
  },

  age: (age) => {
    if (age && (age < 1 || age > 120)) {
      return 'Please enter a valid age between 1 and 120';
    }
    return '';
  }
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 'Weak', score: 0, color: 'bg-red-500' };
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  if (score >= 6) return { strength: 'Strong', score, color: 'bg-green-500' };
  if (score >= 4) return { strength: 'Medium', score, color: 'bg-yellow-500' };
  return { strength: 'Weak', score, color: 'bg-red-500' };
};

export const countries = [
  { code: 'US', name: 'United States', states: ['California', 'New York', 'Texas', 'Florida'] },
  { code: 'UK', name: 'United Kingdom', states: ['England', 'Scotland', 'Wales', 'Northern Ireland'] },
  { code: 'IN', name: 'India', states: ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu'] },
  { code: 'CA', name: 'Canada', states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'] },
  { code: 'AU', name: 'Australia', states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'] },
];

export const cities = {
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
  'England': ['London', 'Manchester', 'Birmingham', 'Liverpool'],
  'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
  'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton'],
  'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
  'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast'],
  'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
};