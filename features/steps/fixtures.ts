import { test, createBdd } from 'playwright-bdd';

/* Shared Given/When/Then helpers. Import these in every steps file. */
export const { Given, When, Then } = createBdd(test);
