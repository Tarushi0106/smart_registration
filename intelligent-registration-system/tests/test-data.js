export const TestData = {
  // Valid user data
  validUser: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
    gender: 'Male'
  },

  // Invalid data scenarios
  invalid: {
    shortPassword: 'weak',
    mismatchedPassword: 'DifferentPass456!',
    invalidEmail: 'invalid-email',
    invalidPhone: 'abc123'
  },

  // Selectors
  selectors: {
    firstName: 'input[placeholder*="first name"], [name*="firstName"], #firstName',
    lastName: 'input[placeholder*="last name"], [name*="lastName"], #lastName',
    email: 'input[type="email"], [name*="email"], #email',
    phone: 'input[type="tel"], [name*="phone"], #phone',
    password: 'input[type="password"], [name*="password"], #password',
    confirmPassword: 'input[placeholder*="confirm"], [name*="confirmPassword"], #confirmPassword',
    gender: (gender) => `input[value="${gender}"], input[type="radio"]`,
    terms: 'input[type="checkbox"]',
    submit: 'button[type="submit"], button:has-text("CREATE"), button:has-text("Register")',
    error: '[class*="error"], .error-text, .text-red, .text-danger',
    success: 'text=success, text=Success, text=registered, text=Welcome'
  }
};