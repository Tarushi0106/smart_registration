describe('Registration form', () => {
  it('submits successfully with valid data', () => {
    // Intercept the backend POST and return a successful response so tests run
    cy.intercept('POST', '/api/register', {
      statusCode: 200,
      body: { success: true, message: 'Registration Successful!' }
    }).as('register');

    // visit base url from cypress config
    cy.visit('/');

    // Fill required fields
    cy.get('#firstName').type('Test');
    cy.get('#lastName').type('User');
    cy.get('#email').type('test.user@example.com');
    cy.get('#phone').type('+1234567890');
    cy.get('#password').type('strongpassword');
    cy.get('#confirmPassword').type('strongpassword');
  // terms checkbox is visually hidden (custom checkmark). Force the check for test.
  cy.get('#terms').check({ force: true });

  // Submit the form
  cy.get('#submitBtn').click();
  // wait for the network call (if triggered)
  cy.wait('@register');

  // Expect success alert to be visible (allow some time for animations)
  cy.get('#successAlert', { timeout: 5000 }).should('be.visible');
  cy.get('#successAlert').contains('Registration Successful').should('exist');
  });

  it('shows validation errors when required fields are missing', () => {
    cy.visit('/');

    // Ensure form is empty
    cy.get('#firstName').clear();
    cy.get('#lastName').clear();
    cy.get('#email').clear();
    cy.get('#phone').clear();
    cy.get('#password').clear();
    cy.get('#confirmPassword').clear();
  cy.get('#terms').uncheck({ force: true });

  // Click submit
  cy.get('#submitBtn').click();

  // Prefer checking individual field error elements — these are shown by the client
  // validation and are more reliable than the top alert in headless runs.
  cy.get('#firstNameError', { timeout: 5000 }).should('be.visible');
  cy.get('#emailError', { timeout: 5000 }).should('be.visible');
  cy.get('#passwordError', { timeout: 5000 }).should('be.visible');
  });
});
