# Automation Script Guide

## Overview
This document explains how the Cypress automation script works for testing the intelligent registration system. The script automates form submission testing and validation error checking.

## Script Location
- **File**: `cypress/e2e/registration.spec.js`
- **Framework**: Cypress 12.17.0
- **Browser**: Electron (headless mode for CI/CD)

---

## How the Automation Script Works

### Step 1: Test Suite Initialization
```javascript
describe('Registration form', () => {
```
- Creates a test suite named "Registration form"
- Groups all related tests together
- All tests inside this block belong to this suite

---

### Step 2: Test Case 1 - Successful Form Submission

#### 2.1 Setup Intercept
```javascript
cy.intercept('POST', '/api/register', {
  statusCode: 200,
  body: { success: true, message: 'Registration Successful!' }
}).as('register');
```
**What it does:**
- Intercepts the HTTP POST request to `/api/register`
- Mocks the server response to always return success
- Tags this intercept as `@register` for later reference
- **Why**: Prevents actual server calls; ensures predictable test results

#### 2.2 Visit Application
```javascript
cy.visit('/');
```
**What it does:**
- Navigates to the base URL (`http://localhost:5173` from cypress.config.js)
- Loads the registration form in the browser
- Waits for the page to fully load

#### 2.3 Fill Form Fields
```javascript
cy.get('#firstName').type('Test');
cy.get('#lastName').type('User');
cy.get('#email').type('test.user@example.com');
cy.get('#phone').type('+1234567890');
cy.get('#password').type('strongpassword');
cy.get('#confirmPassword').type('strongpassword');
```
**What it does:**
- `cy.get()` finds DOM elements by CSS selector
- `.type()` simulates user typing into input fields
- Fills all required form fields with valid test data
- **Order matters**: Fields populate in the order listed

#### 2.4 Check Terms Checkbox
```javascript
cy.get('#terms').check({ force: true });
```
**What it does:**
- `.check()` ticks the checkbox
- `{ force: true }` option: Forces the check even if the checkbox is hidden
- **Why needed**: The terms checkbox uses custom CSS styling, so it's visually hidden
- **Result**: Terms & Conditions checkbox is marked as accepted

#### 2.5 Submit Form
```javascript
cy.get('#submitBtn').click();
```
**What it does:**
- Finds the submit button by its ID
- Simulates a click event
- Triggers form submission

#### 2.6 Wait for Network Call
```javascript
cy.wait('@register');
```
**What it does:**
- Waits for the intercepted POST request to `/api/register` to complete
- Uses the `@register` alias defined earlier
- Prevents test from continuing until server responds (or mock responds)
- **Timeout**: Default 5 seconds

#### 2.7 Verify Success Alert
```javascript
cy.get('#successAlert', { timeout: 5000 }).should('be.visible');
cy.get('#successAlert').contains('Registration Successful').should('exist');
```
**What it does:**
- Waits up to 5 seconds for the success alert to appear
- Checks that the alert is visible on the page
- Verifies the alert text contains "Registration Successful"
- **Result**: Test passes if both conditions are true

---

### Step 3: Test Case 2 - Validation Error Handling

#### 3.1 Visit Form (Fresh Instance)
```javascript
cy.visit('/');
```
**What it does:**
- Reloads the form page
- Creates a clean form state for this new test

#### 3.2 Clear All Fields
```javascript
cy.get('#firstName').clear();
cy.get('#lastName').clear();
cy.get('#email').clear();
cy.get('#phone').clear();
cy.get('#password').clear();
cy.get('#confirmPassword').clear();
cy.get('#terms').uncheck({ force: true });
```
**What it does:**
- `.clear()` removes any content from input fields
- `.uncheck()` unchecks the terms checkbox
- Ensures form is completely empty (invalid state)
- **Purpose**: Tests that validation catches missing required fields

#### 3.3 Submit Empty Form
```javascript
cy.get('#submitBtn').click();
```
**What it does:**
- Attempts to submit the form with all fields empty
- Triggers client-side validation

#### 3.4 Verify Individual Field Errors
```javascript
cy.get('#firstNameError', { timeout: 5000 }).should('be.visible');
cy.get('#emailError', { timeout: 5000 }).should('be.visible');
cy.get('#passwordError', { timeout: 5000 }).should('be.visible');
```
**What it does:**
- Checks that error message elements appear for specific fields
- Waits up to 5 seconds for each error to display
- Verifies form validation is working correctly
- **Result**: Test passes if all three error messages are visible

---

## Running the Automation Script

### Option 1: Run in Headless Mode (CI/CD)
```bash
npm run cy:run
```
**Process:**
1. Starts static server (`http-server` on port 5173)
2. Waits for server to respond with HTTP 200
3. Runs Cypress tests headless (no UI window)
4. Closes server automatically after tests complete
5. Reports results (pass/fail counts)

### Option 2: Run in Interactive Mode (Development)
```bash
npm run cypress:open
```
**Process:**
1. Opens Cypress Test Runner UI
2. Shows all test files
3. Click a test file to run it
4. Watch tests execute in real-time
5. See detailed logs and network requests

### Option 3: Run Only Regression Suite
```bash
npm run cypress:run
```
**Process:**
1. Assumes server is already running
2. Runs all tests in `cypress/e2e/**/*.spec.js`
3. Reports results to console

---

## Test Execution Flow Diagram

```
Start
  ↓
Test Suite: "Registration form"
  ├─ Test 1: "submits successfully with valid data"
  │   ├─ Mock POST to /api/register
  │   ├─ Load form (cy.visit)
  │   ├─ Fill all fields with valid data
  │   ├─ Check terms checkbox
  │   ├─ Click submit
  │   ├─ Wait for mocked response
  │   ├─ Assert success alert is visible
  │   └─ PASS ✅
  │
  └─ Test 2: "shows validation errors when required fields are missing"
      ├─ Load form (fresh instance)
      ├─ Clear all fields
      ├─ Click submit
      ├─ Assert first name error is visible
      ├─ Assert email error is visible
      ├─ Assert password error is visible
      └─ PASS ✅

End (All tests completed)
```

---

## Key Concepts Explained

### 1. **Selectors (cy.get)**
Cypress uses CSS selectors to find elements:
- `#firstName` → Find element with id="firstName"
- `#successAlert` → Find element with id="successAlert"
- `.error` → Find elements with class="error"

### 2. **Assertions (should)**
Verify that conditions are true:
- `.should('be.visible')` → Element is visible on screen
- `.should('exist')` → Element exists in DOM
- `.contains('text')` → Element text contains "text"

### 3. **Timeout Handling**
```javascript
cy.get('#element', { timeout: 5000 }).should('be.visible');
```
- Waits up to 5000ms (5 seconds) for the element to appear
- Retries every 50ms
- Fails if element doesn't appear within timeout

### 4. **Intercepting (cy.intercept)**
```javascript
cy.intercept('POST', '/api/register', { statusCode: 200, ... }).as('register');
```
- Catches network requests matching the pattern
- Can mock responses
- Aliases the intercept with `@register`
- Used for: Testing without real backend, controlling responses

---

## Expected Test Results

### Successful Run
```
Running: registration.spec.js
  Registration form
    √ submits successfully with valid data (3322ms)
    √ shows validation errors when required fields are missing (1391ms)

  2 passing (5s)
```

### Failed Run (Example)
```
Running: registration.spec.js
  Registration form
    1) submits successfully with valid data
    √ shows validation errors when required fields are missing (1391ms)

  1 passing (5s)
  1 failing:
    1) submits successfully with valid data
       Error: expected element not to be hidden
```

---

## Configuration Details

### Cypress Config File (`cypress.config.js`)
```javascript
{
  baseUrl: 'http://localhost:5173',        // Base URL for all visits
  supportFile: false,                       // No support file needed
  specPattern: 'cypress/e2e/**/*.spec.js', // Test file pattern
  video: false,                             // Don't record videos
  screenshotOnRunFailure: true,            // Capture screenshot on failure
  viewportWidth: 1280,                      // Browser width
  viewportHeight: 720                       // Browser height
}
```

---

## Troubleshooting

### Issue: "Timed out waiting for..."
**Cause:** Element didn't appear within 5 seconds
**Solution:** 
- Increase timeout: `cy.get('#element', { timeout: 10000 })`
- Check if selector is correct
- Verify server is running

### Issue: "element is not attached to the DOM"
**Cause:** DOM changed during test execution
**Solution:**
- Add `.wait()` between actions
- Use `cy.intercept()` to control timing
- Ensure form doesn't refresh unexpectedly

### Issue: "Checkbox cannot be checked"
**Cause:** Checkbox is hidden by CSS
**Solution:**
- Use `{ force: true }` option: `.check({ force: true })`

---

## Best Practices

1. **Use Meaningful Selectors**: Use IDs when available instead of class names
2. **Wait for Network**: Always use `cy.wait('@intercept')` after form submission
3. **Test One Thing**: Each test should verify a single behavior
4. **Clean State**: Reload page between tests to avoid state pollution
5. **Mock External Dependencies**: Use `cy.intercept()` for API calls
6. **Readable Assertions**: Use descriptive `should()` statements

---

## Next Steps

- Add tests for edge cases (invalid email, weak password, etc.)
- Add tests for password strength meter
- Add tests for country/state/city dropdowns
- Integrate with CI/CD pipeline (GitHub Actions, Jenkins, etc.)
- Generate HTML reports for test results
