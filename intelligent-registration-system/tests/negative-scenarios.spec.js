import { test, expect } from '@playwright/test';
import { TestData } from './test-data';

test.describe('Negative Scenarios - Form Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Missing Last Name - Should show error', async ({ page }) => {
    console.log('🧪 Testing: Missing Last Name Validation');
    
    // Fill all fields except last name
    await page.fill(TestData.selectors.firstName, TestData.validUser.firstName);
    // 🚨 Intentionally skip last name
    await page.fill(TestData.selectors.email, TestData.validUser.email);
    await page.fill(TestData.selectors.phone, TestData.validUser.phone);
    await page.fill(TestData.selectors.password, TestData.validUser.password);
    await page.fill(TestData.selectors.confirmPassword, TestData.validUser.confirmPassword);
    await page.click(TestData.selectors.gender('Male'));
    await page.click(TestData.selectors.terms);
    
    // Submit form
    await page.click(TestData.selectors.submit);
    await page.waitForTimeout(1000);
    
    // Verify last name error
    const lastNameError = await page.locator('body').textContent();
    expect(lastNameError).toMatch(/last name|Last name|required|missing/i);
    
    await page.screenshot({ path: 'missing-last-name.png' });
    console.log('✅ Missing Last Name test completed');
  });

  test('Missing Email - Should show error', async ({ page }) => {
    console.log('🧪 Testing: Missing Email Validation');
    
    // Fill all fields except email
    await page.fill(TestData.selectors.firstName, TestData.validUser.firstName);
    await page.fill(TestData.selectors.lastName, TestData.validUser.lastName);
    // 🚨 Intentionally skip email
    await page.fill(TestData.selectors.phone, TestData.validUser.phone);
    await page.fill(TestData.selectors.password, TestData.validUser.password);
    await page.fill(TestData.selectors.confirmPassword, TestData.validUser.confirmPassword);
    await page.click(TestData.selectors.gender('Male'));
    await page.click(TestData.selectors.terms);
    
    await page.click(TestData.selectors.submit);
    await page.waitForTimeout(1000);
    
    // Verify email error
    const emailError = await page.locator('body').textContent();
    expect(emailError).toMatch(/email|Email|required|missing/i);
    
    await page.screenshot({ path: 'missing-email.png' });
    console.log('✅ Missing Email test completed');
  });

  test('Password Mismatch - Should show error', async ({ page }) => {
    console.log('🧪 Testing: Password Mismatch Validation');
    
    // Fill all fields with mismatched passwords
    await page.fill(TestData.selectors.firstName, TestData.validUser.firstName);
    await page.fill(TestData.selectors.lastName, TestData.validUser.lastName);
    await page.fill(TestData.selectors.email, TestData.validUser.email);
    await page.fill(TestData.selectors.phone, TestData.validUser.phone);
    await page.fill(TestData.selectors.password, TestData.validUser.password);
    await page.fill(TestData.selectors.confirmPassword, TestData.invalid.mismatchedPassword); // 🚨 Mismatch
    await page.click(TestData.selectors.gender('Male'));
    await page.click(TestData.selectors.terms);
    
    await page.click(TestData.selectors.submit);
    await page.waitForTimeout(1000);
    
    // Verify password mismatch error
    const passwordError = await page.locator('body').textContent();
    expect(passwordError).toMatch(/match|mismatch|different|confirm/i);
    
    await page.screenshot({ path: 'password-mismatch.png' });
    console.log('✅ Password Mismatch test completed');
  });

  test('Weak Password - Should show error', async ({ page }) => {
    console.log('🧪 Testing: Weak Password Validation');
    
    await page.fill(TestData.selectors.firstName, TestData.validUser.firstName);
    await page.fill(TestData.selectors.lastName, TestData.validUser.lastName);
    await page.fill(TestData.selectors.email, TestData.validUser.email);
    await page.fill(TestData.selectors.phone, TestData.validUser.phone);
    await page.fill(TestData.selectors.password, TestData.invalid.shortPassword); // 🚨 Weak password
    await page.fill(TestData.selectors.confirmPassword, TestData.invalid.shortPassword);
    await page.click(TestData.selectors.gender('Male'));
    await page.click(TestData.selectors.terms);
    
    await page.click(TestData.selectors.submit);
    await page.waitForTimeout(1000);
    
    // Verify weak password error
    const weakPasswordError = await page.locator('body').textContent();
    expect(weakPasswordError).toMatch(/weak|strong|length|characters/i);
    
    await page.screenshot({ path: 'weak-password.png' });
    console.log('✅ Weak Password test completed');
  });

  test('Missing Terms Acceptance - Should show error', async ({ page }) => {
    console.log('🧪 Testing: Terms Acceptance Validation');
    
    // Fill all fields but don't accept terms
    await page.fill(TestData.selectors.firstName, TestData.validUser.firstName);
    await page.fill(TestData.selectors.lastName, TestData.validUser.lastName);
    await page.fill(TestData.selectors.email, TestData.validUser.email);
    await page.fill(TestData.selectors.phone, TestData.validUser.phone);
    await page.fill(TestData.selectors.password, TestData.validUser.password);
    await page.fill(TestData.selectors.confirmPassword, TestData.validUser.confirmPassword);
    await page.click(TestData.selectors.gender('Male'));
    // 🚨 Intentionally skip terms acceptance
    
    await page.click(TestData.selectors.submit);
    await page.waitForTimeout(1000);
    
    // Verify terms error
    const termsError = await page.locator('body').textContent();
    expect(termsError).toMatch(/terms|conditions|accept|agree/i);
    
    await page.screenshot({ path: 'missing-terms.png' });
    console.log('✅ Missing Terms test completed');
  });
});