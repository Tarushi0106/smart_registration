describe('Intelligent Registration System', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  describe('Flow A - Negative Scenario', () => {
    it('should show error when last name is missing', () => {
     
      cy.url().then((url) => {
        cy.log('Page URL:', url);
      });
      cy.title().then((title) => {
        cy.log('Page Title:', title);
      });

      
      cy.get('#firstName').type('John');
     
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

      
      cy.get('#submitBtn').click();

    
      cy.get('#lastNameError')
        .should('be.visible')
        .and('contain.text', 'Last name is required');
      
      cy.get('#lastName')
        .should('have.class', 'error');

     
      cy.screenshot('error-state');
    });
  });

  describe('Flow B - Positive Scenario', () => {
    it('should successfully submit form with all valid fields', () => {
    
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

      
      cy.get('.strength-text')
        .should('contain.text', 'Strong');

     
      cy.get('#submitBtn').click();

   
      cy.get('.alert.success')
        .should('be.visible')
        .and('contain.text', 'Registration Successful!');

    
      cy.get('#firstName').should('have.value', '');
      cy.get('#lastName').should('have.value', '');
      cy.get('#submitBtn').should('be.disabled');

    
      cy.screenshot('success-state');
    });
  });

  describe('Flow C - Form Logic Validation', () => {
    it('should validate dynamic dropdown behavior', () => {
    
      cy.get('#country').select('us');
      cy.get('#state').should('not.be.disabled');
      cy.get('#state option').should('have.length.gt', 1);

  
      cy.get('#state').select('california');
      cy.get('#city').should('not.be.disabled');
      cy.get('#city option').should('have.length.gt', 1);


      cy.get('#password').type('weak');
      cy.get('.strength-text')
        .should('contain.text', 'Weak');

      cy.get('#password').clear().type('StrongerPass123!');
      cy.get('.strength-text')
        .should('contain.text', 'Strong');

      cy.get('#password').clear().type('Password123!');
      cy.get('#confirmPassword').type('Password123');
      cy.get('#confirmPasswordError')
        .should('be.visible')
        .and('contain.text', 'Passwords do not match');

 
      cy.get('#submitBtn').should('be.disabled');

      cy.get('#confirmPassword').clear().type('Password123!');
      cy.get('#confirmPasswordError').should('not.be.visible');

   
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
    
      cy.get('#submitBtn').should('be.disabled');

      cy.get('#firstName').type('test').clear().blur();
      cy.get('#firstNameError')
        .should('be.visible')
        .and('contain.text', 'First name is required');
      
      cy.get('#firstName').should('have.class', 'error');
    });
  });
});