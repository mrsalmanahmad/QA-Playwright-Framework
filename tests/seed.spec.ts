import test from "../testFixtures/fixture";
import { expect } from "@playwright/test";


test.describe("@sanity: Login as a standard user and verify Benchmarks LV is opening and working fine", () => {
    test("Verify that Benchmarks LV is working fine and Table is loaded with no Error", async ({
        benchmarksPage
    }, testInfo) => {
        await test.step(`Navigate to the Benchmarks Page `, async () => {
            await benchmarksPage.goToBenchmarksLV();
            await benchmarksPage.waitForPageLoad();
        });

        await test.step(`Verify the LV Table is Loaded and Opened Successfully `, async () => {
            expect(await benchmarksPage.verifyBenchmarksTableLoaded())
        });

    });
});