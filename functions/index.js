// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });


const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://admin:admin@cluster0.sygon.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define Stock schema (excluding currentValue)
const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  shares: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
});

const Stock = mongoose.model('Stock', stockSchema);

// Finnhub API key for fetching live stock prices
const FINNHUB_API_KEY = 'creopp1r01qnd5d01ie0creopp1r01qnd5d01ieg';

// Helper function to fetch live stock price from Finnhub API
const getCurrentStockPrice = async (symbol) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    return response.data.c;  // 'c' represents the current stock price
  } catch (err) {
    console.error('Error fetching stock price:', err);
    throw new Error('Could not fetch stock price');
  }
};

// API Routes: Fetch Portfolio, Buy Stock, Sell Stock

/**
 * GET /api/portfolio
 * Fetches the portfolio and dynamically calculates profit based on current stock prices.
 */
app.get('/api/portfolio', async (req, res) => {
  try {
    const portfolio = await Stock.find(); // Fetch all stocks from the database

    // Update each stock with the latest current value and calculate profit/loss
    const updatedPortfolio = await Promise.all(portfolio.map(async (stock) => {
      const currentPrice = await getCurrentStockPrice(stock.symbol); // Get the live price
      const profit = (currentPrice - stock.buyPrice) * stock.shares; // Calculate profit/loss

      // Return the updated stock data along with the calculated profit
      return {
        symbol: stock.symbol,
        shares: stock.shares,
        buyPrice: stock.buyPrice,
        currentValue: currentPrice, // Live price
        profit: profit.toFixed(2),  // Profit rounded to 2 decimals
      };
    }));

    res.json({ portfolio: updatedPortfolio }); // Return the updated portfolio
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

/**
 * POST /api/buy
 * Buys a stock by adding it to the portfolio, preventing duplicate purchases of the same stock.
 */
app.post('/api/buy', async (req, res) => {
  const { symbol, units } = req.body;

  try {
    // Input validation
    if (!symbol || !units || units <= 0) {
      return res.status(400).json({ error: 'Invalid input: Symbol and units are required' });
    }

    // Check if the stock already exists in the portfolio
    let stock = await Stock.findOne({ symbol });
    if (stock) {
      return res.status(400).json({ error: `You have already bought ${symbol}. You cannot buy the same stock more than once.` });
    }

    // Fetch current stock price
    const price = await getCurrentStockPrice(symbol);

    // Create and save a new stock entry
    stock = new Stock({
      symbol,
      shares: units,
      buyPrice: price, // Store the purchase price
    });

    await stock.save(); // Save to the database
    res.json({ message: 'Stock bought successfully', stock });
  } catch (err) {
    console.error('Error during stock purchase:', err);
    res.status(500).json({ error: 'Failed to buy stock' });
  }
});

/**
 * POST /api/sell
 * Sells a stock by reducing the number of shares or removing it from the portfolio if all shares are sold.
 */
app.post('/api/sell', async (req, res) => {
  const { symbol, units } = req.body;

  try {
    // Input validation
    if (!symbol || !units || units <= 0) {
      return res.status(400).json({ error: 'Invalid input: Symbol and units are required' });
    }

    // Fetch the stock to sell from the database
    const stock = await Stock.findOne({ symbol });
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const unitsToSell = parseInt(units, 10); // Ensure units is a number

    // If selling all shares, remove the stock from the portfolio, else reduce the shares
    if (unitsToSell >= stock.shares) {
      await Stock.deleteOne({ symbol }); // Remove stock entry if all shares are sold
    } else {
      stock.shares -= unitsToSell; // Reduce the number of shares
      await stock.save(); // Save the updated stock entry
    }

    res.json({ message: 'Stock sold successfully' });
  } catch (err) {
    console.error('Error selling stock:', err);
    res.status(500).json({ error: 'Failed to sell stock' });
  }
});

// Export the express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
