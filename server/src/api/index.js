import { app } from '../app.js';

// Add a simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Export the Express app directly
export default app;