const config = {
    PORT: process.env.PORT || 9876,
    WINDOW_SIZE: 10,
    API_BASE_URL: 'http://20.244.56.144/test',
    REQUEST_TIMEOUT: 500, // ms
    NUMBER_TYPES: {
      p: 'primes',
      f: 'fibo',
      e: 'even',
      r: 'rand'
    }
  };
  
  module.exports = config;
  