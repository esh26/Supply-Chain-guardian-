"""
Supply Chain Guardian — Model Training Script
Run: python train_models.py

Generates synthetic training data and trains all three models.
Saves model checkpoints to: ml_models/checkpoints/
"""

import numpy as np
import os, json, random
from datetime import datetime

CHECKPOINT_DIR = os.path.join(os.path.dirname(__file__), "checkpoints")
os.makedirs(CHECKPOINT_DIR, exist_ok=True)

# ──────────────────────────────────────────────────────────────────────────────
#  Generate Synthetic Training Data
# ──────────────────────────────────────────────────────────────────────────────
def generate_training_data(n_samples=2000, random_seed=42):
    """
    Generate synthetic supply chain data for training.

    Features (7):
      0: lead_time_days (normalised to 0-100)
      1: geopolitical_index (0-100)
      2: weather_severity (0-100)
      3: port_congestion (0-100)
      4: inventory_risk (0-100, inverse of buffer days)
      5: currency_volatility (0-100)
      6: demand_forecast_error (0-100)

    Label: 1 = disruption occurred, 0 = no disruption

    ─── HOW TO ADD YOUR OWN REAL DATA ─────────────────────────────────────────
    Replace this function with code that reads your CSV/Excel file, e.g.:

        import pandas as pd
        df = pd.read_csv("your_data.csv")
        X = df[["lead_time_days","geopolitical_index", ...]].values
        X[:, 0] = np.clip(X[:, 0] / 90 * 100, 0, 100)  # normalise lead time
        y = df["disruption_occurred"].values  # 0 or 1
        return X.astype(np.float32), y.astype(np.float32)
    ───────────────────────────────────────────────────────────────────────────
    """
    np.random.seed(random_seed)

    X = np.zeros((n_samples, 7), dtype=np.float32)
    y = np.zeros(n_samples, dtype=np.float32)

    for i in range(n_samples):
        # Simulate different supplier risk profiles
        profile = random.choice(["low_risk", "medium_risk", "high_risk"])

        if profile == "low_risk":
            X[i] = [
                np.random.uniform(5, 30),    # lead time
                np.random.uniform(5, 35),    # geopolitical
                np.random.uniform(5, 30),    # weather
                np.random.uniform(10, 40),   # port congestion
                np.random.uniform(5, 30),    # inventory risk (buffer good)
                np.random.uniform(5, 25),    # currency
                np.random.uniform(5, 20),    # demand error
            ]
        elif profile == "medium_risk":
            X[i] = [
                np.random.uniform(30, 60),
                np.random.uniform(30, 65),
                np.random.uniform(25, 60),
                np.random.uniform(30, 65),
                np.random.uniform(25, 60),
                np.random.uniform(20, 55),
                np.random.uniform(15, 45),
            ]
        else:  # high_risk
            X[i] = [
                np.random.uniform(60, 100),
                np.random.uniform(60, 100),
                np.random.uniform(55, 100),
                np.random.uniform(60, 100),
                np.random.uniform(55, 100),
                np.random.uniform(50, 100),
                np.random.uniform(40, 100),
            ]

        # Label: weighted risk formula + noise
        weights = np.array([0.24, 0.19, 0.16, 0.14, 0.12, 0.09, 0.06])
        risk_score = np.dot(X[i], weights)
        prob = 1 / (1 + np.exp(-0.05 * (risk_score - 45)))
        y[i] = 1.0 if np.random.random() < prob else 0.0

    print(f"[Data] Generated {n_samples} samples — {int(y.sum())} disruptions ({100*y.mean():.1f}%)")
    return X, y

# ──────────────────────────────────────────────────────────────────────────────
#  Train XGBoost (sklearn GBT)
# ──────────────────────────────────────────────────────────────────────────────
def train_xgboost(X_train, y_train, X_test, y_test):
    print("\n[1/3] Training XGBoost (GradientBoostingClassifier)...")
    try:
        from sklearn.ensemble import GradientBoostingClassifier
        from sklearn.metrics import accuracy_score, f1_score, roc_auc_score
        import pickle

        model = GradientBoostingClassifier(
            n_estimators=150, learning_rate=0.08,
            max_depth=4, subsample=0.8, random_state=42
        )
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]

        metrics = {
            "accuracy": round(accuracy_score(y_test, y_pred) * 100, 2),
            "f1_score": round(f1_score(y_test, y_pred) * 100, 2),
            "auc_roc":  round(roc_auc_score(y_test, y_prob), 4),
        }
        print(f"  Accuracy: {metrics['accuracy']}%  F1: {metrics['f1_score']}%  AUC: {metrics['auc_roc']}")

        # Save checkpoint
        path = os.path.join(CHECKPOINT_DIR, "xgboost_model.pkl")
        with open(path, "wb") as f:
            pickle.dump(model, f)
        print(f"  Saved: {path}")
        return metrics

    except ImportError:
        print("  scikit-learn not installed. Run: pip install scikit-learn")
        return {}

# ──────────────────────────────────────────────────────────────────────────────
#  Train LSTM (PyTorch)
# ──────────────────────────────────────────────────────────────────────────────
def train_lstm(X_train, y_train, X_test, y_test):
    print("\n[2/3] Training LSTM (PyTorch)...")
    try:
        import torch
        import torch.nn as nn
        from torch.utils.data import TensorDataset, DataLoader
        import sys
        sys.path.insert(0, os.path.dirname(__file__))
        from models import LSTMPredictor

        SEQ_LEN = 12
        EPOCHS  = 20
        BATCH   = 64
        LR      = 0.001

        # Create sequences: repeat each sample SEQ_LEN times (simplified)
        def make_sequences(X):
            seqs = np.stack([X] * SEQ_LEN, axis=1)  # (N, SEQ_LEN, 7)
            noise = np.random.randn(*seqs.shape).astype(np.float32) * 3
            return seqs + noise

        X_seq_train = make_sequences(X_train)
        X_seq_test  = make_sequences(X_test)

        train_ds = TensorDataset(torch.FloatTensor(X_seq_train), torch.FloatTensor(y_train))
        test_ds  = TensorDataset(torch.FloatTensor(X_seq_test),  torch.FloatTensor(y_test))
        train_dl = DataLoader(train_ds, batch_size=BATCH, shuffle=True)

        model = LSTMPredictor(input_size=7, hidden_size=64, num_layers=2)
        optimizer = torch.optim.Adam(model.parameters(), lr=LR)
        criterion = nn.BCELoss()

        for epoch in range(EPOCHS):
            model.train()
            total_loss = 0
            for xb, yb in train_dl:
                optimizer.zero_grad()
                pred = model(xb).squeeze(-1)
                loss = criterion(pred, yb)
                loss.backward()
                optimizer.step()
                total_loss += loss.item()
            if (epoch + 1) % 5 == 0:
                print(f"  Epoch {epoch+1}/{EPOCHS} — Loss: {total_loss/len(train_dl):.4f}")

        # Eval
        model.eval()
        with torch.no_grad():
            xb = torch.FloatTensor(X_seq_test)
            probs = model(xb).squeeze(-1).numpy()
            preds = (probs > 0.5).astype(int)

        acc = (preds == y_test.astype(int)).mean() * 100
        print(f"  Test Accuracy: {acc:.2f}%")

        path = os.path.join(CHECKPOINT_DIR, "lstm_model.pt")
        torch.save(model.state_dict(), path)
        print(f"  Saved: {path}")
        return {"accuracy": round(acc, 2)}

    except ImportError:
        print("  PyTorch not installed. Run: pip install torch")
        return {}

# ──────────────────────────────────────────────────────────────────────────────
#  Train GNN (PyTorch)
# ──────────────────────────────────────────────────────────────────────────────
def train_gnn(X_train, y_train, X_test, y_test):
    print("\n[3/3] Training GNN (PyTorch)...")
    try:
        import torch
        import torch.nn as nn
        import sys
        sys.path.insert(0, os.path.dirname(__file__))
        from models import GNNRiskPropagator

        EPOCHS = 30
        LR     = 0.005
        N_FEAT = 5

        # Use first 5 features for graph node representation
        X_tr_gnn = X_train[:, :N_FEAT]
        X_te_gnn = X_test[:,  :N_FEAT]

        # Create a fixed adjacency (each sample is an isolated node for simplicity)
        adj = torch.eye(1)  # single node, self-connection

        model = GNNRiskPropagator(node_feature_dim=N_FEAT, hidden_dim=32)
        optimizer = torch.optim.Adam(model.parameters(), lr=LR)
        criterion = nn.BCELoss()

        for epoch in range(EPOCHS):
            model.train()
            total_loss = 0
            for i in range(len(X_tr_gnn)):
                optimizer.zero_grad()
                nf = torch.FloatTensor(X_tr_gnn[i:i+1])
                label = torch.FloatTensor([[y_train[i]]])
                pred = model(nf, adj)
                loss = criterion(pred, label)
                loss.backward()
                optimizer.step()
                total_loss += loss.item()
            if (epoch + 1) % 10 == 0:
                print(f"  Epoch {epoch+1}/{EPOCHS} — Loss: {total_loss/len(X_tr_gnn):.4f}")

        # Eval
        model.eval()
        correct = 0
        with torch.no_grad():
            for i in range(len(X_te_gnn)):
                nf = torch.FloatTensor(X_te_gnn[i:i+1])
                prob = model(nf, adj).item()
                if round(prob) == int(y_test[i]):
                    correct += 1
        acc = correct / len(X_te_gnn) * 100
        print(f"  Test Accuracy: {acc:.2f}%")

        path = os.path.join(CHECKPOINT_DIR, "gnn_model.pt")
        torch.save(model.state_dict(), path)
        print(f"  Saved: {path}")
        return {"accuracy": round(acc, 2)}

    except ImportError:
        print("  PyTorch not installed. Run: pip install torch")
        return {}

# ──────────────────────────────────────────────────────────────────────────────
#  Main
# ──────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  Supply Chain Guardian — Model Training")
    print("=" * 55)

    # Generate data
    X, y = generate_training_data(n_samples=2000)

    # Train/test split (80/20)
    split = int(len(X) * 0.8)
    idx   = np.random.permutation(len(X))
    X_train, y_train = X[idx[:split]], y[idx[:split]]
    X_test,  y_test  = X[idx[split:]], y[idx[split:]]
    print(f"[Data] Train: {len(X_train)} | Test: {len(X_test)}")

    # Train all models
    xgb_metrics  = train_xgboost(X_train, y_train, X_test, y_test)
    lstm_metrics = train_lstm(X_train, y_train, X_test, y_test)
    gnn_metrics  = train_gnn(X_train, y_train, X_test, y_test)

    # Save training summary
    summary = {
        "trained_at": datetime.utcnow().isoformat(),
        "n_samples": len(X),
        "xgboost":  xgb_metrics,
        "lstm":     lstm_metrics,
        "gnn":      gnn_metrics,
    }
    summary_path = os.path.join(CHECKPOINT_DIR, "training_summary.json")
    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)

    print(f"\n[Done] Training complete. Summary saved to: {summary_path}")
    print("=" * 55)
