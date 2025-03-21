const axios = require('axios');
const config = require('../config/config');

class NumberService {
  constructor() {
    this.windowState = [];
    this.authToken = null;
    this.tokenExpiry = 0;
    this.axiosInstance = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: config.REQUEST_TIMEOUT
    });
    
    // Credentials should be stored securely, preferably in environment variables
    this.credentials = {
      companyName: process.env.COMPANY_NAME,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      ownerName: process.env.OWNER_NAME,
      ownerEmail: process.env.OWNER_EMAIL,
      rollNo: process.env.ROLL_NO
    };
  }

  async authenticate() {
    const now = Math.floor(Date.now() / 1000);
    
    // Check if token is still valid
    if (this.authToken && this.tokenExpiry > now + 60) {
      return this.authToken;
    }
    
    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth`, this.credentials);
      
      if (response.data && response.data.access_token) {
        this.authToken = response.data.access_token;
        this.tokenExpiry = response.data.expires_in;
        return this.authToken;
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      throw new Error('Failed to authenticate');
    }
  }

  async fetchNumbers(numberType) {
    try {
      // Ensure we have a valid token
      const token = await this.authenticate();
      
      const endpoint = config.NUMBER_TYPES[numberType];
      if (!endpoint) {
        throw new Error(`Invalid number type: ${numberType}`);
      }
      
      const response = await this.axiosInstance.get(`/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.numbers || [];
    } catch (error) {
      console.error(`Error fetching ${numberType} numbers:`, error.message);
      // Return empty array in case of timeout or error
      return [];
    }
  }

  updateWindow(newNumbers) {
    const prevState = [...this.windowState];
    
    // Filter out duplicates and add new unique numbers
    const uniqueNewNumbers = newNumbers.filter(num => !this.windowState.includes(num));
    
    // Update window state
    this.windowState = [...this.windowState, ...uniqueNewNumbers];
    
    // If window size exceeded, remove oldest numbers
    if (this.windowState.length > config.WINDOW_SIZE) {
      this.windowState = this.windowState.slice(-config.WINDOW_SIZE);
    }
    
    // Calculate average
    const avg = this.windowState.length > 0 
      ? this.windowState.reduce((sum, num) => sum + num, 0) / this.windowState.length 
      : 0;
    
    return {
      windowPrevState: prevState,
      windowCurrState: this.windowState,
      numbers: newNumbers,
      avg: parseFloat(avg.toFixed(2))
    };
  }
}

module.exports = new NumberService();