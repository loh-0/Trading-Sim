import React, { useState, useCallback, useEffect } from 'react';

const StockBuy = () => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buyLoading, setBuyLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Move API key to environment variable in production
  const FINNHUB_API_KEY = 'creopp1r01qnd5d01ie0creopp1r01qnd5d01ieg';

  // Notification system
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  // Debounced stock lookup
  useEffect(() => {
    if (!symbol.trim()) {
      setStockData(null);
      setError('');
      return;
    }

    const timeoutId = setTimeout(() => {
      lookupStock();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [symbol]);

  const lookupStock = async () => {
    if (!symbol.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${FINNHUB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.c && data.c > 0) {
        setStockData({
          symbol: symbol.toUpperCase(),
          currentPrice: data.c,
          previousClose: data.pc,
          change: data.c - data.pc,
          changePercent: ((data.c - data.pc) / data.pc) * 100,
          high: data.h,
          low: data.l,
          open: data.o
        });
      } else {
        setError('Invalid symbol or no data available');
        setStockData(null);
      }
    } catch (err) {
      setError('Failed to fetch stock data. Please check your connection.');
      setStockData(null);
      console.error('Stock lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!stockData || stockData.currentPrice <= 0) {
      showNotification('Please enter a valid stock symbol first', 'error');
      return;
    }

    if (quantity < 1) {
      showNotification('Quantity must be at least 1', 'error');
      return;
    }

    setBuyLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: stockData.symbol,
          units: parseInt(quantity),
          price: stockData.currentPrice
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to buy stock');
      }

      showNotification(
        `Successfully bought ${quantity} shares of ${stockData.symbol} at $${stockData.currentPrice.toFixed(2)} per share`,
        'success'
      );

      // Reset form
      setSymbol('');
      setQuantity(1);
      setStockData(null);
      setError('');
      
    } catch (err) {
      showNotification(err.message || 'Error buying stock', 'error');
    } finally {
      setBuyLoading(false);
    }
  };

  const totalCost = stockData ? stockData.currentPrice * quantity : 0;
  const isPositiveChange = stockData && stockData.change >= 0;

  return (
    <div className="stock-buy-container">
      {/* Notifications */}
      <div className="notifications">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        ))}
      </div>

      <div className="stock-buy-card">
        <h2>Buy Stocks</h2>
        
        {/* Stock Symbol Input */}
        <div className="input-group">
          <label htmlFor="symbol">Stock Symbol</label>
          <input
            id="symbol"
            type="text"
            placeholder="e.g., AAPL, GOOGL, TSLA"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="symbol-input"
            autoComplete="off"
          />
        </div>

        {/* Stock Information Display */}
        {loading && <div className="loading">Fetching stock data...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {stockData && (
          <div className="stock-info">
            <div className="stock-header">
              <h3>{stockData.symbol}</h3>
              <div className="price-info">
                <span className="current-price">${stockData.currentPrice.toFixed(2)}</span>
                <span className={`change ${isPositiveChange ? 'positive' : 'negative'}`}>
                  {isPositiveChange ? '+' : ''}${stockData.change.toFixed(2)} 
                  ({isPositiveChange ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="stock-details">
              <div className="detail-item">
                <span>Open:</span>
                <span>${stockData.open.toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <span>High:</span>
                <span>${stockData.high.toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <span>Low:</span>
                <span>${stockData.low.toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <span>Previous Close:</span>
                <span>${stockData.previousClose.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Purchase Controls */}
        {stockData && (
          <div className="purchase-section">
            <div className="quantity-section">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-controls">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                />
                <button 
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="total-section">
              <div className="total-display">
                <span>Total Cost:</span>
                <span className="total-amount">${totalCost.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleBuy}
              disabled={buyLoading || !stockData}
              className="buy-button"
            >
              {buyLoading ? 'Processing...' : `Buy ${quantity} Share${quantity > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .stock-buy-container {
          max-width: 500px;
          margin: 20px auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .notifications {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .notification {
          padding: 12px 16px;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          max-width: 300px;
          animation: slideIn 0.3s ease-out;
        }

        .notification.success {
          background-color: #10b981;
        }

        .notification.error {
          background-color: #ef4444;
        }

        .notification.info {
          background-color: #3b82f6;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .stock-buy-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 32px;
          border: 1px solid #e5e7eb;
        }

        h2 {
          margin: 0 0 24px 0;
          color: #111827;
          font-size: 24px;
          font-weight: 600;
        }

        .input-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
        }

        .symbol-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .symbol-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-style: italic;
        }

        .error-message {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin: 16px 0;
        }

        .stock-info {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          border: 1px solid #e5e7eb;
        }

        .stock-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .stock-header h3 {
          margin: 0;
          font-size: 20px;
          color: #111827;
        }

        .price-info {
          text-align: right;
        }

        .current-price {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }

        .change {
          font-size: 14px;
          font-weight: 500;
        }

        .change.positive {
          color: #10b981;
        }

        .change.negative {
          color: #ef4444;
        }

        .stock-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-item span:first-child {
          color: #6b7280;
          font-size: 14px;
        }

        .detail-item span:last-child {
          font-weight: 500;
          color: #111827;
        }

        .purchase-section {
          margin-top: 24px;
        }

        .quantity-section {
          margin-bottom: 20px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          width: fit-content;
        }

        .quantity-btn {
          background: #f3f4f6;
          border: none;
          padding: 12px 16px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-input {
          border: none;
          padding: 12px 16px;
          text-align: center;
          font-size: 16px;
          width: 80px;
          background: white;
        }

        .quantity-input:focus {
          outline: none;
        }

        .total-section {
          margin-bottom: 24px;
        }

        .total-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 18px;
        }

        .total-amount {
          font-weight: 700;
          color: #111827;
          font-size: 20px;
        }

        .buy-button {
          width: 100%;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .buy-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .buy-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .stock-buy-container {
            margin: 10px;
            padding: 10px;
          }

          .stock-buy-card {
            padding: 20px;
          }

          .stock-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .price-info {
            text-align: left;
          }

          .stock-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default StockBuy;