import { test as base } from "@playwright/test";
import dotenv from "dotenv";
import APIPage from "../pages/api.page";
dotenv.config();

interface pages {
  apiPage: APIPage;
}

export const test = base.extend<pages>({
  apiPage: async ({ request }, use) => {
    await use(new APIPage(request));
  },
});

export const expect = test.expect;
