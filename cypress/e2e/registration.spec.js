describe('Registration form', () => {
  it('submits successfully with valid data', () => {
    cy.intercept('POST', '/api/register', {
      statusCode: 200,
      body: { success: true, message: 'Registration Successful!' }
    }).as('register');

    cy.visit('/');

    cy.get('#firstName').type('Test');
    cy.get('#lastName').type('User');
    cy.get('#email').type('test.user@example.com');
    cy.get('#phone').type('+1234567890');
    cy.get('#password').type('strongpassword');
    cy.get('#confirmPassword').type('strongpassword');
    cy.get('#terms').check({ force: true });

    cy.get('#submitBtn').click();
    cy.wait('@register');

    cy.get('#successAlert', { timeout: 5000 }).should('be.visible');
    cy.get('#successAlert').contains('Registration Successful').should('exist');
  });

  it('shows validation errors when required fields are missing', () => {
    cy.visit('/');

    cy.get('#firstName').clear();
    cy.get('#lastName').clear();
    cy.get('#email').clear();
    cy.get('#phone').clear();
    cy.get('#password').clear();
    cy.get('#confirmPassword').clear();
    cy.get('#terms').uncheck({ force: true });

    cy.get('#submitBtn').click();

    cy.get('#firstNameError', { timeout: 5000 }).should('be.visible');
    cy.get('#emailError', { timeout: 5000 }).should('be.visible');
    cy.get('#passwordError', { timeout: 5000 }).should('be.visible');
  });
});
