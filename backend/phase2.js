/**
 * ================================
 * PHASE 2 – FINAL (SERPAPI VERSION)
 * ================================
 */

require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

// ================= CONFIG =================
const PHASE1_API = 'http://localhost:8000/articles';
const CRUD_API = 'http://localhost:8000/articles';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;

// Deadline mode
const FORCE_UPDATE = true;
// ========================================


// Utility: title from URL
function titleFromUrl(url) {
  const slug = url.split('/').filter(Boolean).pop();
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}


// STEP 1: Fetch articles
async function fetchArticles() {
  const res = await axios.get(PHASE1_API);
  return FORCE_UPDATE ? res.data : res.data.filter(a => !a.isUpdated);
}


// STEP 2: Google search via SerpAPI
async function searchGoogle(title) {
  const res = await axios.get('https://serpapi.com/search', {
    params: {
      q: title,
      api_key: SERP_API_KEY,
      engine: 'google',
      num: 5
    }
  });

  return (
    res.data.organic_results || []
  )
    .map(r => r.link)
    .filter(l => l && l.startsWith('http'))
    .slice(0, 2);
}


// STEP 3: Scrape content
async function scrapeContent(url) {
  try {
    const res = await axios.get(url, { timeout: 15000 });
    const $ = cheerio.load(res.data);

    const content = [];
    $('h1, h2, h3, p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 40) content.push(text);
    });

    return content.join('\n\n');
  } catch {
    return '';
  }
}


// STEP 4: OpenAI rewrite
async function generateContent(title, references) {
  const combinedText = references
    .map(r => `Source: ${r.url}\n${r.content.slice(0, 3000)}`)
    .join('\n\n');

  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Rewrite this article titled "${title}" in your own words:\n\n${combinedText}`
          }
        ],
        temperature: 0.6
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    if (err.response?.status === 429) {
      console.warn('⚠️ OpenAI quota exceeded — using scraped content fallback');
      return `
${title}

${combinedText}

References:
${references.map(r => r.url).join('\n')}
`;
    }
    throw err;
  }
}


// STEP 5: Update article
async function updateArticle(id, content) {
  await axios.put(`${CRUD_API}/${id}`, {
    content,
    isUpdated: 1
  });
  console.log(`✅ Article ${id} updated`);
}


// ================= MAIN =================
(async () => {
  const articles = await fetchArticles();

  for (const article of articles) {
    const title = article.title || titleFromUrl(article.url);
    console.log(`\n🔹 Processing: ${title}`);

    const links = await searchGoogle(title);
    console.log('Top links:', links);

    if (!links.length) continue;

    const references = [];
    for (const link of links) {
      const content = await scrapeContent(link);
      if (content) references.push({ url: link, content });
    }

    if (!references.length) continue;

    const updatedContent = await generateContent(title, references);
    if (!updatedContent) continue;

    await updateArticle(article.id, updatedContent);
  }

  console.log('\n🎉 PHASE 2 COMPLETED SUCCESSFULLY');
})();
