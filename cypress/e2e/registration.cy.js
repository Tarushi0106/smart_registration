describe('Intelligent Registration System', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  describe('Flow A - Negative Scenario', () => {
    it('should show error when last name is missing', () => {
      // Step 1: Print Page URL + Page Title
      cy.url().then((url) => {
        cy.log('Page URL:', url);
      });
      cy.title().then((title) => {
        cy.log('Page Title:', title);
      });

      // Step 2: Fill form with missing last name
      cy.get('#firstName').type('John');
      // Last Name skipped intentionally
      cy.get('#email').type('john.doe@example.com');
      cy.get('#phone').type('1234567890');
      cy.get('input[name="gender"][value="male"]').check();
      cy.get('#age').type('25');
      cy.get('#address').type('123 Main Street');
      cy.get('#country').select('us');
      cy.get('#state').should('not.be.disabled');
      cy.get('#state').select('california');
      cy.get('#city').should('not.be.disabled');
      cy.get('#city').select('los_angeles');
      cy.get('#password').type('StrongPass123!');
      cy.get('#confirmPassword').type('StrongPass123!');
      cy.get('#terms').check();

      // Step 3: Click Submit
      cy.get('#submitBtn').click();

      // Step 4: Validate error messages
      cy.get('#lastNameError')
        .should('be.visible')
        .and('contain.text', 'Last name is required');
      
      cy.get('#lastName')
        .should('have.class', 'error');

      // Step 5: Capture screenshot
      cy.screenshot('error-state');
    });
  });

  describe('Flow B - Positive Scenario', () => {
    it('should successfully submit form with all valid fields', () => {
      // Step 1: Fill form with all valid fields
      cy.get('#firstName').type('John');
      cy.get('#lastName').type('Doe');
      cy.get('#email').type('john.doe@example.com');
      cy.get('#phone').type('1234567890');
      cy.get('input[name="gender"][value="male"]').check();
      cy.get('#age').type('25');
      cy.get('#address').type('123 Main Street, Los Angeles, CA');
      cy.get('#country').select('us');
      cy.get('#state').select('california');
      cy.get('#city').select('los_angeles');
      cy.get('#password').type('StrongPass123!');
      cy.get('#confirmPassword').type('StrongPass123!');
      cy.get('#terms').check();

      // Validate password strength
      cy.get('.strength-text')
        .should('contain.text', 'Strong');

      // Step 2: Submit the form
      cy.get('#submitBtn').click();

      // Step 3: Validate success message
      cy.get('.alert.success')
        .should('be.visible')
        .and('contain.text', 'Registration Successful!');

      // Step 4: Validate form reset
      cy.get('#firstName').should('have.value', '');
      cy.get('#lastName').should('have.value', '');
      cy.get('#submitBtn').should('be.disabled');

      // Step 5: Capture screenshot
      cy.screenshot('success-state');
    });
  });

  describe('Flow C - Form Logic Validation', () => {
    it('should validate dynamic dropdown behavior', () => {
      // Test 1: Country → States dropdown update
      cy.get('#country').select('us');
      cy.get('#state').should('not.be.disabled');
      cy.get('#state option').should('have.length.gt', 1);

      // Test 2: State → Cities dropdown update
      cy.get('#state').select('california');
      cy.get('#city').should('not.be.disabled');
      cy.get('#city option').should('have.length.gt', 1);

      // Test 3: Password strength validation
      cy.get('#password').type('weak');
      cy.get('.strength-text')
        .should('contain.text', 'Weak');

      cy.get('#password').clear().type('StrongerPass123!');
      cy.get('.strength-text')
        .should('contain.text', 'Strong');

      // Test 4: Wrong confirm password error
      cy.get('#password').clear().type('Password123!');
      cy.get('#confirmPassword').type('Password123');
      cy.get('#confirmPasswordError')
        .should('be.visible')
        .and('contain.text', 'Passwords do not match');

      // Test 5: Submit button disabled until all valid
      cy.get('#submitBtn').should('be.disabled');

      // Fix the password mismatch
      cy.get('#confirmPassword').clear().type('Password123!');
      cy.get('#confirmPasswordError').should('not.be.visible');

      // Fill other required fields to enable submit
      cy.get('#firstName').type('Test');
      cy.get('#lastName').type('User');
      cy.get('#email').type('test@example.com');
      cy.get('#phone').type('1234567890');
      cy.get('input[name="gender"][value="male"]').check();
      cy.get('#terms').check();

      cy.get('#submitBtn').should('not.be.disabled');
    });
  });

  describe('Additional Validation Tests', () => {
    it('should validate email domain restrictions', () => {
      cy.get('#email').type('test@tempmail.com');
      cy.get('#email').blur();
      cy.get('#emailError')
        .should('be.visible')
        .and('contain.text', 'Disposable email addresses are not allowed');
    });

    it('should validate phone number format', () => {
      cy.get('#phone').type('123');
      cy.get('#phone').blur();
      cy.get('#phoneError')
        .should('be.visible')
        .and('contain.text', 'Please enter a valid 10-digit phone number');
    });

    it('should validate required fields highlighting', () => {
      // Try to submit empty form
      cy.get('#submitBtn').should('be.disabled');

      // Fill and clear to trigger errors
      cy.get('#firstName').type('test').clear().blur();
      cy.get('#firstNameError')
        .should('be.visible')
        .and('contain.text', 'First name is required');
      
      cy.get('#firstName').should('have.class', 'error');
    });
  });
});