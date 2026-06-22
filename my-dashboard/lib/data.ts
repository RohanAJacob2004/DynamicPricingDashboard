export interface Product {
  id: string;
  name: string;
  units: number;
  expiryDate: string;
  predictedPrice: number;
  finalPrice: number;
  agent: string;
}

export interface PriceHistory {
  time: string;
  price: number;
}

export interface CalendarAgentData {
  skuId: string;
  productName: string;
  priceModifier: number;
  urgency: 'low' | 'medium' | 'high';
  currentEvent: string;
  justification: string;
  upcomingEvents: { date: string; event: string }[];
}

export const products: Product[] = [
  { id: 'SKU-1042', name: 'Cold Brew Coffee 12oz', units: 340, expiryDate: '2024-02-15', predictedPrice: 4.49, finalPrice: 3.99, agent: 'Season' },
  { id: 'SKU-2187', name: 'Organic Whole Milk 1L', units: 82, expiryDate: '2024-01-28', predictedPrice: 2.89, finalPrice: 2.59, agent: 'Inventory' },
  { id: 'SKU-3301', name: 'Greek Yogurt 500g', units: 215, expiryDate: '2024-02-02', predictedPrice: 3.99, finalPrice: 4.29, agent: 'Competitor' },
  { id: 'SKU-4450', name: 'Sparkling Water 6-pack', units: 560, expiryDate: '2024-06-30', predictedPrice: 5.99, finalPrice: 5.49, agent: 'Season' },
  { id: 'SKU-5019', name: 'Avocado 4-count', units: 45, expiryDate: '2024-01-25', predictedPrice: 3.29, finalPrice: 2.79, agent: 'Inventory' },
  { id: 'SKU-6122', name: 'Dark Roast Coffee 250g', units: 178, expiryDate: '2024-04-18', predictedPrice: 7.49, finalPrice: 7.99, agent: 'Competitor' },
  { id: 'SKU-7230', name: 'Almond Milk 1L', units: 290, expiryDate: '2024-03-11', predictedPrice: 3.49, finalPrice: 3.29, agent: 'Calendar' },
];

export const calendarAgentData: CalendarAgentData[] = [
  {
    skuId: 'SKU-7230',
    productName: 'Almond Milk 1L',
    priceModifier: -0.06,
    urgency: 'medium',
    currentEvent: 'Weekly Dairy Promo',
    justification: 'Almond Milk demand typically peaks mid-week. Slight reduction to capture early shoppers.',
    upcomingEvents: [
      { date: '2024-03-15', event: 'Sustainability Week' },
      { date: '2024-03-20', event: 'Plant-Based Sale' },
    ],
  },
];

export const priceHistory: PriceHistory[] = [
  { time: '12:00', price: 4.02 },
  { time: '12:10', price: 4.18 },
  { time: '12:20', price: 4.05 },
  { time: '12:30', price: 3.88 },
  { time: '12:40', price: 3.75 },
  { time: '12:50', price: 4.08 },
  { time: '13:00', price: 4.32 },
];

export const competitorAgentData: {
  skuId: string;
  productName: string;
  ourPrice: number;
  competitorPrice: number;
  justification: string;
  priceHistory: { time: string; ourPrice: number; competitorPrice: number }[];
}[] = [
    {
      skuId: 'SKU-1042',
      productName: 'Cold Brew Coffee 12oz',
      ourPrice: 3.99,
      competitorPrice: 4.29,
      justification: 'Competitor pricing at $4.29. Our price of $3.99 keeps us competitive while maintaining margin.',
      priceHistory: [
        { time: '12:00', ourPrice: 3.99, competitorPrice: 4.49 },
        { time: '12:10', ourPrice: 4.05, competitorPrice: 4.39 },
        { time: '12:20', ourPrice: 3.99, competitorPrice: 4.35 },
        { time: '12:30', ourPrice: 3.95, competitorPrice: 4.29 },
        { time: '12:40', ourPrice: 3.99, competitorPrice: 4.32 },
        { time: '12:50', ourPrice: 3.97, competitorPrice: 4.28 },
        { time: '13:00', ourPrice: 3.99, competitorPrice: 4.29 },
      ],
    },
    {
      skuId: 'SKU-2187',
      productName: 'Organic Whole Milk 1L',
      ourPrice: 2.59,
      competitorPrice: 2.79,
      justification: 'Competitor raised price to $2.79. Maintaining $2.59 to capture price-sensitive customers.',
      priceHistory: [
        { time: '12:00', ourPrice: 2.59, competitorPrice: 2.69 },
        { time: '12:10', ourPrice: 2.59, competitorPrice: 2.72 },
        { time: '12:20', ourPrice: 2.55, competitorPrice: 2.75 },
        { time: '12:30', ourPrice: 2.59, competitorPrice: 2.79 },
        { time: '12:40', ourPrice: 2.59, competitorPrice: 2.78 },
        { time: '12:50', ourPrice: 2.57, competitorPrice: 2.79 },
        { time: '13:00', ourPrice: 2.59, competitorPrice: 2.79 },
      ],
    },
  ];

export const inventoryAgentData: {
  skuId: string;
  productName: string;
  daysToExpire: number;
  unitsAtRisk: number;
  justification: string;
}[] = [
    {
      skuId: 'SKU-5019',
      productName: 'Avocado 4-count',
      daysToExpire: 2,
      unitsAtRisk: 45,
      justification: 'Avocados have high spoilage risk. Recommend markdown to $2.49 to clear stock within 48 hours.',
    },
    {
      skuId: 'SKU-2187',
      productName: 'Organic Whole Milk 1L',
      daysToExpire: 4,
      unitsAtRisk: 28,
      justification: 'Milk approaching expiry. Reduce price by 15% to accelerate turnover.',
    },
    {
      skuId: 'SKU-3301',
      productName: 'Greek Yogurt 500g',
      daysToExpire: 7,
      unitsAtRisk: 12,
      justification: 'Sufficient shelf life remaining. No immediate action needed.',
    },
  ];

export const seasonAgentData: {
  skuId: string;
  productName: string;
  priceModifier: number;
  urgency: string;
  weatherEvent: string;
  currentTemperature: number;
  justification: string;
  weatherAlerts: { date: string; alert: string }[];
}[] = [
    {
      skuId: 'SKU-1042',
      productName: 'Cold Brew Coffee 12oz',
      priceModifier: 0.08,
      urgency: 'high',
      weatherEvent: 'Heatwave',
      currentTemperature: 34,
      justification: 'Temperature forecast shows 34°C. Cold coffee demand expected to surge. Increase price by 8%.',
      weatherAlerts: [
        { date: '2024-01-25', alert: 'Heatwave warning: temperatures reaching 35°C' },
        { date: '2024-01-26', alert: 'High UV index expected' },
      ],
    },
    {
      skuId: 'SKU-4450',
      productName: 'Sparkling Water 6-pack',
      priceModifier: 0.05,
      urgency: 'medium',
      weatherEvent: 'Warm Spell',
      currentTemperature: 28,
      justification: 'Moderate temperature increase. Slight price uplift for refreshing beverages.',
      weatherAlerts: [
        { date: '2024-01-27', alert: 'Above-average temperatures expected' },
      ],
    },
  ];

export const revenueByCategory: { category: string; revenue: number }[] = [

  { category: 'Meat', revenue: 5000 },
  { category: 'Bakery', revenue: 5000 },

];

export const monthlySales: { month: string; sales: number }[] = [
  { month: 'Jan', sales: 4200 },
  { month: 'Feb', sales: 3800 },
  { month: 'Mar', sales: 5100 },
  { month: 'Apr', sales: 4600 },
  { month: 'May', sales: 5400 },
  { month: 'Jun', sales: 6100 },
  { month: 'Jul', sales: 5800 },
  { month: 'Aug', sales: 6300 },
  { month: 'Sep', sales: 5900 },
  { month: 'Oct', sales: 6700 },
  { month: 'Nov', sales: 7200 },
  { month: 'Dec', sales: 8100 },
];

export const getNextRunData = (currentProducts: Product[]): Product[] => {
  return currentProducts.map(p => ({
    ...p,
    finalPrice: +(p.finalPrice * (0.95 + Math.random() * 0.1)).toFixed(2)
  }));
};
