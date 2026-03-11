// MarketPulse Educational Project
// Mock AI Responses - Real AI coming soon

export async function analyzeMarket(
  userQuestion: string,
  marketContext: object = {}
) {
  // Simulate AI thinking delay
  await new Promise(resolve => 
    setTimeout(resolve, 1500));
  
  const question = userQuestion.toLowerCase();
  
  if (question.includes('sector')) {
    return `📊 Sector Performance Analysis

- Technology leads this week with +3.2% growth
- Healthcare shows -1.1% decline
- Retail gaining +1.7% on strong spending
- Energy faces -2.4% headwinds

💡 Recommended: Sector Heatmap
⚠️ Educational analysis only.
Not financial advice.`;
  }
  
  if (question.includes('apple') || 
      question.includes('tesla') ||
      question.includes('company')) {
    return `📈 Company Analysis

- Strong revenue growth of +18% year over year
- Demand score at 87/100 above sector average
- Profit margins improving for 3 quarters
- Key risk: increasing competition in markets

💡 Recommended: Line Chart
⚠️ Educational analysis only.                                   
Not financial advice.`;
  }
  
  if (question.includes('product') || 
      question.includes('demand')) {
    return `🛍️ Product Demand Insights

- AI Chips seeing highest demand surge +34%
- EV Batteries up +28% on incentives
- Organic Food growing steadily +12%
- Luxury Watches dropped -8%

💡 Recommended: Area Chart
⚠️ Educational analysis only.
Not financial advice.`;
  }
  
  return `📊 Market Analysis

- Markets showing cautious optimism today
- Technology and Retail sectors leading gains
- Demand trends favor AI and clean energy
- Monitor currency fluctuations for impact

💡 Recommended: Dashboard Overview
⚠️ Educational analysis only.
Not financial advice.`;
}

export async function generateMarketSummary(
  marketData: object = {}
) {
  // Simulate loading delay
  await new Promise(resolve => 
    setTimeout(resolve, 1000));
    
  return `Today's market shows cautious optimism 
with technology sector leading gains at +3.2%. 
Consumer demand remains strong across key product 
categories especially AI and clean energy segments. 
Monitor energy sector volatility for broader 
market impact in coming sessions.
⚠️ Educational analysis only. Not financial advice.`;
}
