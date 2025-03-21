const numberService = require('../services/numberService');

const getNumbers = async (req, res) => {
  const { numberid } = req.params;
  
  if (!numberid || !['p', 'f', 'e', 'r'].includes(numberid)) {
    return res.status(400).json({ error: 'Invalid number type. Use p, f, e, or r.' });
  }
  
  try {
    // Fetch numbers from third-party API
    const numbers = await numberService.fetchNumbers(numberid);
    
    // Update window and calculate average
    const result = numberService.updateWindow(numbers);
    
    return res.json(result);
  } catch (error) {
    console.error('Error processing request:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNumbers
};