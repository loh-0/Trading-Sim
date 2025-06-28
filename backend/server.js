// ===== FILE 1: server.js  
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

// Initialize Express app and middlewares
const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-app.vercel.app'] // Replace with your actual Vercel URL
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection using environment variable
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin@cluster0.sygon.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define Stock schema
const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  shares: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
});

const Stock = mongoose.model('Stock', stockSchema);

// Finnhub API key from environment variable
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'creopp1r01qnd5d01ie0creopp1r01qnd5d01ieg';

// Helper function to fetch live stock price
const getCurrentStockPrice = async (symbol) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    return response.data.c;
  } catch (err) {
    console.error('Error fetching stock price:', err);
    throw new Error('Could not fetch stock price');
  }
};

// Root route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Trade Simulator API is running!' });
});

// GET /api/portfolio - Fetch portfolio
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
    console.error('Portfolio fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// POST /api/buy - Buy stock
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
    stock = new Stock({
      symbol,
      shares: units,
      buyPrice: price,
    });

    await stock.save();
    res.json({ message: 'Stock bought successfully', stock });
  } catch (err) {
    console.error('Stock purchase error:', err);
    res.status(500).json({ error: 'Failed to buy stock' });
  }
});

// POST /api/sell - Sell stock
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
    console.error('Stock sell error:', err);
    res.status(500).json({ error: 'Failed to sell stock' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
