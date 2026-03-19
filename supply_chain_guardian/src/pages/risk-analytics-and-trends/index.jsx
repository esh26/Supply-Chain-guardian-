import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { riskTrendData, riskBreakdownData, suppliersData } from '../../data/sampleData';

const riskColor = (r) => r >= 80 ? 'text-red-600' : r >= 60 ? 'text-amber-600' : r >= 40 ? 'text-blue-600' : 'text-green-600';
const riskBg    = (r) => r >= 80 ? 'bg-red-100 text-red-700' : r >= 60 ? 'bg-amber-100 text-amber-700' : r >= 40 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';

const radarData = [
  { subject: 'Supplier', A: 74 },
  { subject: 'Logistics', A: 68 },
  { subject: 'Geo-Political', A: 61 },
  { subject: 'Weather', A: 55 },
  { subject: 'Financial', A: 48 },
  { subject: 'Cyber', A: 42 },
];

export default function RiskAnalyticsAndTrends() {
  const [sortCol, setSortCol] = useState('riskScore');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = [...suppliersData].sort((a,b) => sortDir === 'desc' ? b[sortCol] - a[sortCol] : a[sortCol] - b[sortCol]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 md:px-6 pb-20 lg:pb-6 max-w-7xl mx-auto">
        <div className="py-6">
          <h2 className="text-2xl font-bold text-foreground">Risk Analytics & Trends</h2>
          <p className="text-muted-foreground mt-1">Deep-dive analysis of risk patterns, supplier performance, and prediction trends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Area Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-4">Risk Score — 12 Month Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="gOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gSupplier" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0,100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="overallRisk"  name="Overall"  stroke="#1e40af" fill="url(#gOverall)"  strokeWidth={2} />
                <Area type="monotone" dataKey="supplierRisk" name="Supplier" stroke="#dc2626" fill="url(#gSupplier)" strokeWidth={2} />
                <Area type="monotone" dataKey="logisticsRisk" name="Logistics" stroke="#d97706" fill="none" strokeWidth={2} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-4">Risk Radar</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fontSize: 9 }} />
                <Radar name="Risk" dataKey="A" stroke="#1e40af" fill="#1e40af" fillOpacity={0.25} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <div className="bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-4">Risk Score by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={riskBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis domain={[0,100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Risk Score" fill="#1e40af" radius={[4,4,0,0]} />
                <Bar dataKey="incidents" name="Incidents" fill="#d97706" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-4">Month-over-Month Risk Change</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0,100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="geopoliticalRisk" name="Geopolitical" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="logisticsRisk"    name="Logistics"    stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier Table */}
        <div className="bg-card rounded-xl border border-border shadow-level-1">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Supplier Risk Analysis</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Click column headers to sort</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  {[
                    { key: 'name',      label: 'Supplier' },
                    { key: 'country',   label: 'Country' },
                    { key: 'tier',      label: 'Tier' },
                    { key: 'category',  label: 'Category' },
                    { key: 'riskScore', label: 'Risk Score' },
                    { key: 'onTime',    label: 'On-Time %' },
                    { key: 'spend',     label: 'Spend ($M)' },
                  ].map(col => (
                    <th key={col.key} onClick={() => handleSort(col.key)}
                      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase cursor-pointer hover:text-foreground select-none">
                      {col.label} {sortCol === col.key && (sortDir === 'desc' ? '▼' : '▲')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => (
                  <tr key={s.id} className={`border-t border-border hover:bg-muted/50 transition-smooth ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.country}</td>
                    <td className="px-4 py-3 text-muted-foreground">Tier {s.tier}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-1.5 w-16">
                          <div className="h-1.5 rounded-full" style={{ width: `${s.riskScore}%`, background: s.riskScore >= 80 ? '#dc2626' : s.riskScore >= 60 ? '#d97706' : '#2563eb' }} />
                        </div>
                        <span className={`font-semibold ${riskColor(s.riskScore)}`}>{s.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={s.onTime >= 90 ? 'text-green-600 font-medium' : s.onTime >= 75 ? 'text-amber-600' : 'text-red-600 font-medium'}>{s.onTime}%</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">${s.spend}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
