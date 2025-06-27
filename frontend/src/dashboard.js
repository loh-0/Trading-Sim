import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Typography, message, Modal } from 'antd';
import axios from 'axios';
import StockSellModal from './stocksellmodal';
import { Link } from 'react-router-dom';

const { Title } = Typography;

// Professional SVG Icons
const TrendingUpIcon = ({ size = 18, color = "#16a34a" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,7 22,7 22,13" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendingDownIcon = ({ size = 18, color = "#dc2626" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="22,17 13.5,8.5 8.5,13.5 2,7" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,17 22,17 22,11" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DollarIcon = ({ size = 18, color = "#3b82f6" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M12 6v12M9.5 9a3 3 0 0 1 5 0M14.5 15a3 3 0 0 1-5 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DashboardIcon = ({ size = 18, color = "#8b5cf6" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" 
      fill={color}
    />
  </svg>
);

const PercentageIcon = ({ size = 18, color = "#8b5cf6" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="19" y1="5" x2="5" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6.5" cy="6.5" r="2.5" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="17.5" cy="17.5" r="2.5" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

const EyeIcon = ({ size = 18, color = "#6b7280" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" 
      fill={color}
    />
  </svg>
);

const EyeOffIcon = ({ size = 18, color = "#6b7280" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" 
      fill={color}
    />
  </svg>
);

const ShoppingCartIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" 
      fill={color}
    />
  </svg>
);

const EmptyStateIcon = ({ size = 32, color = "#9ca3af" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7v2H4V4h3.5l1-1h7l1 1H20zm-2 4H5v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8z" 
      fill={color}
    />
    <path 
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" 
      fill={color}
    />
  </svg>
);

// Company logo component with fallback (unchanged)
const CompanyLogo = ({ symbol, size = 48 }) => {
  const [logoSrc, setLogoSrc] = useState('');
  const [logoError, setLogoError] = useState(false);

  // Map of stock symbols to company domains for Clearbit API
  const symbolToDomain = {
    'AAPL': 'apple.com',
    'GOOGL': 'google.com',
    'GOOG': 'google.com',
    'MSFT': 'microsoft.com',
    'AMZN': 'amazon.com',
    'TSLA': 'tesla.com',
    'META': 'meta.com',
    'NVDA': 'nvidia.com',
    'NFLX': 'netflix.com',
    'BABA': 'alibaba.com',
    'V': 'visa.com',
    'JPM': 'jpmorganchase.com',
    'JNJ': 'jnj.com',
    'WMT': 'walmart.com',
    'PG': 'pg.com',
    'UNH': 'unitedhealthgroup.com',
    'HD': 'homedepot.com',
    'MA': 'mastercard.com',
    'BAC': 'bankofamerica.com',
    'DIS': 'disney.com',
    'ADBE': 'adobe.com',
    'CRM': 'salesforce.com',
    'VZ': 'verizon.com',
    'CMCSA': 'comcast.com',
    'INTC': 'intel.com',
    'T': 'att.com',
    'PFE': 'pfizer.com',
    'KO': 'coca-cola.com',
    'NKE': 'nike.com',
    'ABT': 'abbott.com',
    'TMO': 'thermofisher.com',
    'COST': 'costco.com',
    'AVGO': 'broadcom.com',
    'XOM': 'exxonmobil.com',
    'ACN': 'accenture.com',
    'LLY': 'lilly.com',
    'CVX': 'chevron.com',
    'ABBV': 'abbvie.com',
    'DHR': 'danaher.com',
    'BMY': 'bms.com',
    'QCOM': 'qualcomm.com',
    'ORCL': 'oracle.com',
    'TXN': 'ti.com',
    'LIN': 'linde.com',
    'MDT': 'medtronic.com',
    'UNP': 'up.com',
    'PM': 'pmi.com',
    'NEE': 'nexteraenergy.com',
    'RTX': 'rtx.com',
    'LOW': 'lowes.com',
    'HON': 'honeywell.com',
    'IBM': 'ibm.com',
    'UBER': 'uber.com',
    'SPGI': 'spglobal.com',
    'GS': 'goldmansachs.com',
    'CAT': 'caterpillar.com',
    'AXP': 'americanexpress.com',
    'BLK': 'blackrock.com',
    'GILD': 'gilead.com',
    'DE': 'deere.com',
    'ISRG': 'intuitive.com',
    'INTU': 'intuit.com',
    'C': 'citigroup.com',
    'AMD': 'amd.com',
    'NOW': 'servicenow.com',
    'BA': 'boeing.com',
    'BKNG': 'booking.com',
    'MU': 'micron.com',
    'TGT': 'target.com',
    'SCHW': 'schwab.com',
    'CVS': 'cvshealth.com',
    'REGN': 'regeneron.com',
    'SYK': 'stryker.com',
    'AMGN': 'amgen.com',
    'ZTS': 'zoetis.com',
    'PLD': 'prologis.com',
    'ADI': 'analog.com',
    'CB': 'chubb.com',
    'MO': 'altria.com',
    'DUK': 'duke-energy.com',
    'TFC': 'truist.com',
    'SO': 'southerncompany.com',
    'COP': 'conocophillips.com',
    'BSX': 'bostonscientific.com',
    'ICE': 'ice.com',
    'SHW': 'sherwin-williams.com',
    'USB': 'usbank.com',
    'WM': 'wm.com',
    'AON': 'aon.com',
    'GD': 'gd.com',
    'CL': 'colgatepalmolive.com',
    'ITW': 'itw.com',
    'MMC': 'mmc.com',
    'PNC': 'pnc.com',
    'FCX': 'fcx.com',
    'CME': 'cmegroup.com',
    'EOG': 'eogresources.com',
    'FIS': 'fisglobal.com',
    'NSC': 'nscorp.com',
    'APD': 'airproducts.com',
    'GM': 'gm.com',
    'F': 'ford.com',
    'COIN': 'coinbase.com',
    'SQ': 'squareup.com',
    'PYPL': 'paypal.com',
    'CRM': 'salesforce.com',
    'SHOP': 'shopify.com',
    'ROKU': 'roku.com',
    'SNAP': 'snap.com',
    'TWTR': 'twitter.com',
    'SPOT': 'spotify.com',
    'ZM': 'zoom.us',
    'PTON': 'onepeloton.com',
    'DOCU': 'docusign.com'
  };

  useEffect(() => {
    const domain = symbolToDomain[symbol.toUpperCase()];
    if (domain) {
      // Try Clearbit logo API first
      setLogoSrc(`https://logo.clearbit.com/${domain}?size=${size}`);
    } else {
      // Fallback to Financial Modeling Prep API
      setLogoSrc(`https://financialmodelingprep.com/image-stock/${symbol.toUpperCase()}.png`);
    }
    setLogoError(false);
  }, [symbol, size]);

  const handleImageError = () => {
    if (!logoError) {
      setLogoError(true);
      // Try the backup API
      setLogoSrc(`https://financialmodelingprep.com/image-stock/${symbol.toUpperCase()}.png`);
    }
  };

  if (logoError || !logoSrc) {
    // Fallback to gradient circle with symbol initials
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: `${size * 0.35}px`
      }}>
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img
        src={logoSrc}
        alt={`${symbol} logo`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          padding: '4px'
        }}
        onError={handleImageError}
      />
    </div>
  );
};

function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/portfolio');
      setPortfolio(response.data.portfolio);
    } catch (error) {
      message.error('Error fetching portfolio');
    }
  };

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedStock(null);
    fetchPortfolio();
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((acc, stock) => acc + stock.currentValue * stock.shares, 0).toFixed(2);
  };

  const calculateTotalProfit = () => {
    return portfolio.reduce((acc, stock) => {
      const profit = (stock.currentValue - stock.buyPrice) * stock.shares;
      return acc + profit;
    }, 0).toFixed(2);
  };

  const calculateProfitPercentage = () => {
    const totalCost = portfolio.reduce((acc, stock) => acc + stock.buyPrice * stock.shares, 0);
    const totalProfit = parseFloat(calculateTotalProfit());
    return totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  };

  const formatCurrency = (amount) => {
    if (hideBalances) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const totalValue = parseFloat(calculateTotalValue());
  const totalProfit = parseFloat(calculateTotalProfit());
  const profitPercentage = calculateProfitPercentage();
  const isOverallProfit = totalProfit >= 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #e0f2fe)' }}>
      {/* Modern Header */}
      <div style={{ 
        background: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        borderBottom: '1px solid #e5e7eb',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DashboardIcon size={20} color="white" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  Portfolio Dashboard
                </h1>
                <p style={{ margin: 0, color: '#6b7280' }}>Track your investments</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setHideBalances(!hideBalances)}
                style={{
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={hideBalances ? "Show balances" : "Hide balances"}
              >
                {hideBalances ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
              <Link to="/buy">
                <button style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#2563eb';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#3b82f6';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  <ShoppingCartIcon size={16} color="white" />
                  Buy Stocks
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Summary Cards */}
        <Row gutter={24} style={{ marginBottom: '32px' }}>
          <Col span={8}>
            <Card style={{ 
              borderRadius: '12px', 
              border: '1px solid #f3f4f6',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <DollarIcon size={24} color="#3b82f6" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Total Value</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                    {formatCurrency(totalValue)}
                  </p>
                </div>
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card style={{ 
              borderRadius: '12px', 
              border: '1px solid #f3f4f6',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: isOverallProfit ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isOverallProfit ? 
                    <TrendingUpIcon size={24} color="#16a34a" /> : 
                    <TrendingDownIcon size={24} color="#dc2626" />
                  }
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Total P&L</p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: isOverallProfit ? '#16a34a' : '#dc2626' 
                  }}>
                    {isOverallProfit ? '+' : '-'}{formatCurrency(Math.abs(totalProfit))}
                  </p>
                </div>
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card style={{ 
              borderRadius: '12px', 
              border: '1px solid #f3f4f6',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PercentageIcon size={24} color="#8b5cf6" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Performance</p>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: isOverallProfit ? '#16a34a' : '#dc2626' 
                  }}>
                    {hideBalances ? '••••' : `${isOverallProfit ? '+' : ''}${profitPercentage.toFixed(2)}%`}
                  </p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Portfolio Section */}
        <Card style={{ 
          borderRadius: '12px', 
          border: '1px solid #f3f4f6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <Title level={3} style={{ margin: 0, color: '#1f2937' }}>Your Holdings</Title>
              <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Click on any stock to sell</p>
            </div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>
              {portfolio.length} position{portfolio.length !== 1 ? 's' : ''}
            </div>
          </div>

          <List
            grid={{ gutter: 24, column: 1 }}
            dataSource={portfolio}
            renderItem={(stock) => {
              const stockProfit = (stock.currentValue - stock.buyPrice) * stock.shares;
              const stockProfitPercentage = ((stock.currentValue - stock.buyPrice) / stock.buyPrice) * 100;
              const isStockProfit = stockProfit >= 0;

              return (
                <List.Item>
                  <Card
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                    onClick={() => handleStockClick(stock)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CompanyLogo symbol={stock.symbol} size={48} />
                        <div>
                          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                            {stock.symbol}
                          </h3>
                          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                            {stock.shares} shares
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                          {formatCurrency(stock.currentValue)}
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>per share</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isStockProfit ? 
                          <TrendingUpIcon size={16} color="#16a34a" /> : 
                          <TrendingDownIcon size={16} color="#dc2626" />
                        }
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: isStockProfit ? '#16a34a' : '#dc2626'
                        }}>
                          {isStockProfit ? '+' : '-'}{formatCurrency(Math.abs(stockProfit))}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: isStockProfit ? '#16a34a' : '#dc2626'
                        }}>
                          {hideBalances ? '••••' : `${isStockProfit ? '+' : ''}${stockProfitPercentage.toFixed(2)}%`}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ 
                      marginTop: '16px', 
                      paddingTop: '16px', 
                      borderTop: '1px solid #f3f4f6',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      <span>Total Value</span>
                      <span style={{ fontWeight: '500' }}>
                        {formatCurrency(stock.currentValue * stock.shares)}
                      </span>
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />

          {portfolio.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#f3f4f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <EmptyStateIcon size={32} color="#9ca3af" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>
                No investments yet
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Start building your portfolio by buying your first stock
              </p>
              <Link to="/buy">
                <button style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#2563eb';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#3b82f6';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  <ShoppingCartIcon size={16} color="white" />
                  Buy Your First Stock
                </button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Keep your existing modal */}
      {selectedStock && (
        <Modal
          title={`Sell ${selectedStock.symbol}`}
          visible={isModalVisible}
          onCancel={closeModal}
          footer={null}
        >
          <StockSellModal stock={selectedStock} closeModal={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default Dashboard;