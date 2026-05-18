// import test from '../../testFixtures/fixture';
// import { expect } from '@playwright/test';
// import fs from 'fs';
// import { username, password, loginButton } from '../../pageobjects/loginPage';


// const testData = JSON.parse(fs.readFileSync(`./data/globalData.json`, `utf-8`))

// import {
// 	baseUrl,
// 	mainScreenUrl
// } from '../../config'

// test.describe(
// 	'@sanity: Login as a standard user',
// 	() => {
// 		test('Login to App as a standard user', async ({
// 			loginPage
// 		}) => {
// 			await test.step(`Open the APP and check logo`, async () => {
// 				await loginPage.openApp()
// 				expect(await loginPage.getUrl()).toContain(baseUrl)
// 			})

// 			await test.step(`Enter User Name in username field`,async () => {
// 				await loginPage.enterUserName(testData.user_name);
// 			})

// 			await test.step(`Enter Password in Password field`, async () => {
// 				await loginPage.enterPassword(testData.password);
// 			})

// 			await test.step(`Click on Login Button `, async ()=>{
// 				await loginPage.clickOnLoginButton()
// 			})

// 			await test.step(`Verify the login is Successful `, async ()=> {
// 				await loginPage.waitForPageLoad()
// 				await loginPage.verifyTextOnPage('All rights reserved')
// 			})
// 	}
// )}
// )


