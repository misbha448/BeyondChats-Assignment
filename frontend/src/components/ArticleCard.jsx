import React from "react";

const ArticleCard = ({ article }) => {
  return (
    <div className="card">
      <span className={`badge ${article.isUpdated ? "updated" : "original"}`}>
        {article.isUpdated ? "✨ AI Enhanced" : "📝 Original"}
      </span>

      <h2>{article.title}</h2>

      <div className="content">
        {article.content || "No content preview available."}
      </div>

      <a
        className="link"
        href={article.url}
        target="_blank"
        rel="noreferrer"
      >
        Read Full Article &rarr;
      </a>
    </div>
  );
};

export default ArticleCard;
