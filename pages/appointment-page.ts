import { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { isEqual } from 'lodash';

export class AppointmentPage {
    page: Page;
    readonly list: Locator;
    readonly headerText: Locator;
    readonly listHeaderText: Locator;
    readonly item: Locator;
    readonly itemDetails: Locator;
    readonly itemDetailsDate: Locator;
    readonly itemDetailsPeriod: Locator;
    readonly itemDetailsTask: Locator;
    readonly technicianDetails: Locator;
    readonly technicianHeaderText: Locator;
    readonly technicianName: Locator;
    readonly technicianAge: Locator;
    readonly technicianSex: Locator;
    readonly rescheduleButton: Locator;
    readonly rescheduleWindow: Locator;
    readonly rescheduleHeaderText: Locator;
    readonly secondRescheduleButtonOption: Locator;

    constructor(page: Page) {
        this.page = page;
        this.list = page.locator('.appointment-list');
        this.headerText = page.getByRole('heading', { name: 'Terminierungsportal' });
        this.listHeaderText = this.list.locator('role=heading[name="Ihr Termin"]');
        this.item = page.locator('.appointment-item');
        this.itemDetails = this.item.locator('.appointment-details');
        this.itemDetailsDate = this.itemDetails.locator('role=heading');
        this.itemDetailsPeriod = this.itemDetails.locator('p >> nth=0');
        this.itemDetailsTask = this.itemDetails.locator('p strong:has-text("Durchzuführende Arbeit:")');
        this.technicianDetails = this.item.locator('.technician-details');
        this.technicianHeaderText = this.technicianDetails.locator('role=heading[name="Ihr Servicetechniker"]');
        this.technicianName = this.technicianDetails.locator('p strong:has-text("Name::")');
        this.technicianAge = this.technicianDetails.locator('p strong:has-text("Alter:")');
        this.technicianSex = this.technicianDetails.locator('p strong:has-text("Geschlecht:")');
        this.rescheduleButton = page.locator('.btn-reschedule');

        // reschedule window
        this.rescheduleWindow = page.locator('.reschedule-options');
        this.rescheduleHeaderText = this.rescheduleWindow.locator('role=heading[name="Wählen sie ihren Wunschtermin:"]');
        this.secondRescheduleButtonOption = this.rescheduleWindow.locator('.btn-option >> nth=1');
    }

    async checkAppointmentList(page: Page) {
        await expect(this.headerText).toBeVisible();
        await expect(this.listHeaderText).toBeVisible();
        await this.checkAppointmentDate(this.itemDetailsDate);
        await this.checkTimeRange(this.itemDetailsPeriod);
        await expect(this.itemDetailsTask).toBeVisible()
        await expect(this.technicianHeaderText).toBeVisible()
        await expect(this.rescheduleButton).toBeVisible()
      }

    async checkAppointmentDate(date: Locator) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const dateText = await date.textContent();

        if (dateRegex.test(dateText || '')) {
            console.log("Text matches the date format YYYY-MM-DD");
        } else {
            console.log("Text doesn't matches the date format");
        }
    }

    async checkTimeRange(period: Locator) {
        const regex = /Zeitraum: \d{2}:\d{2} - \d{2}:\d{2}/;
        const periodText = await period.textContent();
        
        expect(periodText!.trim()).toMatch(regex);
      }

    async tapRescheduleButton() {
        await this.rescheduleButton.click()
        await expect(this.rescheduleHeaderText).toBeVisible()
    }

    async getAppointmentOptionData() {
        const textContent = await this.secondRescheduleButtonOption.textContent();
        if (textContent === null) {
            throw new Error("Failed to get text content from reschedule button option.");
        }
        const appointmentData = extractAppointmentDataFromText(textContent);
        await expect(this.listHeaderText).toBeVisible() 
        return appointmentData
    }

    async checkSelectedOptionIsApplied(data: any) {
        const textContent = await this.item.textContent()
        if (textContent === null) {
            throw new Error("Failed to get text content from appointment info.");
        }
        const appliedOptionText = extractAppointmentDataFromText(textContent);
        expect (isEqual(appliedOptionText, data)).toBeTruthy();
    }
}

function extractAppointmentDataFromText(text: string) {
    const currentAppointmentRegex = /(?<date>\d{4}-\d{2}-\d{2})Zeitraum: (?<startTime>\d{2}:\d{2}) - (?<endTime>\d{2}:\d{2}).*?Name: (?<name>[A-Za-z\s]+)Alter: (?<age>\d+).*?Geschlecht: (?<gender>Male|Female|Non-binary)/;
    const optionRegex = /(?<date>\d{4}-\d{2}-\d{2}) (?<startTime>\d{2}:\d{2}) - (?<endTime>\d{2}:\d{2})\s+Techniker: (?<name>[A-Za-z\s]+) \((?<age>\d+)\sJahre alt, (?<gender>Male|Female)\)/;
    const match = text.match(currentAppointmentRegex) ?? text.match(optionRegex);
    if (match && match.groups) {
      return {
        date: match.groups.date,
        startTime: match.groups.startTime,
        endTime: match.groups.endTime,
        name: match.groups.name,
        age: Number(match.groups.age),
        gender: match.groups.gender
    }
    } else {
        throw new Error("Failed to get appointment data from the text.");
    }
}

