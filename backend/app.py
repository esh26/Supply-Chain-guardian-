"""
Supply Chain Guardian — Flask Backend
Run: python app.py
API runs on http://localhost:5000
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json, os, random, math
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# ─── In-memory store (replace with SQLite/PostgreSQL for production) ───────────
DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "supply_chain_data.json")

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE) as f:
            return json.load(f)
    return {"suppliers": [], "alerts": [], "predictions": []}

def save_data(data):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

# ─── Health Check ──────────────────────────────────────────────────────────────
@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat(), "version": "1.0.0"})

# ─── Suppliers ─────────────────────────────────────────────────────────────────
@app.route("/api/suppliers", methods=["GET"])
def get_suppliers():
    data = load_data()
    return jsonify(data.get("suppliers", []))

@app.route("/api/suppliers/<supplier_id>", methods=["GET"])
def get_supplier(supplier_id):
    data = load_data()
    supplier = next((s for s in data.get("suppliers", []) if s["id"] == supplier_id), None)
    if not supplier:
        return jsonify({"error": "Supplier not found"}), 404
    return jsonify(supplier)

@app.route("/api/suppliers", methods=["POST"])
def add_supplier():
    """Add a new supplier. Body: {id, name, country, tier, riskScore, category, onTime, spend}"""
    payload = request.json
    required = ["id", "name", "country", "tier", "riskScore"]
    missing = [k for k in required if k not in payload]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400
    data = load_data()
    data.setdefault("suppliers", []).append(payload)
    save_data(data)
    return jsonify({"message": "Supplier added", "supplier": payload}), 201

# ─── Alerts ────────────────────────────────────────────────────────────────────
@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    severity = request.args.get("severity")
    data = load_data()
    alerts = data.get("alerts", [])
    if severity:
        alerts = [a for a in alerts if a.get("severity") == severity]
    return jsonify(alerts)

@app.route("/api/alerts", methods=["POST"])
def add_alert():
    """Add a new alert. Body: {severity, title, description, category}"""
    payload = request.json
    payload["id"] = len(load_data().get("alerts", [])) + 1
    payload["timestamp"] = datetime.utcnow().isoformat()
    data = load_data()
    data.setdefault("alerts", []).append(payload)
    save_data(data)
    return jsonify({"message": "Alert added", "alert": payload}), 201

# ─── Risk Score Calculation ────────────────────────────────────────────────────
@app.route("/api/risk-score", methods=["POST"])
def calculate_risk():
    """
    Calculate risk score for a supplier or route.
    Body: {
        lead_time_days: int,        # e.g. 45
        geopolitical_index: float,  # 0-100
        weather_severity: float,    # 0-100
        port_congestion: float,     # 0-100
        inventory_buffer_days: int, # e.g. 30
        currency_volatility: float  # 0-100
    }
    """
    body = request.json or {}

    # Feature weights (match feature importance from ML model)
    weights = {
        "lead_time_days":       0.24,
        "geopolitical_index":   0.19,
        "weather_severity":     0.16,
        "port_congestion":      0.14,
        "inventory_buffer_days":0.12,
        "currency_volatility":  0.09,
    }

    # Normalise inputs to 0-100 scale
    lead_time   = min(100, body.get("lead_time_days", 30) / 90 * 100)
    geo         = body.get("geopolitical_index", 50)
    weather     = body.get("weather_severity", 30)
    port        = body.get("port_congestion", 40)
    inventory   = max(0, 100 - body.get("inventory_buffer_days", 30) / 90 * 100)  # less buffer = higher risk
    currency    = body.get("currency_volatility", 20)

    score = (
        lead_time   * weights["lead_time_days"] +
        geo         * weights["geopolitical_index"] +
        weather     * weights["weather_severity"] +
        port        * weights["port_congestion"] +
        inventory   * weights["inventory_buffer_days"] +
        currency    * weights["currency_volatility"]
    )

    # Add random noise for demo realism
    score = min(100, max(0, score + random.uniform(-3, 3)))

    level = "critical" if score >= 80 else "high" if score >= 60 else "medium" if score >= 40 else "low"

    return jsonify({
        "risk_score": round(score, 1),
        "risk_level": level,
        "breakdown": {
            "lead_time_contribution":    round(lead_time * weights["lead_time_days"], 1),
            "geopolitical_contribution": round(geo * weights["geopolitical_index"], 1),
            "weather_contribution":      round(weather * weights["weather_severity"], 1),
            "port_contribution":         round(port * weights["port_congestion"], 1),
            "inventory_contribution":    round(inventory * weights["inventory_buffer_days"], 1),
            "currency_contribution":     round(currency * weights["currency_volatility"], 1),
        },
        "recommendation": _get_recommendation(level),
        "timestamp": datetime.utcnow().isoformat()
    })

def _get_recommendation(level):
    recs = {
        "critical": "Immediate action required. Activate backup suppliers and escalate to management.",
        "high": "Monitor closely. Prepare contingency plans and review inventory buffers.",
        "medium": "Increased monitoring recommended. Review supplier contracts.",
        "low": "Continue standard monitoring. No immediate action needed."
    }
    return recs[level]

# ─── Disruption Prediction (ML placeholder) ───────────────────────────────────
@app.route("/api/predict", methods=["POST"])
def predict_disruption():
    """
    Predict disruption probability for the next 4 weeks.
    Body: {supplier_id: str, features: {lead_time_days, geopolitical_index, ...}}
    This uses a simple logistic-style formula as a placeholder.
    In production, load your trained PyTorch/sklearn model here.
    """
    body = request.json or {}
    supplier_id = body.get("supplier_id", "UNKNOWN")
    features = body.get("features", {})

    # Simple sigmoid-based prediction (replace with real model.predict())
    risk_raw = (
        features.get("lead_time_days", 30) * 0.008 +
        features.get("geopolitical_index", 50) * 0.006 +
        features.get("weather_severity", 30) * 0.005 +
        features.get("port_congestion", 40) * 0.004 +
        random.uniform(-5, 5)
    )
    prob = 1 / (1 + math.exp(-0.1 * (risk_raw - 35)))  # sigmoid

    weekly_predictions = []
    for week in range(1, 5):
        noise = random.uniform(-0.05, 0.05)
        weekly_prob = min(1.0, max(0.0, prob + noise + week * 0.01))
        weekly_predictions.append({
            "week": f"Week {week}",
            "disruption_probability": round(weekly_prob, 3),
            "confidence": round(random.uniform(0.78, 0.94), 2),
            "predicted_disruptions": max(0, round(weekly_prob * 10))
        })

    return jsonify({
        "supplier_id": supplier_id,
        "overall_disruption_probability": round(prob, 3),
        "risk_level": "critical" if prob > 0.8 else "high" if prob > 0.6 else "medium" if prob > 0.4 else "low",
        "weekly_forecast": weekly_predictions,
        "model_version": "ensemble-v1.0",
        "timestamp": datetime.utcnow().isoformat()
    })

# ─── Market Sentiment ──────────────────────────────────────────────────────────
@app.route("/api/sentiment", methods=["GET"])
def get_sentiment():
    """Returns 11 days of mock sentiment data (replace with real NLP pipeline)."""
    days = []
    base_pos, base_neg = 40, 32
    for i in range(11):
        date = (datetime.utcnow() - timedelta(days=10-i)).strftime("%b %d")
        pos = max(20, min(65, base_pos + random.randint(-8, 8)))
        neg = max(15, min(55, base_neg + random.randint(-8, 8)))
        neu = 100 - pos - neg
        days.append({"date": date, "positive": pos, "negative": neg, "neutral": max(5, neu)})
    return jsonify(days)

# ─── Dashboard Summary ─────────────────────────────────────────────────────────
@app.route("/api/dashboard-summary", methods=["GET"])
def dashboard_summary():
    return jsonify({
        "kpis": {
            "active_suppliers": 248,
            "high_risk_alerts": 12,
            "avg_risk_score": 67,
            "on_time_delivery_pct": 83,
            "disruption_events": 7,
            "mitigation_actions": 34
        },
        "model_accuracy": 87.4,
        "last_updated": datetime.utcnow().isoformat()
    })

# ─── Main ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  Supply Chain Guardian — Backend API")
    print("  Running at: http://localhost:5000")
    print("  Endpoints:")
    print("    GET  /api/health")
    print("    GET  /api/suppliers")
    print("    POST /api/suppliers")
    print("    GET  /api/alerts")
    print("    POST /api/alerts")
    print("    POST /api/risk-score")
    print("    POST /api/predict")
    print("    GET  /api/sentiment")
    print("    GET  /api/dashboard-summary")
    print("=" * 55)
    app.run(debug=True, port=5000)
