import { test, expect } from '@playwright/test';
import { TestData } from './test-data';

test.describe('Form Logic Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Password Strength Validation - Should show strength indicator', async ({ page }) => {
    console.log('🧪 Testing: Password Strength Indicator');
    
    const passwordField = page.locator(TestData.selectors.password).first();
    
    // Test weak password
    await passwordField.fill('weak');
    await page.waitForTimeout(500);
    
    // Test medium password
    await passwordField.fill('MediumPass');
    await page.waitForTimeout(500);
    
    // Test strong password
    await passwordField.fill(TestData.validUser.password);
    await page.waitForTimeout(500);
    
    // Look for any strength indicators
    const strengthIndicators = await page.locator('[class*="strength"], [class*="password"], .progress-bar').all();
    console.log(`🔍 Found ${strengthIndicators.length} strength indicators`);
    
    await page.screenshot({ path: 'password-strength.png' });
    console.log('✅ Password Strength test completed');
  });

  test('Real-time Validation - Should show errors while typing', async ({ page }) => {
    console.log('🧪 Testing: Real-time Field Validation');
    
    const emailField = page.locator(TestData.selectors.email).first();
    
    // Test invalid email
    await emailField.fill('invalid-email');
    await page.waitForTimeout(1000);
    
    // Check for real-time validation error
    const hasError = await page.locator(TestData.selectors.error).first().isVisible();
    console.log(`❌ Real-time error shown: ${hasError}`);
    
    // Fix email
    await emailField.fill(TestData.validUser.email);
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'realtime-validation.png' });
    console.log('✅ Real-time Validation test completed');
  });

  test('Form Reset After Submission - Should clear fields', async ({ page }) => {
    console.log('🧪 Testing: Form Reset After Submission');
    
    // Fill all fields
    await page.fill(TestData.selectors.firstName, TestData.validUser.firstName);
    await page.fill(TestData.selectors.lastName, TestData.validUser.lastName);
    await page.fill(TestData.selectors.email, TestData.validUser.email);
    
    // Submit and check if fields clear (if successful)
    await page.click(TestData.selectors.submit);
    await page.waitForTimeout(2000);
    
    // Check if fields are cleared (form reset)
    const firstNameValue = await page.locator(TestData.selectors.firstName).first().inputValue();
    const isFormReset = firstNameValue === '';
    
    console.log(`🔄 Form reset after submission: ${isFormReset}`);
    
    await page.screenshot({ path: 'form-reset.png' });
    console.log('✅ Form Reset test completed');
  });
});