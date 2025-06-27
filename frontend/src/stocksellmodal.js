import React, { useState } from 'react';
import { message } from 'antd'; // Import Ant Design message component for notifications
import axios from 'axios'; // Import Axios for HTTP requests

/**
 * StockSellModal Component allows users to sell stocks by specifying the quantity.
 * It sends a sell request to the backend with the selected stock symbol and number of units.
 *
 * @param {object} stock - The stock object containing details such as symbol, shares, and buyPrice.
 * @param {function} closeModal - Function to close the modal after selling.
 */
const StockSellModal = ({ stock, closeModal }) => {
  const [unitsToSell, setUnitsToSell] = useState(1); // Tracks the number of units the user wants to sell

  /**
   * Function to handle the stock sell operation.
   * Sends a POST request to the backend to execute the stock sale.
   */
  const handleSell = async () => {
    try {
      // Validate if the number of units to sell is within valid range
      if (unitsToSell <= 0 || unitsToSell > stock.shares) {
        message.error('Invalid quantity to sell'); // Display error message if invalid
        return;
      }

      // Send the sell request to the backend with the stock symbol and units
      await axios.post('http://localhost:5000/api/sell', {
        symbol: stock.symbol,
        units: unitsToSell
      });

      message.success(`Sold ${unitsToSell} shares of ${stock.symbol}`); // Success message
      closeModal(); // Close modal after successful sale
    } catch (error) {
      console.error('Error selling stock:', error);
      message.error('Error selling stock'); // Error message in case of failure
    }
  };

  return (
    <div className="modal">
      <h2>Sell {stock.symbol}</h2>
      <p>How many units would you like to sell?</p>
      {/* Input field for the user to specify the number of units to sell */}
      <div className="input-container">
        <input
          type="number"
          value={unitsToSell}
          min="1"
          max={stock.shares}
          onChange={(e) => setUnitsToSell(e.target.value)}
          className="sell-input"
        />
      </div>
      {/* Display the number of owned units and the original buy price */}
      <p>You own {stock.shares} units bought at {stock.buyPrice.toFixed(2)} USD each</p>
      {/* Sell and Cancel buttons */}
      <div className="modal-button-container">
        <button onClick={closeModal} className="cancel-button">Cancel</button>
        <button onClick={handleSell} className="sell-button">Sell</button>
      </div>
    </div>
  );
};

export default StockSellModal;
