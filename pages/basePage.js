import { expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import os from "os";
import { screenshotFolderPath } from "../config";
import dotenv from 'dotenv';
import xlsx from 'xlsx';

class BasePage {
	constructor(page) {
		this.page = page;
	}

	async loadEnv(env = process.env.ENV) {
		var envFile = `.env.${env}`;
		envFile = path.join(process.cwd(), 'env', `.env.${env}`);
		if (fs.existsSync(envFile)) {
			dotenv.config({ path: envFile });
			console.log(`Loaded environment from ${envFile}`);
		} else {
			console.warn(`Environment file ${envFile} not found`);
		}

		// Now you can access the variables
		console.log('Environment URL:', process.env.URL);
	}

	async open(url) {
		await this.page.setViewportSize({ width: 1280, height: 1280 });
		await this.page.evaluate(() => window.scrollTo(0, 0));
		return await this.page.goto(url);
	}

	async centerScroll() {
		await this.page.evaluate(() => window.scrollTo(0, 0));
	}

	async getTitle() {
		return await this.page.title();
	}

	async pause() {
		return await this.page.pause();
	}

	async getUrl() {
		return this.page.url();
	}

	async wait() {
		return this.page.waitForTimeout(10000);
	}

	async waitForPageLoad() {
		return await this.page.waitForLoadState("domcontentloaded");
	}

	async waitAndClick(selector) {
		return await this.page.click(selector);
	}

	async generateRandomString(name) {
		const random4Digit = Math.floor(1000 + Math.random() * 9000); // Generates 1000-9999
		const random = `${random4Digit}_${name}`;
		return random
	}

	async inputText(selector, text) {
		// Wait for the input field to be visible and interactable
		await this.page.waitForSelector(selector, { visible: true });

		// Clear any existing text in the input field
		await this.page.$eval(selector, (el) => (el.value = ""));

		// Type the new text into the input field
		await this.page.type(selector, text);

		// Log a message (optional)
		console.log(
			`Text "${text}" entered into the input field with selector "${selector}".`
		);
	}

	async waitForButtonToBeEnabled(selector) {
		await this.page.waitForFunction(
			(selector) => {
				const button = document.querySelector(selector);
				return button && !button.disabled;
			},
			selector,
			{ timeout: 60000 }
		); // Adjust the timeout as needed (e.g., 60000 ms for 1 minute)

		console.log("Button is enabled");
	}

	async waitAndHardClick(selector) {
		return await this.page.$eval(selector, (element) => element.click());
	}

	async waitAndFill(selector, text) {
		return await this.page.fill(selector, text);
	}

	async keyPress(selector, key) {
		return await this.page.press(selector, key);
	}

	async clearTextField(selector) {
		await this.page.fill(selector, '');
	}

	async takeScreenShot() {
		return expect(await this.page.screenshot()).toMatchSnapshot(
			"MyScreenShot.png"
		);
	}

	async takeFullPageScreenShot(imgName) {
		return await this.page.screenshot({
			path: screenshotFolderPath + imgName + ".png",
			fullPage: true,
		});
	}

	async verifyTextOnPage(text) {
		const pageContent = await this.page.content();
		//console.log(pageContent)
		return expect(pageContent.includes(text)).toBe(true);
	}

	async verifyFlashMessage(text, options = {}) {
		const {
			timeout = 13000,
			checkDisappearance = false,
			visibleTimeout = 10000
		} = options;

		try {
			// Wait for message to appear
			const element = await this.page.waitForSelector(
				`text=${text}`,
				{
					state: 'visible',
					timeout: visibleTimeout
				}
			);

			if (checkDisappearance) {
				// Then wait for it to disappear
				await this.page.waitForSelector(
					`text=${text}`,
					{
						state: 'hidden',
						timeout: timeout - visibleTimeout
					}
				);
			}
			return true;
		} catch (error) {
			return false;
		}
	}

	async verifyElementText(selector, text) {
		const textValue = await this.page.textContent(selector);
		return expect(textValue.trim()).toBe(text);
	}

	async verifyElementVisible(selector) {
		const isVisible = await this.page.isVisible(selector);
		return expect(isVisible).toBe(true);
	}

	async verifyElementContainsText(selector, text) {
		const locatorText = await this.page.locator(selector);
		return await expect(locatorText).toContainText(text);
	}

	async verifyJSElementValue(selector, text) {
		const textValue = await this.page.$eval(
			selector,
			(element) => element.value
		);
		return expect(textValue.trim()).toBe(text);
	}

	async selectValueFromDropdown(selector, text) {
		const dropdown = await this.page.locator(selector);
		return await dropdown.selectOption({ value: text });
	}

	async verifyElementAttribute(selector, attribute, value) {
		const textValue = await this.page.getAttribute(selector, attribute);
		return expect(textValue.trim()).toBe(value);
	}

	async getFirstElementFromTheList(selector) {
		const rows = await this.page.locator(selector);
		const count = await rows.count();
		for (let i = 0; i < count; ++i) {
			const firstItem = await rows.nth(0).textContent();
			return firstItem;
		}
	}

	async getLastElementFromTheList(selector) {
		const rows = await this.page.locator(selector);
		const count = await rows.count();
		for (let i = 0; i < count; ++i) {
			const lastItem = await rows.nth(5).textContent();
			return lastItem;
		}
	}

	async clickAllElements(selector) {
		const rows = await this.page.locator(selector);
		const count = 2;
		for (let i = 0; i < count; ++i) {
			await rows.nth(i).click();
		}
	}

	async clickAllLinksInNewTabs(selector) {
		const rows = this.page.locator(selector);
		const count = rows.count();
		for (i in range(count)) {
			await rows.nth(i).click((modifiers = ["Control", "Shift"]));
		}
	}

	async isElementVisible(selector, errorMessage) {
		const element = this.page.locator(selector);
		try {
			const isVisible = await element.isVisible();
			expect(isVisible).toBeTruthy();
		} catch (error) {
			throw new Error(`${errorMessage}`);
		}
	}

	async getInputText(selector) {
		// Wait for the input field to be visible
		await this.page.waitForSelector(selector, { visible: true });

		// Get the value from the input field
		const inputValue = await this.page.$eval(selector, (el) => el.value);

		// Log the value (optional)
		console.log(`Value in the input field: ${inputValue}`);

		return inputValue;
	}

	async isElementNotVisible(selector) {
		const element = this.page.locator(selector);
		return expect(element).toBeHidden;
	}

	async isElementEnabled(selector, errorMessage) {
		const element = this.page.locator(selector);
		try {
			const isEnabled = await element.isEnabled();
			expect(isEnabled).toBeTruthy();
		} catch (error) {
			throw new Error(`${errorMessage}`);
		}
	}

	async isElementChecked(selector, errorMessage) {
		const element = this.page.locator(selector);
		try {
			const isChecked = await element.isChecked();
			expect(isChecked).toBeTruthy();
		} catch (error) {
			throw new Error(`${errorMessage}`);
		}
	}

	async getDownloadPath() {
		let downloadFolder;

		// Determine the default Downloads folder based on the OS
		switch (os.platform()) {
			case "win32":
			case "darwin":
			case "linux":
				downloadFolder = path.join(os.homedir(), "Downloads");
				break;
			default:
				throw new Error("Unsupported OS");
		}

		return downloadFolder;
	}

	async downloadAndVerify(fileName) {
		// Start waiting for the download before clicking the button
		const downloadPromise = this.page.waitForEvent("download", {
			timeout: 30000,
		});

		// Get the system's download path dynamically
		const downloadPath = await this.getDownloadPath();
		const filePath = path.join(downloadPath, fileName);
		console.log("Download FilePath found is: " + filePath);

		// Click the button to trigger the download
		//await this.page.getByText(downloadButtonText).click();

		// Wait for the download to start and capture the download object
		const download = await downloadPromise;

		// Save the downloaded file to the desired location with the original filename
		await download.saveAs(
			path.join(downloadPath, download.suggestedFilename())
		);
		console.log("Download finished and saved to: " + filePath);

		// Implement a retry mechanism to check for file existence
		const maxRetries = 10;
		const delayBetweenRetries = 2000; // 2 seconds
		let fileExists = false;

		for (let attempt = 0; attempt < maxRetries; attempt++) {
			if (fs.existsSync(filePath)) {
				fileExists = true;
				break;
			}
			console.log(
				`Waiting for file ${fileName} to appear... Retry ${attempt + 1}`
			);
			await new Promise((resolve) =>
				setTimeout(resolve, delayBetweenRetries)
			); // Wait before retrying
		}

		// Verify if the file exists in the system's download folder
		if (fileExists) {
			console.log(`File ${fileName} has been downloaded successfully.`);

			// Call function to delete the downloaded file after verification
			this.deleteDownloadedFile(filePath);
			return true;
		} else {
			return false;
		}
	}

	// Function to delete the downloaded file
	deleteDownloadedFile(filePath) {
		try {
			// Check if the file exists before attempting to delete
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath); // Synchronous deletion of the file
				console.log(`File ${filePath} has been deleted successfully.`);
			} else {
				console.log(`File ${filePath} does not exist, cannot delete.`);
			}
		} catch (error) {
			console.error(
				`An error occurred while deleting the file: ${error.message}`
			);
		}
	}

	async uploadDocument(fileName) {
		try {
			const filePath = path.resolve(__dirname, "testFiles", fileName);

			// Check if file exists before uploading
			if (!fs.existsSync(filePath)) {
				console.log(`File ${filePath} does not exist, cannot upload.`);
				return;
			}

			// Wait for real file input to be present in popup
			await this.page.waitForSelector("#txtUploadFile", { state: "attached" });

			// Upload file into hidden file input
			await this.page.setInputFiles("#txtUploadFile", filePath);

			console.log(`File ${fileName} uploaded successfully.`);
		} catch (error) {
			console.error("An error occurred while uploading the file:", error.message);
		}
	}

	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Function to drag and drop an element to another element

	async dragAndDropElement(selector, targetDiv) {
		const element = this.page.locator(selector).nth(0);
		const _targetDiv = this.page.locator(targetDiv);

		await element.dragTo(_targetDiv);
	}

	async isTableLoaded(selector) {
		const tableSelector = selector;

		// Wait for the table to be visible
		await this.page.waitForSelector(tableSelector, {
			state: "visible", timeout: 5000,
		});

		// Check if table exists and is visible
		const isTablePresent = (await this.page.$(tableSelector)) !== null;
		console.log(isTablePresent + " is table present ?");
		if (!isTablePresent) {
			console.error("Table is not loaded.");
			return false;
		}
		console.log("Table is successfully loaded.");
		return true;
	}

	async getTableData(tableSelector, dataTableGrid) {
		try {
			// Get all column headers
			const columnHeaders = await this.page.$$eval(`${tableSelector} thead tr th`, ths =>
				ths.map(th => th.textContent.trim())
			);
			//console.log('Column Headers are:', columnHeaders);

			// Get all rows data
			const rowsData = await this.page.$$eval(`${dataTableGrid} tbody tr`, rows =>
				rows.map(row => {
					const rowData = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
					// Extract the data-id from the row's <tr> and store it as ColumnID
					const columnID = row.getAttribute('data-id');
					// Return both the columnID and row data
					return { ColumnID: columnID, rowData };
				})
			);
			rowsData.forEach((row, index) => {
				//console.log('Row Data : ' + row);
			});

			return rowsData;
		} catch (error) {
			console.error('Error extracting table data:', error);
			throw error; // Re-throw the error to handle it in the calling function
		}
	}


	async selectValueInDropDownField(_fieldName, _inputSelector, _igComboSelector) {
		// Locate the input field inside the dropdown
		const inputSelector = _inputSelector;
		const inputField = this.page.locator(inputSelector);

		// Clear any existing value and type the _fieldName name
		await inputField.click(); // Focus the input
		//await inputField.fill(_fieldName); // Type the name

		await this.page.type(_inputSelector, _fieldName, { delay: 20 });

		// Wait for the dropdown results to appear (adjust selector if needed)
		await this.page.waitForSelector(_igComboSelector, { state: 'visible' });

		// Click the matching result
		const optionSelector = _igComboSelector + `:has-text("${_fieldName}")`;
		console.log('option selector ' + optionSelector)
		try {
			console.log(this.page.locator(optionSelector))
			await this.page.locator(optionSelector).first().click();
			console.log('after clicking')
		} catch (error) {
			throw new Error(`FieldName "${_fieldName}" not found in dropdown results`);
		}
	}


	async clickRowDeleteButton(rowDataKey) {
		try {
			// First, locate the row action element using the data-key attribute
			const rowActionSelector = `.ssi_gridRowAction [data-key="${rowDataKey}"]`;

			// Get the row action element handle
			const rowActionElement = await this.page.$(rowActionSelector);
			if (!rowActionElement) {
				throw new Error(`Row action element with data-key "${rowDataKey}" not found`);
			}

			// Scroll the element into view (handles both horizontal and vertical scrolling)
			await rowActionElement.evaluate(el => el.scrollIntoView({
				block: 'nearest',
				inline: 'nearest'
			}));

			// Hover over the arrow to make the delete button visible
			await rowActionElement.hover({ force: true });

			// Wait for the delete button to appear (adjust the selector as needed)
			// The delete button might appear in a dropdown or popup menu
			const deleteButtonSelector = `#rowAction_deleteAction[data-key="${rowDataKey}"]`;
			console.log('reached here 1' + deleteButtonSelector)
			// Wait for the delete button to be visible with a longer timeout
			await this.page.waitForSelector(deleteButtonSelector, {
				state: 'visible',
				timeout: 2000  // Increased timeout to 10 seconds
			});

			// Click the delete button
			await this.page.click(deleteButtonSelector);

			// Optional: wait for any confirmation dialog if needed
			// await this.page.waitForSelector('.confirmation-dialog', { state: 'visible' });

			console.log(`Successfully clicked delete button for row with data-key: ${rowDataKey}`);
		} catch (error) {
			console.error(`Error clicking delete button for row ${rowDataKey}:`, error);
			throw error;
		}
	}

	async clickOnYesOptionDeletePopup(selector) {
		await this.waitAndClick(selector)
	}

	async selectValueInDropDownFieldWithoutClick(_fieldName, _inputSelector, _igComboSelector) {
		// Locate the input field inside the dropdown
		const inputSelector = _inputSelector;
		const inputField = this.page.locator(inputSelector);

		// Clear any existing value and type the _fieldName name
		await inputField.click(); // Focus the input
		//await inputField.fill(_fieldName); // Type the name

		await this.page.type(_inputSelector, _fieldName, { delay: 20 });

		// Wait for the dropdown results to appear (adjust selector if needed)
		await this.page.waitForSelector(_igComboSelector, { state: 'visible' });

		// Click the matching result
		const optionSelector = _igComboSelector + `:has-text("${_fieldName}")`;

	}

	async clickTab(tabName, selector) {
		// Validate tabName is not empty
		if (!tabName || typeof tabName !== 'string') {
			throw new Error('Tab name must be a non-empty string');
		}

		// Create selector for the tab link containing the text
		const tabSelector = selector + `:has-text("${tabName}")`;

		try {
			// Wait for the tab to be visible and enabled
			await this.page.locator(tabSelector).waitFor({ state: 'visible' });

			// Click the tab
			await this.page.locator(tabSelector).click();

			// Optional: Wait for the tab to become active (if it changes class)
			await this.page.locator(`${tabSelector}.active`).waitFor({ state: 'attached' }).catch(() => { });

		} catch (error) {
			throw new Error(`Failed to click tab "${tabName}": ${error.message}`);
		}
	}

	async downloadAndVerifyFileExist(fileName) {
		// Start waiting for the download before clicking the button
		const downloadPromise = this.page.waitForEvent("download", {
			timeout: 30000,
		});

		// Get the system's download path dynamically
		const downloadPath = await this.getDownloadPath();
		console.log("Download path found is: " + downloadPath);

		// Click the button to trigger the download
		// await this.page.getByText(downloadButtonText).click();

		// Wait for the download to start and capture the download object
		const download = await downloadPromise;
		
		// Get the suggested filename from the download
		const suggestedFilename = download.suggestedFilename();
		const finalFilePath = path.join(downloadPath, suggestedFilename);

		// Save the downloaded file to the desired location with the original filename
		await download.saveAs(finalFilePath);
		console.log("Download finished and saved to: " + finalFilePath);

		return finalFilePath;
	}

	async searchInXLSX(filePath, searchString) {
		try {
			// Check if file exists
			if (!fs.existsSync(filePath)) {
				console.log(`File not found: ${filePath}`);
				return false;
			}

			// Load the workbook
			const workbook = xlsx.readFile(filePath);
			
			// Convert search string to lowercase for case-insensitive search
			const searchLower = searchString.toLowerCase();
			let found = false;
			let foundLocations = [];

			// Search through all sheets
			workbook.SheetNames.forEach(sheetName => {
				const worksheet = workbook.Sheets[sheetName];
				
				// Convert sheet to JSON
				const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
				
				// Search through all rows and columns
				data.forEach((row, rowIndex) => {
					if (Array.isArray(row)) {
						row.forEach((cell, colIndex) => {
							if (cell !== null && cell !== undefined) {
								const cellString = String(cell);
								if (cellString.toLowerCase().includes(searchLower)) {
									found = true;
									foundLocations.push({
										sheet: sheetName,
										row: rowIndex + 1, // Convert to 1-based indexing
										column: colIndex + 1,
										cellValue: cellString
									});
								}
							}
						});
					}
				});
			});

			if (found) {
				console.log(`Found "${searchString}" in file: ${filePath}`);
				console.log(`Found at ${foundLocations.length} location(s):`);
				foundLocations.forEach(loc => {
					console.log(`  - Sheet: "${loc.sheet}", Row: ${loc.row}, Column: ${loc.column}, Value: "${loc.cellValue}"`);
				});
				return {
					found: true,
					locations: foundLocations,
					filePath: filePath
				};
			} else {
				console.log(`"${searchString}" not found in file: ${filePath}`);
				return {
					found: false,
					locations: [],
					filePath: filePath
				};
			}
			
		} catch (error) {
			console.error(`Error reading XLSX file ${filePath}:`, error);
			return {
				found: false,
				error: error.message,
				filePath: filePath
			};
		}
	}

	// Simpler version if you just need a boolean result:
	async isStringInXLSX(filePath, searchString) {
		try {
			if (!fs.existsSync(filePath)) {
				return false;
			}

			const workbook = xlsx.readFile(filePath);
			const searchLower = searchString.toLowerCase();

			for (const sheetName of workbook.SheetNames) {
				const worksheet = workbook.Sheets[sheetName];
				const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
				
				for (const row of data) {
					if (Array.isArray(row)) {
						for (const cell of row) {
							if (cell !== null && cell !== undefined) {
								if (String(cell).toLowerCase().includes(searchLower)) {
									console.log(`Found "${searchString}" in ${filePath}`);
									return true;
								}
							}
						}
					}
				}
			}
			
			return false;
			
		} catch (error) {
			console.error(`Error reading XLSX file:`, error);
			return false;
		}
	}

}

export default BasePage;
