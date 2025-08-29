// api/index.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { dbconnection } from './db/database.js';
import privaterouter from './himym/quotes/private/privateroutes.js';
import publicrouter from './himym/quotes/public/publicroutes.js';

const app = express();
app.use(express.json());

app.use('/himym', privaterouter);
app.use('/himym', publicrouter);

app.get('/himym/doc', (req, res) => {
  res.json({
    message: 'HIMYM API Documentation found in github',
    href: 'https://github.com/Ashwin-Ash-09',
  });
});
app.get('/', (req, res) => {
  res.json({
    message: 'HIMYM API Documentation found in github',
    href: 'https://github.com/Ashwin-Ash-09',
  });
});

// Initialize DB once per runtime
let ready;
export default async function handler(req, res) {
  ready ||= dbconnection();
  await ready;
  return app(req, res);
}
