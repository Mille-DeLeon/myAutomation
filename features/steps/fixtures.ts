import { test as base, createBdd } from 'playwright-bdd';

/* Values entered during a scenario, so later steps can check them. Fresh for every scenario. */
type Fixtures = {
  formData: Record<string, string>;
};

export const test = base.extend<Fixtures>({
  formData: async ({}, use) => {
    await use({});
  },
});

/* Shared Given/When/Then helpers. Import these in every steps file. */
export const { Given, When, Then } = createBdd(test);
