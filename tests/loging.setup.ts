import test from '../testFixtures/fixture';
import { expect } from '@playwright/test';
import fs from 'fs';

const testData = JSON.parse(fs.readFileSync(`./data/globalData.json`, `utf-8`))

import {
	baseUrl
} from '../config'

test('Setup', async ({
    loginPage,
    page,
    assemblyLinePage
}) => {
    await test.step(`Open the APP and check logo`, async () => {
        await loginPage.openApp()
        //expect(await loginPage.getUrl()).toContain(baseUrl)
    })

    await test.step(`Enter User Name in username field`,async () => {
        await loginPage.enterUserName(testData.user_name);
    })

    await test.step(`Enter Password in Password field`, async () => {
        await loginPage.enterPassword(testData.password);
    })

    await test.step(`Click on Login Button `, async ()=>{
        await loginPage.clickOnLoginButton()
    })

    await test.step(`Verify the login is Successful `, async ()=> {
        await loginPage.waitForPageLoad()
        await loginPage.verifyTextOnPage('All rights reserved')
    })
    
    await test.step(`Select required Line `, async()=>{
        await assemblyLinePage.navigateToAssemblyLineSelectionPage()
    })

    await test.step(`Verify Page is opened and have Atleast 1 Line `, async () => {
        const orgNames = await assemblyLinePage.fetchOrganizationNames()
        expect(orgNames.length).toBeGreaterThanOrEqual(1)
    })

    await test.step(`Verify page is opened and select desired Assembly line `, async () => {
        await assemblyLinePage.clickAssemblyLineByName(testData.defaultAssemblyLine)
    })

    await test.step(`Verify Line is Selected `, async () => {
        const line = await assemblyLinePage.getSelectedAssemblyLineText()
        //expect(line).toEqual(testData.defaultAssemblyLine)
    })

    await page.context().storageState({path: ".auth/login.json"})
})


