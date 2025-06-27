import mongoose from 'mongoose';
import axios from 'axios';

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

const Stock = mongoose.model('Stock', new mongoose.Schema({
  symbol: { type: String, required: true },
  shares: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
}));

const getCurrentStockPrice = async (symbol) => {
  const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
  return response.data.c;
};

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
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
      
      res.status(200).json({ portfolio: updatedPortfolio });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
