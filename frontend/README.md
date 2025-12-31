BeyondChats Full Stack Assignment
📌 Overview

This repository contains my submission for the BeyondChats Full Stack Developer Assignment, implemented across three phases.

The project demonstrates:

Backend development with web scraping and REST APIs

Automated content enhancement using Google Search, scraping, and LLM integration

A ReactJS frontend to display original and updated articles in a clean, responsive UI

The goal is to simulate a real-world content enhancement pipeline with robustness and clean architecture.

🛠️ Tech Stack
Backend

Node.js

Express.js

SQLite

Axios

Cheerio

CORS

SerpAPI (Google Search)

OpenAI API (with graceful fallback)

Frontend

ReactJS

Axios

CSS (Responsive, card-based UI)

📂 Project Structure
beyondchats-assignment/
│
├── backend/
│   ├── server.js        # Express server & CRUD APIs
│   ├── scraper.js       # Web scraping logic (Phase 1)
│   ├── phase2.js        # Content update pipeline (Phase 2)
│   ├── db.js            # SQLite database setup
│   └── articles.db      # SQLite database file
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ArticleCard.jsx
│   │   ├── pages/
│   │   │   └── Articles.jsx
│   │   ├── api.js
│   │   ├── styles.css
│   │   └── App.js
│   └── package.json
│
└── README.md

⚙️ Local Setup Instructions
1️⃣ Clone the Repository
git clone <https://github.com/misbha448/BeyondChats-Assignment>
cd beyondchats-assignment

2️⃣ Backend Setup
cd backend
npm install
node server.js


Backend runs at:

http://localhost:8000

3️⃣ Run Phase 2 Script
node phase2.js


This script:

Fetches stored articles

Searches Google for top-ranking related blogs

Scrapes reference content

Attempts AI-based content enhancement

Updates articles via backend APIs

4️⃣ Frontend Setup
cd frontend
npm install
npm start


Frontend runs at:

http://localhost:3000

📊 Architecture / Data Flow Diagram
BeyondChats Website
        |
        v
Phase 1 Scraper (Node + Cheerio)
        |
        v
SQLite Database
        |
        v
REST APIs (Express)
        |
        v
Phase 2 Script
(Google Search → Scraping → LLM / Fallback)
        |
        v
Updated Articles in Database
        |
        v
React Frontend (Display Articles)

🔍 Phase 1 – Backend & Scraping
Functionality

Scrapes the 5 oldest blog articles from:

https://beyondchats.com/blogs/


Traverses pagination from the last page backwards

Extracts:

Article title

Article URL

Stores data in SQLite

Exposes CRUD APIs

Available APIs

POST /scrape – Scrape and store 5 oldest articles

GET /articles – Fetch all articles

GET /articles/:id – Fetch article by ID

POST /articles – Create a new article

PUT /articles/:id – Update an article

DELETE /articles/:id – Delete an article

🔄 Phase 2 – Content Update Pipeline

The Phase 2 script performs the following steps:

Fetches original articles from backend APIs

Searches article titles on Google using SerpAPI

Fetches top 2 ranking blog/article links

Scrapes main content from reference articles

Attempts to generate improved content using OpenAI

Gracefully falls back to structured scraped content if API quota limits are reached

Updates articles via CRUD APIs

Cites reference URLs at the bottom of updated articles

⚠️ Note on LLM Usage

OpenAI integration is implemented with proper error handling.
In case of API quota exhaustion, the system falls back to scraped reference content to ensure uninterrupted execution.

This mirrors real-world production resilience.

🎨 Phase 3 – React Frontend
Features

Fetches articles from backend APIs

Displays:

Article title

Update status (Original / Updated)

Enhanced content

Original source link

Responsive, card-based UI

Clean and professional layout

🌐 Live Demo

👉 Frontend Live Link:
https://beyondchats-ui.netlify.app/


📌 Evaluation Criteria Mapping

Completeness: All three phases fully implemented

ReadMe & Docs: Clear setup, architecture, and flow

UI/UX: Responsive and professional frontend

Live Link: Hosted frontend for review

Code Quality: Modular, readable, and maintainable code

✅ Project Status

✔ Phase 1 – Completed
✔ Phase 2 – Completed with robust fallback handling
✔ Phase 3 – Completed with responsive UI
✔ Ready for review and evaluation

🙌 Final Notes

This project focuses on clarity, robustness, and real-world engineering practices rather than over-engineering.
All phases are designed to be modular and extensible for future enhancements.
