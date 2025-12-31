const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://beyondchats.com/blogs/";

async function getAllPageLinks() {
  const { data } = await axios.get(BASE_URL);
  const $ = cheerio.load(data);

  const pages = [];
  $(".page-numbers").each((i, el) => {
    const link = $(el).attr("href");
    if (link && !pages.includes(link)) {
      pages.push(link);
    }
  });

  return pages;
}

async function scrapeOldestArticles() {
  const pages = await getAllPageLinks();
  const articles = [];

  // Traverse from last page backwards
  for (let i = pages.length - 1; i >= 0 && articles.length < 5; i--) {
    const { data } = await axios.get(pages[i]);
    const $ = cheerio.load(data);

    $("article").each((_, el) => {
      if (articles.length < 5) {
        const title = $(el).find("h2").text().trim();
        const url = $(el).find("a").attr("href");

        articles.push({ title, url });
      }
    });
  }

  return articles;
}

module.exports = scrapeOldestArticles;
