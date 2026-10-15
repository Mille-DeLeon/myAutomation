import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { When, Then } from './fixtures';

/* Pause between each key press (in ms) so you can watch the typing. */
const TYPING_DELAY = 100;

/* Each value is kept within the field's maxlength on the page. */
When('I enter a random name', async ({ page, formData }) => {
  /* First, middle and last name together must fit in 15 characters, so keep picking until they do. */
  do {
    formData.name = `${faker.person.firstName()} ${faker.person.middleName()} ${faker.person.lastName()}`;
  } while (formData.name.length > 15);
  // await page.locator('#name').fill(formData.name);
  await page.locator('#name').pressSequentially(formData.name, { delay: TYPING_DELAY });
});

When('I enter a random email', async ({ page, formData }) => {
  const user = faker.person.firstName().toLowerCase().replace(/[^a-z]/g, '').slice(0, 10);
  formData.email = `${user}${faker.string.numeric(3)}@test.com`;
  // await page.locator('#email').fill(formData.email);
  await page.locator('#email').pressSequentially(formData.email, { delay: TYPING_DELAY });
});

When('I enter a random phone number', async ({ page, formData }) => {
  formData.phone = faker.string.numeric({ length: 10, allowLeadingZeros: false });
  // await page.locator('#phone').fill(formData.phone);
  await page.locator('#phone').pressSequentially(formData.phone, { delay: TYPING_DELAY });
});

When('I enter a random address', async ({ page, formData }) => {
  formData.address = faker.location.streetAddress();
  // await page.locator('#textarea').fill(formData.address);
  await page.locator('#textarea').pressSequentially(formData.address, { delay: TYPING_DELAY });
});

When('I select a gender', async ({ page, formData }) => {
  /* The page only has Male and Female, and their ids are lowercase. */
  formData.gender = faker.helpers.arrayElement(['male', 'female']);
  await page.locator(`#${formData.gender}`).check();
});

Then('the form should show the entered values', async ({ page, formData }) => {
  await expect(page.locator('#name')).toHaveValue(formData.name);
  await expect(page.locator('#email')).toHaveValue(formData.email);
  await expect(page.locator('#phone')).toHaveValue(formData.phone);
  await expect(page.locator('#textarea')).toHaveValue(formData.address);
  await expect(page.locator(`#${formData.gender}`)).toBeChecked();
});