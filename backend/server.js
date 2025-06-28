const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();

// === ✅ CORS SETUP ===
const allowedOrigins = [
  'https://trading-sim-rho.vercel.app', // your actual Vercel frontend
  'http://localhost:3000'               // for local dev testing
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow no origin (e.g., Postman) or whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// === ✅ ENVIRONMENT VARIABLES ===
const MONGO_URI = process.env.MONGO_URI;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// === ✅ DATABASE CONNECTION ===
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// === ✅ STOCK SCHEMA ===
const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  shares: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
});

const Stock = mongoose.model('Stock', stockSchema);

// === ✅ HELPER FUNCTION: FETCH CURRENT STOCK PRICE ===
const getCurrentStockPrice = async (symbol) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    return response.data.c;
  } catch (err) {
    console.error('❌ Error fetching stock price:', err);
    throw new Error('Could not fetch stock price');
  }
};

// === ✅ ROUTES ===
app.get('/', (req, res) => {
  res.json({ message: 'Trade Simulator API is running!' });
});

app.get('/api/portfolio', async (req, res) => {
  try {
    const portfolio = await Stock.find();
    const updatedPortfolio = await Promise.all(portfolio.map(async (stock) => {
      const currentPrice = await getCurrentStockPrice(stock.symbol);
      const profit = (currentPrice - stock.buyPrice) * stock.shares;
      return {
        symbol: stock.symbol,
        shares: stock.shares,
        buyPrice: stock.buyPrice,
        currentValue: currentPrice,
        profit: profit.toFixed(2),
      };
    }));

    res.json({ portfolio: updatedPortfolio });
  } catch (err) {
    console.error('❌ Portfolio fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

app.post('/api/buy', async (req, res) => {
  const { symbol, units } = req.body;

  try {
    if (!symbol || !units || units <= 0) {
      return res.status(400).json({ error: 'Invalid input: Symbol and units are required' });
    }

    let stock = await Stock.findOne({ symbol });
    if (stock) {
      return res.status(400).json({ error: `You have already bought ${symbol}. You cannot buy the same stock more than once.` });
    }

    const price = await getCurrentStockPrice(symbol);
    stock = new Stock({ symbol, shares: units, buyPrice: price });
    await stock.save();

    res.json({ message: 'Stock bought successfully', stock });
  } catch (err) {
    console.error('❌ Stock purchase error:', err);
    res.status(500).json({ error: 'Failed to buy stock' });
  }
});

app.post('/api/sell', async (req, res) => {
  const { symbol, units } = req.body;

  try {
    if (!symbol || !units || units <= 0) {
      return res.status(400).json({ error: 'Invalid input: Symbol and units are required' });
    }

    const stock = await Stock.findOne({ symbol });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const unitsToSell = parseInt(units, 10);

    if (unitsToSell >= stock.shares) {
      await Stock.deleteOne({ symbol });
    } else {
      stock.shares -= unitsToSell;
      await stock.save();
    }

    res.json({ message: 'Stock sold successfully' });
  } catch (err) {
    console.error('❌ Stock sell error:', err);
    res.status(500).json({ error: 'Failed to sell stock' });
  }
});


// In your backend - modify your portfolio endpoint
app.get('/api/portfolio', async (req, res) => {
  try {
    // Get portfolio data (your existing logic)
    const portfolio = await getPortfolioData(); // Your existing function
    
    // Get user balance (add this)
    const balance = await getUserBalance(); // You'll need to implement this
    
    // Return both portfolio and balance
    res.json({
      portfolio: portfolio,
      balance: balance
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio and balance' });
  }
});

// Example getUserBalance function
async function getUserBalance() {
  // This depends on how you store user data
  // Could be from database, file, etc.
  
  // Example with a simple in-memory store:
  return userBalance || 10000; // Default $10,000 starting balance
  
  // Or from a database:
  // const user = await User.findById(userId);
  // return user.balance;
}

// === ✅ START SERVER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
