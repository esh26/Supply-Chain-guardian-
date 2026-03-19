import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { sentimentData, newsItems } from '../../data/sampleData';

const sentimentColor = { positive: 'text-green-600', negative: 'text-red-600', neutral: 'text-blue-600' };
const sentimentBg    = { positive: 'bg-green-50 border-green-200 text-green-700', negative: 'bg-red-50 border-red-200 text-red-700', neutral: 'bg-blue-50 border-blue-200 text-blue-700' };
const sentimentIcon  = { positive: 'TrendingUp', negative: 'TrendingDown', neutral: 'Minus' };

const macroIndicators = [
  { label: 'Global PMI',          value: '48.2', change: '-0.8', trend: 'down',    note: 'Contraction territory' },
  { label: 'Freight Rate Index',  value: '2,841', change: '+12%', trend: 'up',   note: '6-month high' },
  { label: 'Oil Price (Brent)',   value: '$88.4', change: '+3.2%', trend: 'up',  note: 'Elevated, adds logistics cost' },
  { label: 'USD/CNY',             value: '7.24',  change: '+0.8%', trend: 'up',  note: 'CNY weakening slightly' },
  { label: 'Baltic Dry Index',    value: '1,623', change: '-4.1%', trend: 'down', note: 'Bulk commodity demand soft' },
  { label: 'ISM Mfg Index',       value: '49.1',  change: '+1.1',  trend: 'up',  note: 'Near neutral' },
];

export default function MarketSentimentAnalysisDashboard() {
  const [activeTag, setActiveTag] = useState('all');
  const allTags = ['all', ...new Set(newsItems.flatMap(n => n.tags))];
  const filtered = activeTag === 'all' ? newsItems : newsItems.filter(n => n.tags.includes(activeTag));

  // Sentiment summary from data
  const latest = sentimentData[sentimentData.length - 1];
  const dominant = latest.positive > latest.negative ? 'Cautiously Positive' : 'Negative';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 md:px-6 pb-20 lg:pb-6 max-w-7xl mx-auto">
        <div className="py-6">
          <h2 className="text-2xl font-bold text-foreground">Market Sentiment Analysis</h2>
          <p className="text-muted-foreground mt-1">External intelligence: news sentiment, macro indicators, and market signals</p>
        </div>

        {/* Macro Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {macroIndicators.map(m => (
            <div key={m.label} className="bg-card rounded-xl border border-border p-4 shadow-level-1">
              <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
              <p className="text-xl font-bold text-foreground">{m.value}</p>
              <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${m.trend === 'up' ? 'text-amber-600' : 'text-blue-600'}`}>
                <Icon name={m.trend === 'up' ? 'ArrowUp' : 'ArrowDown'} size={10} />
                {m.change}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{m.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Sentiment Area Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-level-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">News Sentiment (11 Days)</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700`}>
                Overall: {dominant}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={sentimentData}>
                <defs>
                  <linearGradient id="gPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/><stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="positive" name="Positive" stroke="#059669" fill="url(#gPos)" strokeWidth={2} />
                <Area type="monotone" dataKey="negative" name="Negative" stroke="#dc2626" fill="url(#gNeg)" strokeWidth={2} />
                <Area type="monotone" dataKey="neutral"  name="Neutral"  stroke="#2563eb" fill="none"       strokeWidth={1.5} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sentiment Today */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-level-1">
            <h3 className="font-semibold text-foreground mb-4">Today's Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Positive', value: latest.positive, color: '#059669', bg: 'bg-green-50 text-green-700' },
                { label: 'Negative', value: latest.negative, color: '#dc2626', bg: 'bg-red-50 text-red-700' },
                { label: 'Neutral',  value: latest.neutral,  color: '#2563eb', bg: 'bg-blue-50 text-blue-700' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-xs ${s.bg}`}>{s.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">NEWS VOLUME TODAY</p>
              <p className="text-2xl font-bold text-foreground">142 <span className="text-sm font-normal text-muted-foreground">articles</span></p>
              <p className="text-xs text-muted-foreground mt-1">↑ 18% vs yesterday</p>
            </div>
          </div>
        </div>

        {/* News Feed */}
        <div className="bg-card rounded-xl border border-border shadow-level-1">
          <div className="p-5 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Intelligence Feed</h3>
              <span className="text-xs text-muted-foreground">Auto-analysed via NLP</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-smooth capitalize ${
                    activeTag === tag ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-border'
                  }`}>{tag}</button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map(item => (
              <div key={item.id} className="p-5 hover:bg-muted/30 transition-smooth">
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${sentimentBg[item.sentiment]}`}>
                    <Icon name={sentimentIcon[item.sentiment]} size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-medium text-foreground leading-snug">{item.headline}</p>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-muted-foreground">{item.source}</p>
                        <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs font-medium capitalize ${sentimentColor[item.sentiment]}`}>{item.sentiment}</span>
                      <span className="text-xs text-muted-foreground">Relevance: {item.relevance}%</span>
                      <div className="flex gap-1">
                        {item.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.5 bg-muted rounded text-xs text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
