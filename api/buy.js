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

  if (req.method === 'POST') {
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
      res.status(200).json({ message: 'Stock bought successfully', stock });
    } catch (err) {
      res.status(500).json({ error: 'Failed to buy stock' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
