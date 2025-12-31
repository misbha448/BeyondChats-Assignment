import React, { useEffect, useState } from "react";
import { fetchArticles } from "../api";
import ArticleCard from "../components/ArticleCard";
import "../styles.css";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchArticles()
      .then((res) => {
        setArticles(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch articles:", err);
        setError("Failed to load articles. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Effect to toggle dark mode class on the body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const renderContent = () => {
    if (loading) {
      return <p>Loading articles...</p>;
    }

    if (error) {
      return <p style={{ color: "var(--badge-original-text)" }}>{error}</p>;
    }

    if (articles.length === 0) {
      return <p>No articles found.</p>;
    }

    return (
      <div className="grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="header">
        <h1>BeyondChats Article Dashboard</h1>
        <p>Original and AI-enhanced articles</p>
      </div>

      {renderContent()}

      <footer className="footer">
        Built for BeyondChats Assignment • ReactJS
      </footer>
    </div>
  );
};

export default Articles;
