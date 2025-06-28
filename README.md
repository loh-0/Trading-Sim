# Trade Simulator

A modern paper-trading app that lets users practice trading NASDAQ stocks with real-time data—no real money required. Built with React, Node.js, and MongoDB.

---

## 🌟 Key Features

### 📈 Portfolio Management

* Live stock prices via Finnhub API
* Real-time tracking: total value, P\&L, and performance %
* Interactive cards with detailed stock info
* Hide/show balance for privacy

### 📉 Stock Trading

* Instant stock lookup with debounce
* Smart quantity controls with validation
* One active position per stock (simplified tracking)
* Partial/full sell supported

### 🌐 User Experience

* Responsive design (mobile & desktop)
* Ant Design UI + custom CSS
* Notifications, loading states, error feedback
* Clean, modern interface with professional icons

---

## 🚀 Tech Stack

### Frontend

* React 18 + React Router
* Ant Design UI
* Fetch API for HTTP

### Backend

* Node.js + Express.js
* MongoDB Atlas + Mongoose
* Axios for API calls

### APIs & Services

* Finnhub API (stock data)
* Clearbit Logo API (fallback: Financial Modelling Prep)

### Deployment

* Vercel (frontend)
* Render (backend)
* .env for secure config management

---

## 📊 Architecture Highlights

### Database

* Stores only: symbol, units, buy price
* Real-time values fetched on-demand (no stale data)

### Trading Logic

* Market orders only (no limit/stop)
* Live pricing at time of trade
* Simple P\&L logic: (Current - Buy Price) × Units

### API Strategy

* Debounced lookups prevent spam
* Handles errors + invalid symbols
* Adheres to Finnhub rate limits

---

## 🔢 Key Calculations

* **Total Value**: Σ (Shares × Live Price)
* **Total P\&L**: Σ ((Live - Buy Price) × Shares)
* **Performance %**: (Total P\&L / Initial Investment) × 100

---

## 📝 Design & Development Approach

* Component-based structure (React)
* Separation of concerns: frontend vs backend
* Input validation both client & server
* Loading states + user feedback

### UX First

* Mobile-first responsive layout
* Clean visuals, intuitive flows
* SVG icons + modern card design

### Security

* Environment variables for API keys
* CORS for backend security
* Input sanitisation

---

## 🎯 Scope & Intent

> This is an educational demo project to showcase:
>
> * Full-stack development skills
> * API integration & live data handling
> * UI/UX design and responsiveness
> * Modern deployment pipelines

### Simplified by Design

* No login system (single user only)
* One stock = one position
* No complex order types

---

## 🎓 Skills Demonstrated

* Full-stack web development (React + Express)
* REST API design & cloud DB management
* Real-time API integration
* Responsive UI and UX design
* Environment & deployment configs (Vercel + Render)

---

## 🚧 Future Additions

* User login + multiple portfolios
* Limit/stop orders, dividends, charts
* WebSocket support for live updates
* Historical performance tracking
* Better caching & offline fallback

