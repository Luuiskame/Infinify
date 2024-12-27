import { PORT } from './config.js';
import {server} from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

server.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});
