const express = require('express');
const config = require('./config/config');
const numberController = require('./controllers/numberController');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/numbers/:numberid', numberController.getNumbers);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Service is healthy');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
