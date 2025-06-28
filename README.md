# Trade Simulator

A modern paper-trading web application that allows users to practise trading NASDAQ stocks without spending real money. Built with React, Node.js, and MongoDB.

---

## Features

### Portfolio Management
- Real-time portfolio tracking with live stock prices from Finnhub API
- Portfolio metrics including total value, profit/loss, and performance percentage
- Interactive stock cards with hover effects and detailed information
- Privacy controls with hide/show balance toggle

### Stock Trading
- Live stock lookup with auto-complete functionality
- Real-time price data with market statistics (open, high, low, previous close)
- Smart quantity controls with validation
- Buy protection to prevent duplicate stock purchases for simplified tracking
- Sell functionality with partial or full position liquidation

### User Experience
- Professional SVG icons throughout the interface
- Responsive design optimised for desktop and mobile devices
- Clean, modern aesthetic with gradient backgrounds and card layouts
- Loading states and comprehensive error handling
- Company logos with intelligent fallbacks

---

## Technical Stack

### Frontend
- **React 18.3.1** with modern hooks and functional components
- **React Router** for client-side routing
- **Ant Design** UI component library for consistent design
- **Custom CSS** with responsive layouts
- **Fetch API** for HTTP requests with proper error handling

### Backend
- **Node.js** with Express.js web framework
- **MongoDB Atlas** cloud database for persistence
- **Mongoose** for object modelling and schema validation
- **Axios** for external API integration
- **CORS** configuration for secure cross-origin requests

### External Services
- **Finnhub API** for real-time stock market data
- **Clearbit Logo API** for company logos
- **Financial Modelling Prep** as backup logo service

### Deployment & Infrastructure
- **Vercel** for frontend hosting with automatic deployments
- **Heroku** for backend API hosting
- **MongoDB Atlas** for managed database hosting
- **Environment variables** for secure configuration management

---

## Architecture & Design Decisions

### Database Design
Simple schema approach storing only essential data:
- Stock symbol (ticker)
- Number of shares owned
- Original purchase price

Current market values are calculated dynamically using live API data, ensuring real-time accuracy without data staleness.

### Trading Rules
- **One position per stock**: Users can only hold one position per stock symbol to simplify tracking and avoid complex cost basis calculations
- **Live pricing**: All transactions use current market prices from Finnhub API
- **Flexible selling**: Users can sell partial or full positions
- **Data persistence**: All portfolio data stored in MongoDB Atlas

### API Integration
- **Rate limiting compliance**: Respects Finnhub's 60 calls/minute limit
- **Debounced requests**: Stock lookups are debounced to prevent excessive API calls
- **Error handling**: Graceful fallbacks for API failures or invalid symbols
- **Caching strategy**: Live prices fetched on-demand for accuracy

---

## Key Calculations

### Portfolio Metrics
- **Total Value**: Sum of (Current Stock Price × Shares Owned) for all positions
- **Total Profit/Loss**: Sum of (Current Price - Buy Price) × Shares for each stock
- **Performance Percentage**: (Total P&L ÷ Total Investment) × 100

### Real-time Updates
Portfolio values update dynamically based on live market data, providing users with current performance metrics.

---

## Development Approach

### Code Quality
- Component-based React architecture with reusable components
- Clean separation between frontend and backend services
- Comprehensive error handling and loading states
- Input validation on both client and server sides

### User Experience Focus
- Mobile-first responsive design approach
- Professional visual design with consistent iconography
- Intuitive navigation and clear information hierarchy
- Performance optimisation with debounced API calls

### Security Considerations
- Environment variables protect sensitive API keys and database credentials
- CORS configuration restricts unauthorised access
- Input sanitisation prevents injection attacks
- No sensitive financial data stored (educational use only)

---

## Project Scope & Limitations

### Educational Purpose
This is a **demonstration project** built for learning and portfolio purposes. It showcases:
- Full-stack web development skills
- Modern React and Node.js best practices
- API integration and real-time data handling
- Professional UI/UX design implementation
- Cloud deployment and DevOps practices

### Simplified Trading Model
- **No authentication system**: Single-user portfolio for simplicity
- **No real money**: Paper trading only for educational purposes
- **Simplified positions**: One position per stock to avoid complex cost basis tracking
- **Basic order types**: Market orders only (no limits, stops, etc.)

### Technical Limitations
- **API rate limits**: Limited to 60 Finnhub API calls per minute
- **Market hours**: Stock prices update during market hours only
- **Data accuracy**: Dependent on third-party API reliability

---

## Skills Demonstrated

### Full-Stack Development
- Modern React development with hooks and functional components
- RESTful API design with Express.js
- Database modelling and cloud deployment
- Responsive web design and user experience

### Software Engineering Practices
- Clean code architecture and component organisation
- Error handling and edge case management
- Environment configuration and deployment processes
- Performance optimisation techniques

### Industry Tools & Technologies
- Cloud database management (MongoDB Atlas)
- External API integration and data handling
- Modern deployment platforms (Vercel, Heroku)
- Version control and collaborative development practices

---

## Future Enhancements

If expanded beyond its current educational scope, potential improvements could include:

### Enhanced Trading Features
- User authentication and multiple portfolios
- Advanced order types (limit orders, stop losses)
- Historical performance tracking and charts
- Dividend tracking and reinvestment

### Technical Improvements
- Real-time WebSocket connections for live price updates
- Advanced caching strategies for improved performance
- Comprehensive testing s# Trade Simulator

A modern paper-trading web application that allows users to practice trading NASDAQ stocks without spending real money. Built with React, Node.js, and MongoDB.

---
