import mongoose from 'mongoose';

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

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
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

      res.status(200).json({ message: 'Stock sold successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to sell stock' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
