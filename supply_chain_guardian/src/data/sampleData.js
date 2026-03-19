// ============================================================
//  SUPPLY CHAIN GUARDIAN — SAMPLE DATA
//  Edit this file to change what appears in the dashboards.
//  Every section is clearly labelled.
// ============================================================

// ── 1. KPI SUMMARY CARDS (top of Risk Dashboard) ──────────────
export const kpiData = [
  { label: "Active Suppliers",    value: 248,   change: +3,   unit: "",   icon: "Building2",  color: "primary" },
  { label: "High Risk Alerts",    value: 12,    change: +4,   unit: "",   icon: "AlertTriangle", color: "error"  },
  { label: "Avg. Risk Score",     value: 67,    change: -5,   unit: "%",  icon: "TrendingUp", color: "warning" },
  { label: "On-Time Delivery",    value: 83,    change: -2,   unit: "%",  icon: "Truck",      color: "success" },
  { label: "Disruption Events",   value: 7,     change: +2,   unit: "",   icon: "Zap",        color: "warning" },
  { label: "Mitigation Actions",  value: 34,    change: +10,  unit: "",   icon: "Shield",     color: "primary" },
];

// ── 2. RISK TREND OVER TIME (line chart on Risk Dashboard) ────
//    months: last 12 months of risk scores (0-100)
export const riskTrendData = [
  { month: "Apr",  overallRisk: 42, supplierRisk: 38, logisticsRisk: 45, geopoliticalRisk: 30 },
  { month: "May",  overallRisk: 48, supplierRisk: 44, logisticsRisk: 50, geopoliticalRisk: 35 },
  { month: "Jun",  overallRisk: 45, supplierRisk: 40, logisticsRisk: 48, geopoliticalRisk: 38 },
  { month: "Jul",  overallRisk: 55, supplierRisk: 52, logisticsRisk: 55, geopoliticalRisk: 45 },
  { month: "Aug",  overallRisk: 60, supplierRisk: 58, logisticsRisk: 62, geopoliticalRisk: 50 },
  { month: "Sep",  overallRisk: 58, supplierRisk: 55, logisticsRisk: 60, geopoliticalRisk: 55 },
  { month: "Oct",  overallRisk: 65, supplierRisk: 63, logisticsRisk: 67, geopoliticalRisk: 60 },
  { month: "Nov",  overallRisk: 70, supplierRisk: 68, logisticsRisk: 72, geopoliticalRisk: 65 },
  { month: "Dec",  overallRisk: 72, supplierRisk: 70, logisticsRisk: 74, geopoliticalRisk: 68 },
  { month: "Jan",  overallRisk: 68, supplierRisk: 65, logisticsRisk: 70, geopoliticalRisk: 62 },
  { month: "Feb",  overallRisk: 65, supplierRisk: 62, logisticsRisk: 67, geopoliticalRisk: 58 },
  { month: "Mar",  overallRisk: 67, supplierRisk: 64, logisticsRisk: 69, geopoliticalRisk: 61 },
];

// ── 3. RECENT ALERTS (alert feed on Risk Dashboard) ───────────
export const alertsData = [
  {
    id: 1,
    severity: "critical",
    title: "Supplier Disruption — Southeast Asia",
    description: "Factory shutdowns reported across 3 Tier-1 suppliers in Vietnam due to flooding.",
    timestamp: "2 min ago",
    category: "Supplier",
    affectedNodes: ["VN-SUP-01", "VN-SUP-04", "VN-SUP-07"],
  },
  {
    id: 2,
    severity: "high",
    title: "Port Congestion — Shanghai",
    description: "Average container dwell time has increased to 14 days at Shanghai port.",
    timestamp: "18 min ago",
    category: "Logistics",
    affectedNodes: ["CN-PORT-SH"],
  },
  {
    id: 3,
    severity: "high",
    title: "Semiconductor Shortage — Tier 2",
    description: "Key microcontroller components facing 20-week lead-time extension.",
    timestamp: "45 min ago",
    category: "Inventory",
    affectedNodes: ["TW-SUP-02", "KR-SUP-05"],
  },
  {
    id: 4,
    severity: "medium",
    title: "Weather Alert — US Midwest Logistics",
    description: "Winter storms forecast to delay highway freight in 6 US states for 3–5 days.",
    timestamp: "1 hr ago",
    category: "Weather",
    affectedNodes: ["US-DC-CHI", "US-DC-DET"],
  },
  {
    id: 5,
    severity: "medium",
    title: "Geopolitical Tension — Suez Alternative Route",
    description: "Increased vessel diversions adding 9–12 days to Europe–Asia transit times.",
    timestamp: "3 hrs ago",
    category: "Geopolitical",
    affectedNodes: ["ROUTE-SUEZ"],
  },
  {
    id: 6,
    severity: "low",
    title: "Currency Fluctuation — JPY/USD",
    description: "JPY depreciation by 4.2% may increase Japan sourcing costs.",
    timestamp: "5 hrs ago",
    category: "Financial",
    affectedNodes: ["JP-SUP-03"],
  },
];

// ── 4. SUPPLY CHAIN NETWORK MAP NODES ─────────────────────────
//    type: "supplier" | "manufacturer" | "warehouse" | "port" | "customer"
//    risk: 0-100
export const networkNodes = [
  // Suppliers
  { id: "VN-SUP-01", label: "VN Supplier A", type: "supplier",      country: "Vietnam",      risk: 92, lat: 10.8, lng: 106.6 },
  { id: "VN-SUP-04", label: "VN Supplier B", type: "supplier",      country: "Vietnam",      risk: 85, lat: 16.0, lng: 108.2 },
  { id: "TW-SUP-02", label: "TW Semi Corp",  type: "supplier",      country: "Taiwan",       risk: 75, lat: 25.0, lng: 121.5 },
  { id: "KR-SUP-05", label: "KR Electronics",type: "supplier",      country: "South Korea",  risk: 68, lat: 37.5, lng: 127.0 },
  { id: "JP-SUP-03", label: "JP Precision",  type: "supplier",      country: "Japan",        risk: 45, lat: 35.7, lng: 139.7 },
  { id: "IN-SUP-08", label: "IN Textiles",   type: "supplier",      country: "India",        risk: 55, lat: 19.0, lng: 72.8  },
  { id: "DE-SUP-06", label: "DE Auto Parts", type: "supplier",      country: "Germany",      risk: 30, lat: 51.5, lng: 9.9   },
  // Manufacturers
  { id: "CN-MFG-01", label: "Shanghai Plant",type: "manufacturer",  country: "China",        risk: 70, lat: 31.2, lng: 121.5 },
  { id: "MX-MFG-01", label: "Mexico Plant",  type: "manufacturer",  country: "Mexico",       risk: 40, lat: 20.6, lng: -103.4},
  { id: "US-MFG-01", label: "Texas Plant",   type: "manufacturer",  country: "USA",          risk: 25, lat: 29.7, lng: -95.4 },
  // Ports
  { id: "CN-PORT-SH",label: "Shanghai Port", type: "port",          country: "China",        risk: 80, lat: 31.3, lng: 121.8 },
  { id: "SG-PORT-01",label: "Singapore Port",type: "port",          country: "Singapore",    risk: 35, lat: 1.3,  lng: 103.8 },
  { id: "US-PORT-LA",label: "LA Port",       type: "port",          country: "USA",          risk: 45, lat: 33.7, lng: -118.3},
  { id: "NL-PORT-RT",label: "Rotterdam Port",type: "port",          country: "Netherlands",  risk: 30, lat: 51.9, lng: 4.5   },
  // Warehouses / Distribution
  { id: "US-DC-CHI", label: "Chicago DC",    type: "warehouse",     country: "USA",          risk: 55, lat: 41.9, lng: -87.6 },
  { id: "US-DC-DET", label: "Detroit DC",    type: "warehouse",     country: "USA",          risk: 50, lat: 42.3, lng: -83.0 },
  { id: "UK-DC-LON", label: "London DC",     type: "warehouse",     country: "UK",           risk: 28, lat: 51.5, lng: -0.1  },
  // Customers
  { id: "US-CUST-01",label: "US Retail",     type: "customer",      country: "USA",          risk: 20, lat: 40.7, lng: -74.0 },
  { id: "EU-CUST-01",label: "EU Retail",     type: "customer",      country: "Germany",      risk: 22, lat: 52.5, lng: 13.4  },
];

export const networkEdges = [
  { source: "VN-SUP-01", target: "CN-MFG-01", label: "Components" },
  { source: "VN-SUP-04", target: "CN-MFG-01", label: "Components" },
  { source: "TW-SUP-02", target: "CN-MFG-01", label: "Semiconductors" },
  { source: "KR-SUP-05", target: "CN-MFG-01", label: "Displays" },
  { source: "JP-SUP-03", target: "CN-MFG-01", label: "Precision Parts" },
  { source: "IN-SUP-08", target: "MX-MFG-01", label: "Textiles" },
  { source: "DE-SUP-06", target: "MX-MFG-01", label: "Auto Parts" },
  { source: "CN-MFG-01", target: "CN-PORT-SH", label: "Finished Goods" },
  { source: "CN-PORT-SH", target: "US-PORT-LA", label: "Ocean Freight" },
  { source: "CN-PORT-SH", target: "SG-PORT-01", label: "Trans-ship" },
  { source: "SG-PORT-01", target: "NL-PORT-RT", label: "Ocean Freight" },
  { source: "US-PORT-LA", target: "US-MFG-01",  label: "Inbound" },
  { source: "MX-MFG-01",  target: "US-MFG-01",  label: "Sub-Assembly" },
  { source: "US-MFG-01",  target: "US-DC-CHI",  label: "Distribution" },
  { source: "US-MFG-01",  target: "US-DC-DET",  label: "Distribution" },
  { source: "NL-PORT-RT", target: "UK-DC-LON",  label: "Inbound" },
  { source: "US-DC-CHI",  target: "US-CUST-01", label: "Last Mile" },
  { source: "US-DC-DET",  target: "US-CUST-01", label: "Last Mile" },
  { source: "UK-DC-LON",  target: "EU-CUST-01", label: "Last Mile" },
];

// ── 5. RISK BREAKDOWN BY CATEGORY (bar chart) ─────────────────
export const riskBreakdownData = [
  { category: "Supplier",     score: 74, incidents: 18 },
  { category: "Logistics",    score: 68, incidents: 12 },
  { category: "Geopolitical", score: 61, incidents: 8  },
  { category: "Weather",      score: 55, incidents: 14 },
  { category: "Financial",    score: 48, incidents: 6  },
  { category: "Cyber",        score: 42, incidents: 4  },
  { category: "Compliance",   score: 35, incidents: 3  },
];

// ── 6. AI MODEL PREDICTION DATA ───────────────────────────────
//    Shows the AI model's predictions vs actual disruptions
export const predictionData = [
  { week: "W1",  predicted: 3,  actual: 2,  confidence: 88 },
  { week: "W2",  predicted: 5,  actual: 6,  confidence: 82 },
  { week: "W3",  predicted: 4,  actual: 4,  confidence: 91 },
  { week: "W4",  predicted: 7,  actual: 5,  confidence: 79 },
  { week: "W5",  predicted: 6,  actual: 7,  confidence: 85 },
  { week: "W6",  predicted: 8,  actual: 9,  confidence: 77 },
  { week: "W7",  predicted: 5,  actual: 4,  confidence: 90 },
  { week: "W8",  predicted: 9,  actual: 8,  confidence: 83 },
  { week: "W9",  predicted: 6,  actual: 6,  confidence: 92 },
  { week: "W10", predicted: 11, actual: 10, confidence: 86 },
];

// AI Model performance metrics
export const modelMetrics = {
  accuracy:   87.4,   // %
  precision:  84.1,   // %
  recall:     89.2,   // %
  f1Score:    86.6,   // %
  auc:        0.923,
  lastTrained: "2025-03-08",
  totalPredictions: 1284,
  correctPredictions: 1122,
};

// Feature importance (what the AI looks at most)
export const featureImportance = [
  { feature: "Supplier Lead Time",       importance: 0.24 },
  { feature: "Geopolitical Risk Index",  importance: 0.19 },
  { feature: "Weather Severity Score",   importance: 0.16 },
  { feature: "Port Congestion Level",    importance: 0.14 },
  { feature: "Inventory Buffer Days",    importance: 0.12 },
  { feature: "Currency Volatility",      importance: 0.09 },
  { feature: "Demand Forecast Error",    importance: 0.06 },
];

// ── 7. MARKET SENTIMENT DATA ──────────────────────────────────
export const sentimentData = [
  { date: "Mar 1",  positive: 42, negative: 28, neutral: 30 },
  { date: "Mar 2",  positive: 38, negative: 35, neutral: 27 },
  { date: "Mar 3",  positive: 45, negative: 25, neutral: 30 },
  { date: "Mar 4",  positive: 40, negative: 32, neutral: 28 },
  { date: "Mar 5",  positive: 35, negative: 40, neutral: 25 },
  { date: "Mar 6",  positive: 30, negative: 45, neutral: 25 },
  { date: "Mar 7",  positive: 33, negative: 42, neutral: 25 },
  { date: "Mar 8",  positive: 37, negative: 38, neutral: 25 },
  { date: "Mar 9",  positive: 41, negative: 33, neutral: 26 },
  { date: "Mar 10", positive: 44, negative: 30, neutral: 26 },
  { date: "Mar 11", positive: 39, negative: 35, neutral: 26 },
];

export const newsItems = [
  {
    id: 1,
    headline: "Vietnam flooding disrupts electronics manufacturing supply chains",
    source: "Reuters",
    sentiment: "negative",
    relevance: 95,
    timestamp: "30 min ago",
    tags: ["Vietnam", "Flooding", "Electronics"],
  },
  {
    id: 2,
    headline: "TSMC announces capacity expansion to ease semiconductor shortage",
    source: "Bloomberg",
    sentiment: "positive",
    relevance: 88,
    timestamp: "2 hrs ago",
    tags: ["Semiconductors", "TSMC", "Capacity"],
  },
  {
    id: 3,
    headline: "Red Sea shipping diversions push container rates to 6-month high",
    source: "FT",
    sentiment: "negative",
    relevance: 92,
    timestamp: "3 hrs ago",
    tags: ["Shipping", "Red Sea", "Freight Rates"],
  },
  {
    id: 4,
    headline: "US-China tariff negotiations show progress, analysts say",
    source: "WSJ",
    sentiment: "positive",
    relevance: 80,
    timestamp: "5 hrs ago",
    tags: ["Trade", "US-China", "Tariffs"],
  },
  {
    id: 5,
    headline: "Global PMI shows manufacturing contraction for second straight month",
    source: "Economist",
    sentiment: "negative",
    relevance: 74,
    timestamp: "6 hrs ago",
    tags: ["PMI", "Manufacturing", "Global"],
  },
];

// ── 8. ACTIONABLE RECOMMENDATIONS ────────────────────────────
export const recommendations = [
  {
    id: 1,
    priority: "critical",
    title: "Activate Alternative Suppliers for Vietnam Components",
    description: "Flooding has disrupted 3 Tier-1 suppliers. Immediately onboard backup suppliers in Thailand and Indonesia.",
    impact: "Prevents ~$4.2M in delayed production costs",
    effort: "High",
    timeframe: "24–48 hours",
    category: "Supplier",
    steps: [
      "Contact Thailand backup suppliers TH-SUP-09 and TH-SUP-11",
      "Expedite qualification process using pre-approved vendor list",
      "Issue emergency purchase orders for 60-day safety stock",
      "Arrange air freight for critical components to bridge gap",
    ],
    status: "open",
  },
  {
    id: 2,
    priority: "high",
    title: "Reroute Shanghai Shipments via Busan Transhipment",
    description: "Port congestion at Shanghai is causing 14-day delays. Redirect volume through Busan port in South Korea.",
    impact: "Recovers 8–10 days of transit time",
    effort: "Medium",
    timeframe: "3–5 days",
    category: "Logistics",
    steps: [
      "Notify forwarder to redirect bookings from Shanghai to Busan",
      "Arrange inland transport to Busan for current in-transit cargo",
      "Update shipment tracking and notify downstream DCs",
    ],
    status: "in-progress",
  },
  {
    id: 3,
    priority: "high",
    title: "Increase Safety Stock for Semiconductor Components",
    description: "Lead times extended by 20 weeks. Increase inventory buffer to 16 weeks for critical SKUs.",
    impact: "Avoids $2.1M in potential production stoppages",
    effort: "Medium",
    timeframe: "1–2 weeks",
    category: "Inventory",
    steps: [
      "Identify top 50 critical semiconductor SKUs",
      "Place blanket orders with TW-SUP-02 and KR-SUP-05",
      "Negotiate price protection clauses for 6-month horizon",
    ],
    status: "open",
  },
  {
    id: 4,
    priority: "medium",
    title: "Pre-position Midwest Inventory Before Winter Storm",
    description: "Weather forecast shows 3–5 days disruption. Pre-position stock at Chicago and Detroit DCs.",
    impact: "Maintains 98%+ service level through disruption",
    effort: "Low",
    timeframe: "24 hours",
    category: "Weather",
    steps: [
      "Advance 2 days of outbound orders from DC to customers",
      "Alert regional carriers to expedite pending deliveries",
    ],
    status: "completed",
  },
  {
    id: 5,
    priority: "medium",
    title: "Hedge Currency Exposure for Japan Sourcing",
    description: "JPY depreciation adds 4.2% cost. Consider 3-month forward contracts to lock exchange rates.",
    impact: "Saves ~$380K in currency hedging",
    effort: "Low",
    timeframe: "This week",
    category: "Financial",
    steps: [
      "Engage treasury team for forward contract assessment",
      "Evaluate JPY exposure across all Japan suppliers",
      "Execute FX hedging for next 90 days of JP procurement",
    ],
    status: "open",
  },
];

// ── 9. SUPPLIER TABLE DATA ─────────────────────────────────────
export const suppliersData = [
  { id: "VN-SUP-01", name: "Vietnam Mfg A",    country: "Vietnam",     tier: 1, riskScore: 92, category: "Electronics",  onTime: 54, spend: 8.2  },
  { id: "VN-SUP-04", name: "Vietnam Mfg B",    country: "Vietnam",     tier: 1, riskScore: 85, category: "Electronics",  onTime: 62, spend: 5.7  },
  { id: "TW-SUP-02", name: "Taiwan Semi Corp", country: "Taiwan",      tier: 1, riskScore: 75, category: "Semiconductors",onTime: 71, spend: 12.4 },
  { id: "KR-SUP-05", name: "Korea Electronics",country: "South Korea", tier: 1, riskScore: 68, category: "Displays",     onTime: 78, spend: 9.1  },
  { id: "JP-SUP-03", name: "Japan Precision",  country: "Japan",       tier: 1, riskScore: 45, category: "Precision",    onTime: 91, spend: 6.3  },
  { id: "IN-SUP-08", name: "India Textiles",   country: "India",       tier: 2, riskScore: 55, category: "Textiles",     onTime: 83, spend: 3.2  },
  { id: "DE-SUP-06", name: "Germany Auto",     country: "Germany",     tier: 2, riskScore: 30, category: "Auto Parts",   onTime: 96, spend: 4.8  },
  { id: "US-SUP-10", name: "US Chemicals",     country: "USA",         tier: 2, riskScore: 22, category: "Chemicals",    onTime: 98, spend: 2.1  },
  { id: "BR-SUP-07", name: "Brazil Raw Mats",  country: "Brazil",      tier: 3, riskScore: 48, category: "Raw Materials", onTime: 88, spend: 1.9  },
  { id: "TH-SUP-09", name: "Thailand Backup",  country: "Thailand",    tier: 2, riskScore: 35, category: "Electronics",  onTime: 90, spend: 1.5  },
];
