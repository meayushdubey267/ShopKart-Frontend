export const environment = {
  production: true,
  shopKartApiUrl: 'https://shopkart-backend-104j.onrender.com/api',
  stripePublishableKey: 'pk_test_51RfEQyB99UNaOgXS34g0lnDOwr24hEEOd2VWSv4yDsOhzlqd3bwF25wqeqkQ3PBE5VipmEopnaaG7hEI9U0UwusJ00WNddH0oJ',
  auth0: {
    domain: 'dev-5s0kqebmrbddvuh3.us.auth0.com',
    clientId: 'a5IEO2kt3vUQYPzXqitaZiOUSjrYI4PI',
    redirectUri: 'https://reliable-treacle-372e4b.netlify.app/login/callback',
    audience: 'https://shopkart-backend-104j.onrender.com',
    allowedList: [
      'https://shopkart-backend-104j.onrender.com/api/orders/**',
      'https://shopkart-backend-104j.onrender.com/api/checkout/purchase',
    ]
  }
};