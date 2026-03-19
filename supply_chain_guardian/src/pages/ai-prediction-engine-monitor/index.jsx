import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { predictionData, modelMetrics, featureImportance } from '../../data/sampleData';

const metricColor = (v, good = 85) => v >= good ? 'text-green-600' : v >= 70 ? 'text-amber-600' : 'text-red-600';

// Confusion matrix data
const confusionMatrix = [
  { label: 'True Positive',  value: 341, description: 'Correctly predicted disruptions',    color: 'bg-green-100 text-green-800' },
  { label: 'True Negative',  value: 781, description: 'Correctly predicted no disruption',  color: 'bg-green-100 text-green-800' },
  { label: 'False Positive', value: 62,  description: 'Predicted disruption, none occurred',color: 'bg-amber-100 text-amber-800' },
  { label: 'False Negative', value: 100, description: 'Missed actual disruptions',           color: 'bg-red-100 text-red-800' },
];

export default function AIPredictionEngineMonitor() {
  const [activeModel, setActiveModel] = useState('ensemble');
  const models = [
    { id: 'ensemble', label: 'Ensemble (Final)',  accuracy: 87.4, status: 'active' },
    { id: 'lstm',     label: 'LSTM Time-Series', accuracy: 84.1, status: 'active' },
    { id: 'gnn',      label: 'Graph Neural Net', accuracy: 82.7, status: 'active' },
    { id: 'xgb',      label: 'XGBoost',          accuracy: 80.2, status: 'standby' },
  ];
  const selected = models.find(m => m.id === activeModel);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 md:px-6 pb-20 lg:pb-6 max-w-7xl mx-auto">
        <div className="py-6">
          <h2 className="text-2xl font-bold text-foreground">AI Prediction Engine Monitor</h2>
          <p className="text-muted-foreground mt-1">Track model performance, accuracy metrics, and prediction confidence in real-time</p>
        </div>

        {/* Model Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {models.map(m => (
            <button key={m.id} onClick={() => setActiveModel(m.id)}
              className={`p-4 rounded-xl border text-left transition-smooth ${activeModel === m.id ? 'border-primary bg-blue-50' : 'border-border bg-card hover:bg-muted'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {m.status}
                </span>
                {activeModel === m.id && <Icon name="CheckCircle2" size={14} className="text-primary" />}
              </div>
              <p className="text-sm font-semibold text-foreground">{m.label}</p>
              <p className={`text-xl font-bold mt-1 ${metricColor(m.accuracy)}`}>{m.accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </button>
          ))}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Accuracy',   value: `${modelMetrics.accuracy}%`,   color: metricColor(modelMetrics.accuracy) },
            { label: 'Precision',  value: `${modelMetrics.precision}%`,  color: metricColor(modelMetrics.precision) },
            { label: 'Recall',     value: `${modelMetrics.recall}%`,     color: metricColor(modelMetrics.recall) },
            { label: 'F1 Score',   value: `${modelMetrics.f1Score}%`,    color: metricColor(modelMetrics.f1Score) },
            { label: 'AUC-ROC',    value: modelMetrics.auc,              color: 'text-green-600' },
            { label: 'Correct / Total', value: `${modelMetrics.correctPredictions}/${modelMetrics.totalPredictions}`, color: 'text-blue-600' },
          ].map(m => (
            <div key={m.label} className="bg-card rounded-xl border border-border p-4 shadow-level-1 text-center">
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Predicted vs Actual */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-1">Predicted vs Actual Disruptions</h3>
            <p className="text-xs text-muted-foreground mb-4">Weekly comparison over past 10 weeks</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predicted" name="AI Predicted" stroke="#1e40af" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="actual"    name="Actual"       stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Confidence chart */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-1">Prediction Confidence</h3>
            <p className="text-xs text-muted-foreground mb-4">Per-week confidence %</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis domain={[60,100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="confidence" name="Confidence %" fill="#1e40af" radius={[4,4,0,0]}>
                  {predictionData.map((entry, i) => (
                    <rect key={i} fill={entry.confidence >= 88 ? '#059669' : entry.confidence >= 80 ? '#1e40af' : '#d97706'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Feature Importance */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-1">Feature Importance</h3>
            <p className="text-xs text-muted-foreground mb-4">What drives the AI model's predictions</p>
            <div className="space-y-3">
              {featureImportance.map((f, i) => (
                <div key={f.feature}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground">{f.feature}</span>
                    <span className="font-semibold text-primary">{(f.importance * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${f.importance * 100}%`, opacity: 1 - i * 0.08 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confusion Matrix */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-1">Confusion Matrix Breakdown</h3>
            <p className="text-xs text-muted-foreground mb-4">Model classification results on test set (n={modelMetrics.totalPredictions})</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {confusionMatrix.map(c => (
                <div key={c.label} className={`p-4 rounded-xl ${c.color}`}>
                  <p className="text-2xl font-bold">{c.value}</p>
                  <p className="text-sm font-semibold">{c.label}</p>
                  <p className="text-xs opacity-75 mt-1">{c.description}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border text-sm text-muted-foreground">
              <p>Last trained: <span className="text-foreground font-medium">{modelMetrics.lastTrained}</span></p>
              <p className="mt-1">Architecture: <span className="text-foreground font-medium">LSTM + GNN Ensemble with XGBoost meta-learner</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
