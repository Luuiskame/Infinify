import { app } from '../src/app.js';
import serverless from 'serverless-http';

// this is used for vercel serverless deploy

app.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });
  
export default serverless(app);
