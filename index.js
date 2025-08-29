import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import { dbconnection } from './db/database.js';
import privaterouter from './himym/quotes/private/privateroutes.js';
import publicrouter from './himym/quotes/public/publicroutes.js';

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json())

app.use('/himym', privaterouter);
app.use('/himym', publicrouter);

app.get('/himym/doc', (req, res) => {
  res.json({
    message: 'HIMYM API Documentation found in github',
    href:"https://github.com/Ashwin-Ash-09"
  })
})


dbconnection().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
}).catch((err) => {
  console.log(err);
});