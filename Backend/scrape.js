const puppeteer = require('puppeteer');

async function scrapeMedium(topic) {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const url = `https://medium.com/search?q=${encodeURIComponent(topic)}`;

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });


    const articles = await page.evaluate(() => {
      const articleNodes = document.querySelectorAll('div.postArticle');
      const results = [];
      articleNodes.forEach((node) => {
        const titleNode = node.querySelector('h3');
        const authorNode = node.querySelector('.postMetaInline-authorLockup a');
        const dateNode = node.querySelector('time');
        const urlNode = node.querySelector('a');

        if (titleNode && authorNode && dateNode && urlNode) {
          results.push({
            title: titleNode.innerText.trim(),
            author: authorNode.innerText.trim(),
            date: dateNode.getAttribute('datetime'),
            url: urlNode.href,
          });
        }
      });
      return results.slice(0, 5); // Limit to top 5 articles
    });

    await browser.close();
    return articles;
  } catch (error) {
    console.error('Error scraping Medium:', error);
    throw new Error('Failed to scrape Medium articles');
  }
}

module.exports = { scrapeMedium };
