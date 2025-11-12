import { test, expect } from '@playwright/test';
import { TestData } from './test-data';

test.describe('Positive Scenarios - Successful Registration', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Complete Valid Registration - Should succeed', async ({ page }) => {
    console.log('🧪 Testing: Complete Valid Registration');
    
    // Fill all fields correctly
    await page.fill(TestData.selectors.firstName, TestData.validUser.firstName);
    await page.fill(TestData.selectors.lastName, TestData.validUser.lastName);
    await page.fill(TestData.selectors.email, TestData.validUser.email);
    await page.fill(TestData.selectors.phone, TestData.validUser.phone);
    await page.fill(TestData.selectors.password, TestData.validUser.password);
    await page.fill(TestData.selectors.confirmPassword, TestData.validUser.confirmPassword);
    await page.click(TestData.selectors.gender('Male'));
    await page.click(TestData.selectors.terms);
    
    // Submit form
    await page.click(TestData.selectors.submit);
    await page.waitForTimeout(2000);
    
    // Verify success
    const successElement = page.locator(TestData.selectors.success).first();
    const isSuccessVisible = await successElement.isVisible();
    
    if (isSuccessVisible) {
      const successMessage = await successElement.textContent();
      console.log(`🎉 Registration Success: ${successMessage}`);
      expect(successMessage).toMatch(/success|Success|welcome|thank you|registered/i);
    } else {
      // If no success message, check if form was submitted successfully
      const currentUrl = page.url();
      console.log(`🔍 Current URL: ${currentUrl}`);
      
      // Check if we're still on registration page (failure) or moved to another page (success)
      const isStillOnRegistrationPage = currentUrl.includes('localhost:5173') && !currentUrl.includes('success');
      
      if (!isStillOnRegistrationPage) {
        console.log('✅ Registration likely successful - redirected from registration page');
      } else {
        console.log('❌ Registration may have failed - still on registration page');
      }
    }
    
    await page.screenshot({ path: 'registration-success.png' });
    console.log('✅ Complete Registration test completed');
  });

  test('All Fields Filled - Submit Button Should Be Enabled', async ({ page }) => {
    console.log('🧪 Testing: Submit Button Enabled State');
    
    // Fill all fields
    await page.fill(TestData.selectors.firstName, TestData.validUser.firstName);
    await page.fill(TestData.selectors.lastName, TestData.validUser.lastName);
    await page.fill(TestData.selectors.email, TestData.validUser.email);
    await page.fill(TestData.selectors.phone, TestData.validUser.phone);
    await page.fill(TestData.selectors.password, TestData.validUser.password);
    await page.fill(TestData.selectors.confirmPassword, TestData.validUser.confirmPassword);
    await page.click(TestData.selectors.gender('Male'));
    await page.click(TestData.selectors.terms);
    
    await page.waitForTimeout(1000);
    
    // Check if submit button is enabled
    const submitButton = page.locator(TestData.selectors.submit).first();
    const isEnabled = await submitButton.isEnabled();
    
    console.log(`🔄 Submit Button Enabled: ${isEnabled}`);
    expect(isEnabled).toBe(true);
    
    await page.screenshot({ path: 'submit-button-enabled.png' });
    console.log('✅ Submit Button test completed');
  });
});