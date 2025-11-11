import { test, expect } from '@playwright/test';

test.describe('Intelligent Registration System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Flow A - Negative Scenario: Missing Last Name', async ({ page }) => {
    // Step 1 & 2: Print Page URL + Title
    console.log('Page URL:', page.url());
    console.log('Page Title:', await page.title());

    // Step 3: Fill form with missing last name
    await page.fill('input[placeholder="Enter your first name"]', 'John');
    await page.fill('input[placeholder="your@email.com"]', 'john.doe@example.com');
    await page.fill('input[placeholder="+1234567890"]', '+1234567890');
    await page.click('input[type="radio"][value="Male"]');
    
    // Fill other required fields
    await page.fill('input[placeholder="Create a strong password"]', 'StrongPass123!');
    await page.fill('input[placeholder="Confirm your password"]', 'StrongPass123!');
    
    // Select country to enable state dropdown
    await page.selectOption('select', { label: 'United States' });
    await page.selectOption('select:nth-of-type(2)', { label: 'California' });
    await page.selectOption('select:nth-of-type(3)', { label: 'Los Angeles' });
    
    // Accept terms
    await page.click('input[type="checkbox"]');

    // Step 4: Click Submit
    await page.click('button[type="submit"]');

    // Step 5: Validate error for missing last name
    const lastNameError = await page.locator('text=Last Name is required');
    await expect(lastNameError).toBeVisible();

    // Check if error field is highlighted
    const lastNameInput = page.locator('input[placeholder="Enter your last name"]');
    await expect(lastNameInput).toHaveCSS('border-color', 'rgb(239, 68, 68)'); // red-500

    // Step 6: Capture screenshot
    await page.screenshot({ path: 'error-state.png', fullPage: true });
    console.log('Screenshot saved: error-state.png');
  });

  test('Flow B - Positive Scenario: Successful Registration', async ({ page }) => {
    // Step 1: Refill form with all valid fields
    await page.fill('input[placeholder="Enter your first name"]', 'John');
    await page.fill('input[placeholder="Enter your last name"]', 'Doe');
    await page.fill('input[placeholder="your@email.com"]', 'john.doe@example.com');
    await page.fill('input[placeholder="+1234567890"]', '+1234567890');
    await page.fill('input[placeholder="Enter your age"]', '30');
    await page.click('input[type="radio"][value="Male"]');
    await page.fill('textarea[placeholder="Enter your full address"]', '123 Main St, Los Angeles, CA');
    
    // Select location
    await page.selectOption('select', { label: 'United States' });
    await page.selectOption('select:nth-of-type(2)', { label: 'California' });
    await page.selectOption('select:nth-of-type(3)', { label: 'Los Angeles' });
    
    // Step 2: Fill matching passwords
    await page.fill('input[placeholder="Create a strong password"]', 'StrongPass123!');
    await page.fill('input[placeholder="Confirm your password"]', 'StrongPass123!');
    
    // Step 3: Ensure terms is checked
    await page.click('input[type="checkbox"]');

    // Step 4: Submit the form
    await page.click('button[type="submit"]');

    // Step 5: Validate success message and form reset
    const successMessage = await page.locator('text=Registration Successful!');
    await expect(successMessage).toBeVisible({ timeout: 10000 });

    // Check if form fields are reset
    await expect(page.locator('input[placeholder="Enter your first name"]')).toHaveValue('');
    await expect(page.locator('input[placeholder="Enter your last name"]')).toHaveValue('');

    // Step 6: Capture screenshot
    await page.screenshot({ path: 'success-state.png', fullPage: true });
    console.log('Screenshot saved: success-state.png');
  });

  test('Flow C - Form Logic Validation', async ({ page }) => {
    // Step 1: Change Country → States dropdown should update
    await page.selectOption('select', { label: 'India' });
    
    // Verify states dropdown updated
    const statesDropdown = page.locator('select:nth-of-type(2)');
    await expect(statesDropdown).not.toBeDisabled();
    
    const stateOptions = await statesDropdown.locator('option');
    const stateCount = await stateOptions.count();
    expect(stateCount).toBeGreaterThan(1); // Should have states options

    // Step 2: Change State → Cities dropdown should update
    await page.selectOption('select:nth-of-type(2)', { label: 'Maharashtra' });
    
    // Verify cities dropdown updated
    const citiesDropdown = page.locator('select:nth-of-type(3)');
    await expect(citiesDropdown).not.toBeDisabled();
    
    const cityOptions = await citiesDropdown.locator('option');
    const cityCount = await cityOptions.count();
    expect(cityCount).toBeGreaterThan(1); // Should have cities options

    // Step 3: Password strength validation
    const passwordInput = page.locator('input[placeholder="Create a strong password"]');
    
    // Test weak password
    await passwordInput.fill('weak');
    const weakStrength = await page.locator('text=Password Strength: Weak');
    await expect(weakStrength).toBeVisible();

    // Test medium password
    await passwordInput.fill('MediumPass123');
    const mediumStrength = await page.locator('text=Password Strength: Medium');
    await expect(mediumStrength).toBeVisible();

    // Test strong password
    await passwordInput.fill('StrongPass123!');
    const strongStrength = await page.locator('text=Password Strength: Strong');
    await expect(strongStrength).toBeVisible();

    // Step 4: Test wrong confirm password
    const confirmPasswordInput = page.locator('input[placeholder="Confirm your password"]');
    await confirmPasswordInput.fill('DifferentPass123!');
    
    // Trigger validation
    await confirmPasswordInput.blur();
    
    const passwordMismatchError = await page.locator('text=Passwords do not match');
    await expect(passwordMismatchError).toBeVisible();

    // Step 5: Disable submit button until all fields are valid
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();

    // Fill all required fields correctly
    await page.fill('input[placeholder="Enter your first name"]', 'John');
    await page.fill('input[placeholder="Enter your last name"]', 'Doe');
    await page.fill('input[placeholder="your@email.com"]', 'john.doe@example.com');
    await page.fill('input[placeholder="+1234567890"]', '+1234567890');
    await page.click('input[type="radio"][value="Male"]');
    await page.click('input[type="checkbox"]');
    
    // Fix confirm password
    await confirmPasswordInput.fill('StrongPass123!');

    // Now submit button should be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('Email Validation - Disposable Domains', async ({ page }) => {
    // Test with disposable email
    await page.fill('input[placeholder="your@email.com"]', 'test@tempmail.com');
    await page.locator('input[placeholder="your@email.com"]').blur();
    
    const disposableError = await page.locator('text=Disposable email addresses are not allowed');
    await expect(disposableError).toBeVisible();
  });

  test('Phone Validation - Country Specific', async ({ page }) => {
    // Select country first
    await page.selectOption('select', { label: 'United States' });
    
    // Test invalid US phone format
    await page.fill('input[placeholder="+1234567890"]', '1234567890'); // Missing country code
    await page.locator('input[placeholder="+1234567890"]').blur();
    
    const phoneError = await page.locator('text=Please enter a valid United States phone number');
    await expect(phoneError).toBeVisible();
  });
});