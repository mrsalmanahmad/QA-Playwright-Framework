import dotenv from 'dotenv';

export let validatioName = '';

export function setValidationName(newName) {
  validatioName = newName;
}

export function getValidationName() {
  return validatioName;
}
// Use environment variable (set via .env file) or fallback to a default
export const baseUrl = process.env.URL || 'https://your-app-uat.yourdomain.com/';
export const mainScreenUrl = baseUrl + 'YourApp/Module/Screen';
export const signUpUrl = '';
export const title = 'PocketFactory';

export const globalImagePath = '../images/'
export const screenshotFolderPath = 'screenshots/'

// All Navigation URLs Must be stacked here
export const dashboardsLV = baseUrl + 'PocketFactory/BI/Dashboard/Index'
export const assemblyLineSelection = baseUrl + 'PocketFactory/PocketFactory.DataService.WebUI/AssemblyLine/AssemblyLineSelection?isMapView=False'
export const organizationLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/Organization/GetHieraricalOrganization'
export const widgetsLV = baseUrl + 'PocketFactory/BI/Widget/GetListView'
export const measuringpointsLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/MeasuringPoint/GetMeasuringPoints'
export const shiftsLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/Shift/Getshifts'
export const maintenanceTimesLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/MaintenanceTime/GetListView'
export const dashboardDistributionLV = baseUrl + 'PocketFactory/BI/DashboardDistribution/Index'
export const operatingHoursExplorerLV = baseUrl + 'PocketFactory/PocketFactory.AnalyticService.WebUI/OperatingHours/GetListView'
export const nominalSpeedsLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/NominalSpeed/GetListView'
export const paidTimesLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/PaidTime/GetListView'
export const benchmarksLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/BenchMark/GetListView'
export const devicesLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/Device/GetListView'
export const useCasesLV = baseUrl + 'PocketFactory/PocketFactory.AnalyticService.WebUI/UseCase/GetListView'
export const lookupCategoriesLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/LookupCategory/GetListView'
export const lookupsLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/Lookup/LookupLV'
export const materialCostLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/MaterialCost/GetListView'
export const companiesLV = baseUrl + 'PocketFactory/SSI.Identity.WebUI/Company/GetListView'
export const lookupHierarchyConfigurationScreen = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/LookupHierarchyConfiguration'
export const teamsLV = baseUrl + 'PocketFactory/SSI.Identity.WebUI/Team/GetListView'
export const rolesLV = baseUrl + 'PocketFactory/SSI.Identity.WebUI/Role/GetListView'
export const usersLV = baseUrl + 'PocketFactory/SSI.Identity.WebUI/User/GetListView'
export const maintenanceOverhaulLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/MaintenanceOverhaul/GetListView'
export const cipBenchmarkLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/CIPApp/BenchMarkLV'
export const lineConfigurationScreen = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/OrganizationConfiguration'
export const brandingScreen = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/BrandingConfiguration'
export const supportPageConfiguration = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/SupportPageConfiguration'
export const detailScreenConfigurationScreen = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/MPCategoryConfiguration/GetMPCategoryConfiguration'
export const manageGlobalLookupSLV = baseUrl + 'PocketFactory/PocketFactory.InformationService.WebUI/Lookup/GlobalLookupLV'
export const validationRulesScreen = baseUrl + 'PocketFactory/PocketFactory.PureDataService.WebUI/MeasuringPointValidationRule/ConfigureValidationRules'
export const validationRunsScreen = baseUrl + 'PocketFactory/PocketFactory.PureDataService.WebUI/Validation/GetListView'
export const validationResultsScreen = baseUrl + 'PocketFactory/PocketFactory.PureDataService.WebUI/ValidationResult/GetMultiValidationResultSummary'
export const validationBasicConfigurationScreen = baseUrl + 'PocketFactory/PocketFactory.PureDataService.WebUI/Configuration/Configurations'
export const validationNotificationsScreen = baseUrl + 'PocketFactory/PocketFactory.PureDataService.WebUI/NotificationConfiguration/ValidationNotifications'
export const licenseLV = baseUrl + 'PocketFactory/SSI.License.WebUI/License/GetListView'
export const userLicenseLV = baseUrl + 'PocketFactory/SSI.License.WebUI/License/GetDetailListView'
export const subscriptionPlanLV = baseUrl + 'PocketFactory/SSI.License.WebUI/SubscriptionPlan/GetListView'

// Save Global Information Newly Created Rows of anything
let _measuringPointCode = '';

export const measuringPointCode = {
  get value() { return _measuringPointCode; },
  set value(newValue) { _measuringPointCode = newValue; }
};


// Measuring Point Add Screen Menu Names
export const basicMenuName = 'Basic'
export const sourceMenuName = 'Source'
export const trendChartMenuName = 'Trend Chart'
export const benchmarkMenuName = 'Benchmark'
export const limitConfigurationsMenuName = 'Limit Configurations'
export const notificationsMenuName = 'Notifications'



// User Add screen menu selector
export const userLineTab = 'Lines'