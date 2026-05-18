const { request } = require('@playwright/test');

async function getAccessToken() {
    const requestContext = await request.newContext({
        ignoreHTTPSErrors: true,
    });

    const clientId = 'YOUR_CLIENT_ID';           // Replace with your OAuth2 client ID
    const clientSecret = 'YOUR_CLIENT_SECRET';   // Replace with your OAuth2 client secret
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenEndpoint = process.env.TOKEN_URL || 'https://your-identity-server/connect/token';

    const tokenResponse = await requestContext.post(tokenEndpoint, {
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            grant_type: 'client_credentials',
            scope: 'your_scope',  // Replace with the required scope
        }
    });

    const tokenData = await tokenResponse.json();
    await requestContext.dispose();

    if (tokenResponse.ok()) {
        return tokenData.access_token;
    } else {
        throw new Error('Failed to fetch access token');
    }
}

module.exports = { getAccessToken };
