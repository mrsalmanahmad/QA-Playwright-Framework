import BasePage from './basePage'
import { baseUrl } from '../config'
import fs from 'fs'
import {
	username,
	password,
	loginButton,
} from '../pageobjects/loginPage'

const testData = JSON.parse(fs.readFileSync(`./data/globalData.json`, `utf-8`))

class LoginPage extends BasePage {
	constructor(page) {
		super(page)
	}

	async openApp() {
		await super.open(baseUrl)
		return await super.waitForPageLoad()
	}

	async usernameFieldVisible() {
		return await this.isElementVisible(username, testData.notVisible)
	}

	async passwordFieldVisible() {
		return await this.isElementVisible(password, testData.notVisible)
	}

	async loginButtonIsEnabled() {
		return await this.isElementEnabled(loginButton, testData.notVisible)
	}

	async enterUserName(userNameValue){
		console.log('Enter user name')
		return await this.inputText(username, userNameValue)
	}

	async enterPassword(passwordValue){
		console.log('Enter password')
		return await this.inputText(password, passwordValue)
	}

	async clickOnLoginButton(){
		return await this.waitAndClick(loginButton)
	}

	async mainScreenVisible(){
		
	}

	async loginCredentialsVisible() {
		return await this.isElementEnabled(
			loginCredentials,
			testData.notVisibleText
		)
	}

	async passwordCredentialsVisible() {
		return await this.isElementEnabled(
			loginPasswordCredentials,
			testData.notVisibleText
		)
	}

	async loginAsStandardUser() {
		await this.waitAndFill(username, testData.user_name)
		await this.waitAndFill(password, testData.password)
		await this.waitAndClick(loginButton)
	}
}
export default LoginPage