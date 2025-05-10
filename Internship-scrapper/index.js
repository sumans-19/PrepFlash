import express from 'express';
import cors from 'cors';
import { scrapeInternships } from './Scraper.js';

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:8080' }));

app.get('/api/internships', async (req, res) => {
  const { company, location } = req.query;

  try {
    const internships = await scrapeInternships(company, location);
    res.json(internships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching internships" });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});