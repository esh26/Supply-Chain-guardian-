# 🛡️ Supply Chain Guardian — Complete Project Guide

## What This Project Does
An AI-powered web dashboard that **predicts and monitors supply chain disruptions** using:
- Real-time risk dashboards and alerts
- Interactive global supply chain network map
- ML models (LSTM + GNN + XGBoost ensemble) for disruption prediction
- Market sentiment analysis from news feeds
- Actionable AI-generated recommendations

---

## 🗂️ Project Structure

```
supply_chain_guardian_all_done/
│
├── supply_chain_guardian/          ← React Frontend
│   └── src/
│       ├── data/
│       │   └── sampleData.js      ← ✏️  EDIT THIS to change dashboard data
│       ├── pages/
│       │   ├── supply-chain-risk-dashboard/
│       │   ├── interactive-supply-chain-network-map/
│       │   ├── risk-analytics-and-trends/
│       │   ├── market-sentiment-analysis-dashboard/
│       │   ├── ai-prediction-engine-monitor/
│       │   └── actionable-recommendations-center/
│       └── components/ui/Header.jsx
│
├── backend/
│   ├── app.py                      ← Flask API server
│   ├── requirements.txt
│   └── data/
│       └── supply_chain_data.json  ← ✏️  EDIT THIS to change backend data
│
└── ml_models/
    ├── models.py                   ← LSTM + GNN + XGBoost definitions
    ├── train_models.py             ← Training script
    └── requirements.txt
```

---

## 🚀 How to Run

### Step 1 — Run the Frontend

```bash
cd supply_chain_guardian
npm install
npm run start
# Opens at http://localhost:5173
```

### Step 2 — Run the Backend (separate terminal)

```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs at http://localhost:5000
```

### Step 3 — Train the ML Models (optional for demo)

```bash
cd ml_models
pip install -r requirements.txt
python train_models.py
# Saves trained models to ml_models/checkpoints/
```

---

## ✏️ HOW TO CHANGE THE SAMPLE DATA

### Frontend Data (what you see in charts and tables)

Open this file:
```
supply_chain_guardian/src/data/sampleData.js
```

It has clearly labelled sections. Here's what each section controls:

| Section | What it changes |
|---|---|
| `kpiData` | The 6 number cards at the top of the Risk Dashboard |
| `riskTrendData` | The line chart showing 12 months of risk scores |
| `alertsData` | The alerts feed (title, description, severity) |
| `networkNodes` | Dots on the Supply Chain Network Map |
| `networkEdges` | Lines/connections between the map dots |
| `riskBreakdownData` | Bar chart showing risk by category |
| `predictionData` | Predicted vs Actual chart in AI Monitor |
| `modelMetrics` | Accuracy, Precision, Recall, F1 score |
| `featureImportance` | The horizontal bars showing what AI looks at |
| `sentimentData` | The sentiment area chart (positive/negative/neutral) |
| `newsItems` | The news feed cards in Market Intelligence |
| `recommendations` | The action cards in Recommendations Center |
| `suppliersData` | The sortable supplier table in Risk Analytics |

### Example — Change a KPI value:

```js
// In sampleData.js, find kpiData and edit:
{ label: "Active Suppliers", value: 248, change: +3, ... }
//                                   ^^^— change this number
```

### Example — Add a new alert:

```js
// In sampleData.js, add to alertsData:
{
  id: 7,
  severity: "high",           // "critical" | "high" | "medium" | "low"
  title: "Your Alert Title",
  description: "What happened",
  timestamp: "Just now",
  category: "Supplier",       // any category label
  affectedNodes: ["NODE-ID"],
},
```

### Example — Add a supplier to the map:

```js
// In sampleData.js, add to networkNodes:
{
  id: "MY-SUP-11",
  label: "My New Supplier",
  type: "supplier",          // "supplier"|"manufacturer"|"warehouse"|"port"|"customer"
  country: "Malaysia",
  risk: 65,                  // 0-100 (higher = more red on map)
  lat: 3.1,
  lng: 101.7
},
```

### Backend Data (API server data)

Open this file:
```
backend/data/supply_chain_data.json
```

Add suppliers and alerts directly in JSON format.

### ML Training Data

Open `ml_models/train_models.py` and find the `generate_training_data()` function.
Replace it with code that reads your own CSV file — instructions are inside the file.

---

## 🌐 API Endpoints (Backend)

| Method | URL | Description |
|---|---|---|
| GET | `/api/health` | Server health check |
| GET | `/api/suppliers` | List all suppliers |
| POST | `/api/suppliers` | Add a new supplier |
| GET | `/api/alerts` | Get all alerts |
| POST | `/api/alerts` | Add a new alert |
| POST | `/api/risk-score` | Calculate risk score from features |
| POST | `/api/predict` | Get disruption prediction (ML model) |
| GET | `/api/sentiment` | Get news sentiment data |
| GET | `/api/dashboard-summary` | Get KPI summary |

### Example — Call the prediction API:

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": "VN-SUP-01",
    "features": {
      "lead_time_days": 75,
      "geopolitical_index": 85,
      "weather_severity": 90,
      "port_congestion": 80,
      "inventory_buffer_days": 10,
      "currency_volatility": 60,
      "demand_forecast_error": 40
    }
  }'
```

---

## 🤖 ML Models

| Model | Type | Purpose |
|---|---|---|
| LSTM | Recurrent Neural Net | Time-series disruption prediction |
| GNN | Graph Neural Network | Risk propagation through supply chain graph |
| XGBoost | Gradient Boosted Trees | Tabular feature risk scoring |
| Ensemble | Weighted average | Final prediction (LSTM 40% + GNN 35% + XGB 25%) |

---

## 📊 6 Dashboard Pages

1. **Supply Chain Risk Dashboard** — KPIs, risk trend chart, live alerts
2. **Interactive Network Map** — Click nodes to see risk scores and connections
3. **Risk Analytics & Trends** — Deep-dive supplier table, radar chart, area charts
4. **Market Sentiment** — News feed with NLP sentiment, macro indicators
5. **AI Prediction Engine Monitor** — Model accuracy, predicted vs actual, feature importance
6. **Actionable Recommendations** — Prioritised action items you can mark as complete
