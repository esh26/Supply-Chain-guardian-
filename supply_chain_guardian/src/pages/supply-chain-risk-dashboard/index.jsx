import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { kpiData, riskTrendData, alertsData, riskBreakdownData } from '../../data/sampleData';

const severityColor = { critical: '#dc2626', high: '#d97706', medium: '#2563eb', low: '#059669' };
const severityBg   = { critical: 'bg-red-50 border-red-200', high: 'bg-amber-50 border-amber-200', medium: 'bg-blue-50 border-blue-200', low: 'bg-green-50 border-green-200' };
const severityText = { critical: 'text-red-700', high: 'text-amber-700', medium: 'text-blue-700', low: 'text-green-700' };
const kpiColorMap  = { primary: 'bg-blue-50 text-blue-700', error: 'bg-red-50 text-red-700', warning: 'bg-amber-50 text-amber-700', success: 'bg-green-50 text-green-700' };
const PIE_COLORS   = ['#dc2626','#d97706','#2563eb','#059669'];

export default function SupplyChainRiskDashboard() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? alertsData : alertsData.filter(a => a.severity === filter);
  const critCount = alertsData.filter(a => a.severity === 'critical').length;
  const highCount = alertsData.filter(a => a.severity === 'high').length;

  const pieData = [
    { name: 'Critical', value: critCount },
    { name: 'High',     value: highCount },
    { name: 'Medium',   value: alertsData.filter(a => a.severity === 'medium').length },
    { name: 'Low',      value: alertsData.filter(a => a.severity === 'low').length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 md:px-6 pb-20 lg:pb-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="py-6">
          <h2 className="text-2xl font-bold text-foreground">Supply Chain Risk Dashboard</h2>
          <p className="text-muted-foreground mt-1">Real-time overview of disruption risks across your supply network</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {kpiData.map((kpi) => (
            <div key={kpi.label} className="bg-card rounded-xl border border-border p-4 shadow-level-1">
              <div className={`inline-flex p-2 rounded-lg mb-3 ${kpiColorMap[kpi.color]}`}>
                <Icon name={kpi.icon} size={18} />
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}{kpi.unit}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              <p className={`text-xs font-medium mt-1 ${kpi.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {kpi.change > 0 ? '▲' : '▼'} {Math.abs(kpi.change)} vs last month
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Risk Trend Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-4">Risk Score Trends (12 Months)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="overallRisk"      name="Overall"      stroke="#1e40af" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="supplierRisk"     name="Supplier"     stroke="#dc2626" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="logisticsRisk"    name="Logistics"    stroke="#d97706" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="geopoliticalRisk" name="Geopolitical" stroke="#059669" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Alert Distribution Pie */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-4">Alert Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {pieData.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-muted-foreground">{p.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Breakdown Bar Chart */}
          <div className="lg:col-span-1 bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-4">Risk by Category</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={riskBreakdownData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="score" name="Risk Score" fill="#1e40af" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts Feed */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-level-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Live Alerts</h3>
              <div className="flex gap-2">
                {['all','critical','high','medium','low'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2 py-1 rounded text-xs font-medium capitalize transition-smooth ${
                      filter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-border'
                    }`}
                  >{f}</button>
                ))}
              </div>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {filtered.map(alert => (
                <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${severityBg[alert.severity]}`}>
                  <Icon name="AlertTriangle" size={16} color={severityColor[alert.severity]} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold uppercase ${severityText[alert.severity]}`}>{alert.severity}</span>
                      <span className="text-xs text-muted-foreground">{alert.category}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
