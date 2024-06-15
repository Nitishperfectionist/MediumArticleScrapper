const express = require('express');
const bodyParser = require('body-parser');
const { scrapeMedium } = require('./scrape');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let articles = [];

app.post('/scrape', async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }
  
  try {
    articles = await scrapeMedium(topic);
    res.json(articles);
  } catch (error) {
    console.error('Error scraping Medium:', error);
    res.status(500).json({ error: 'Failed to scrape articles' });
  }
});

app.get('/articles', (req, res) => {
  res.json(articles);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
