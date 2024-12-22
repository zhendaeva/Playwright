import { test } from '@playwright/test';
import { AppointmentPage } from "../pages/appointment-page";

test('UI overview - Move Appointment', async ({ page }) => {
  const appointmenPage = new AppointmentPage(page);

  await page.goto('/');
  await appointmenPage.checkAppointmentList(page);
});

test('Move Appointment', async ({ page }) => {
  const appointmenPage = new AppointmentPage(page);

  await page.goto('/');
  await appointmenPage.tapRescheduleButton();
  const selectedOptionData = await appointmenPage.getAppointmentOptionData()
  await appointmenPage.secondRescheduleButtonOption.click()
  await appointmenPage.checkSelectedOptionIsApplied(selectedOptionData)
});
