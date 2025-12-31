const express = require("express");
const cors = require("cors");
const db = require("./db");
const scrapeOldestArticles = require("./scraper");

const app = express();
app.use(cors());
app.use(express.json());


/* ---------- CRUD APIs ---------- */

// READ ALL
app.get("/articles", (req, res) => {
  db.all("SELECT * FROM articles", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// READ ONE
app.get("/articles/:id", (req, res) => {
  db.get(
    "SELECT * FROM articles WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json(err);
      res.json(row);
    }
  );
});

app.post("/scrape", async (req, res) => {
  try {
    // 🔥 CLEAR OLD DATA BEFORE INSERTING NEW
    db.run("DELETE FROM articles");

    const articles = await scrapeOldestArticles();

    articles.forEach((article) => {
      db.run(
        `INSERT INTO articles (title, url, createdAt)
         VALUES (?, ?, datetime('now'))`,
        [article.title, article.url]
      );
    });

    res.json({
      message: "5 oldest articles scraped & stored successfully",
      articles,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE
app.put("/articles/:id", (req, res) => {
  const { title, content, isUpdated } = req.body;

  db.run(
    `UPDATE articles
     SET title = ?, content = ?, isUpdated = ?
     WHERE id = ?`,
    [title, content, isUpdated, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Article updated" });
    }
  );
});

// DELETE
app.delete("/articles/:id", (req, res) => {
  db.run(
    "DELETE FROM articles WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Article deleted" });
    }
  );
});

/* ---------- SERVER ---------- */
const PORT = 8000;
app.get("/", (req, res) => {
  res.send("BeyondChats Assignment Backend is running 🚀");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
