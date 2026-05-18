import { test as fixture } from '@playwright/test'
import LoginPage from '../pages/loginPage'

const test = fixture.extend({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page))
	}

})

export default test