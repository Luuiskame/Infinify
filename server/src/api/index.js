import { app } from '../src/app.js';
import serverless from 'serverless-http';

// this is used for vercel serverless deploy
export default serverless(app);
