export const environment = {
  production: true,
  giftshopApiUrl: 'https://giftshop-backend-dx8s.onrender.com/api',
  stripePublishableKey: 'pk_test_51RfEQyB99UNaOgXS34g0lnDOwr24hEEOd2VWSv4yDsOhzlqd3bwF25wqeqkQ3PBE5VipmEopnaaG7hEI9U0UwusJ00WNddH0oJ',
  auth0: {
    domain: 'dev-5s0kqebmrbddvuh3.us.auth0.com',
    clientId: 'a5IEO2kt3vUQYPzXqitaZiOUSjrYI4PI',
    redirectUri: 'https://exquisite-empanada-17d62b.netlify.app/login/callback',
    audience: 'https://giftshop-backend-dx8s.onrender.com',
    allowedList: [
      'https://giftshop-backend-dx8s.onrender.com/api/orders/**',
      'https://giftshop-backend-dx8s.onrender.com/api/checkout/purchase',
    ]
  }
};