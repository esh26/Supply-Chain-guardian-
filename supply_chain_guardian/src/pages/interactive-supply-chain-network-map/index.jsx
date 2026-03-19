import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import { networkNodes, networkEdges } from '../../data/sampleData';

const typeIcon  = { supplier: 'Package', manufacturer: 'Factory', warehouse: 'Warehouse', port: 'Anchor', customer: 'ShoppingCart' };
const typeColor = { supplier: '#3b82f6', manufacturer: '#8b5cf6', warehouse: '#f59e0b', port: '#06b6d4', customer: '#10b981' };
const riskColor = (r) => r >= 80 ? '#dc2626' : r >= 60 ? '#d97706' : r >= 40 ? '#2563eb' : '#059669';
const riskLabel = (r) => r >= 80 ? 'Critical' : r >= 60 ? 'High' : r >= 40 ? 'Medium' : 'Low';
const riskBg    = (r) => r >= 80 ? 'bg-red-100 text-red-700' : r >= 60 ? 'bg-amber-100 text-amber-700' : r >= 40 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';

// Simple SVG-based world map visualization
// Approximate lat/lng → SVG coords (cylindrical projection)
const toX = (lng) => ((lng + 180) / 360) * 900;
const toY = (lat) => ((90 - lat) / 180) * 480;

export default function InteractiveSupplyChainNetworkMap() {
  const [selected, setSelected] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  const selectedNode = networkNodes.find(n => n.id === selected);
  const connectedEdges = selected ? networkEdges.filter(e => e.source === selected || e.target === selected) : [];
  const connectedIds = new Set(connectedEdges.flatMap(e => [e.source, e.target]));

  const visibleNodes = networkNodes.filter(n => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (filterRisk === 'critical' && n.risk < 80) return false;
    if (filterRisk === 'high'     && (n.risk < 60 || n.risk >= 80)) return false;
    if (filterRisk === 'medium'   && (n.risk < 40 || n.risk >= 60)) return false;
    if (filterRisk === 'low'      && n.risk >= 40) return false;
    return true;
  });
  const visibleIds = new Set(visibleNodes.map(n => n.id));

  const stats = {
    total: networkNodes.length,
    critical: networkNodes.filter(n => n.risk >= 80).length,
    high:     networkNodes.filter(n => n.risk >= 60 && n.risk < 80).length,
    medium:   networkNodes.filter(n => n.risk >= 40 && n.risk < 60).length,
    low:      networkNodes.filter(n => n.risk < 40).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 md:px-6 pb-20 lg:pb-6 max-w-7xl mx-auto">
        <div className="py-6">
          <h2 className="text-2xl font-bold text-foreground">Interactive Supply Chain Network Map</h2>
          <p className="text-muted-foreground mt-1">Visualise your global supply chain and identify risk hotspots</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-3 mb-5">
          {[
            { label: 'Total Nodes', value: stats.total,    color: 'bg-blue-50 text-blue-700' },
            { label: 'Critical',    value: stats.critical, color: 'bg-red-50 text-red-700' },
            { label: 'High',        value: stats.high,     color: 'bg-amber-50 text-amber-700' },
            { label: 'Medium',      value: stats.medium,   color: 'bg-blue-50 text-blue-700' },
            { label: 'Low',         value: stats.low,      color: 'bg-green-50 text-green-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color} border-current border-opacity-20`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
            {['all','supplier','manufacturer','port','warehouse','customer'].map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded text-xs font-medium capitalize transition-smooth ${filterType === t ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
            {['all','critical','high','medium','low'].map(r => (
              <button key={r} onClick={() => setFilterRisk(r)}
                className={`px-3 py-1 rounded text-xs font-medium capitalize transition-smooth ${filterRisk === r ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* SVG Map */}
          <div className="lg:col-span-3 bg-card rounded-xl border border-border shadow-level-1 overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="font-medium text-sm text-foreground">Global Network View</span>
              <span className="text-xs text-muted-foreground">Click a node to see details</span>
            </div>
            <div className="relative bg-slate-900 overflow-auto" style={{ height: 440 }}>
              <svg width="900" height="480" viewBox="0 0 900 480" style={{ display: 'block' }}>
                {/* Simple world map background */}
                <rect width="900" height="480" fill="#0f172a" />
                {/* Ocean grid lines */}
                {[0,1,2,3,4,5,6].map(i => <line key={`h${i}`} x1="0" y1={i*80} x2="900" y2={i*80} stroke="#1e293b" strokeWidth="1"/>)}
                {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => <line key={`v${i}`} x1={i*75} y1="0" x2={i*75} y2="480" stroke="#1e293b" strokeWidth="1"/>)}
                {/* Continent silhouettes (simplified rectangles) */}
                <g opacity="0.15" fill="#64748b">
                  <ellipse cx="450" cy="220" rx="60" ry="90" /> {/* Europe */}
                  <ellipse cx="530" cy="260" rx="80" ry="70" /> {/* Asia */}
                  <ellipse cx="290" cy="230" rx="50" ry="60" /> {/* North America */}
                  <ellipse cx="330" cy="330" rx="35" ry="50" /> {/* South America */}
                  <ellipse cx="470" cy="310" rx="55" ry="50" /> {/* Africa */}
                  <ellipse cx="680" cy="330" rx="50" ry="35" /> {/* Australia */}
                </g>
                {/* Edges */}
                {networkEdges.map((e, i) => {
                  const src = networkNodes.find(n => n.id === e.source);
                  const tgt = networkNodes.find(n => n.id === e.target);
                  if (!src || !tgt) return null;
                  const isHighlighted = selected && (connectedIds.has(e.source) && connectedIds.has(e.target));
                  return (
                    <line key={i}
                      x1={toX(src.lng)} y1={toY(src.lat)}
                      x2={toX(tgt.lng)} y2={toY(tgt.lat)}
                      stroke={isHighlighted ? '#f59e0b' : '#334155'}
                      strokeWidth={isHighlighted ? 2.5 : 1}
                      strokeDasharray={isHighlighted ? "0" : "4 4"}
                      opacity={selected && !isHighlighted ? 0.2 : 0.8}
                    />
                  );
                })}
                {/* Nodes */}
                {visibleNodes.map(node => {
                  const x = toX(node.lng);
                  const y = toY(node.lat);
                  const isSelected = selected === node.id;
                  const isConnected = connectedIds.has(node.id);
                  const dim = selected && !isSelected && !isConnected;
                  return (
                    <g key={node.id} onClick={() => setSelected(selected === node.id ? null : node.id)}
                      style={{ cursor: 'pointer' }} opacity={dim ? 0.3 : 1}>
                      <circle cx={x} cy={y} r={isSelected ? 14 : 10} fill={riskColor(node.risk)} opacity={0.25} />
                      <circle cx={x} cy={y} r={isSelected ? 8 : 6} fill={riskColor(node.risk)} stroke={isSelected ? '#fff' : typeColor[node.type]} strokeWidth={isSelected ? 2 : 1} />
                      {(isSelected || isConnected) && (
                        <text x={x} y={y - 14} fill="white" fontSize="9" textAnchor="middle" fontWeight="500">{node.label}</text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            {/* Legend */}
            <div className="p-3 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Risk Level:</span>
              {[['Critical','#dc2626'],['High','#d97706'],['Medium','#2563eb'],['Low','#059669']].map(([l,c]) => (
                <span key={l} className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{background:c}}/>{l}</span>
              ))}
              <span className="ml-4 font-medium text-foreground">Type:</span>
              {Object.entries(typeColor).map(([t,c]) => (
                <span key={t} className="flex items-center gap-1 capitalize"><span className="w-3 h-3 rounded-full inline-block" style={{background:c}}/>{t}</span>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {selectedNode ? (
              <div className="bg-card rounded-xl border border-border p-5 shadow-level-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{selectedNode.label}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{selectedNode.type} · {selectedNode.country}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                    <Icon name="X" size={16} />
                  </button>
                </div>
                <div className={`inline-flex px-2 py-1 rounded text-xs font-semibold mb-4 ${riskBg(selectedNode.risk)}`}>
                  {riskLabel(selectedNode.risk)} Risk — {selectedNode.risk}/100
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${selectedNode.risk}%`, background: riskColor(selectedNode.risk) }} />
                </div>
                <div className="text-sm space-y-2">
                  <p className="text-muted-foreground">ID: <span className="text-foreground font-mono text-xs">{selectedNode.id}</span></p>
                  <p className="text-muted-foreground">Connections: <span className="text-foreground font-medium">{connectedEdges.length}</span></p>
                </div>
                {connectedEdges.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">CONNECTED TO</p>
                    <div className="space-y-2">
                      {connectedEdges.map((e, i) => {
                        const otherId = e.source === selectedNode.id ? e.target : e.source;
                        const other = networkNodes.find(n => n.id === otherId);
                        return other ? (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-foreground">{other.label}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${riskBg(other.risk)}`}>{other.risk}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-5 shadow-level-1 text-center">
                <Icon name="MousePointerClick" size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Click any node on the map to view its details and connections</p>
              </div>
            )}

            {/* Node List */}
            <div className="bg-card rounded-xl border border-border p-4 shadow-level-1">
              <p className="text-sm font-semibold text-foreground mb-3">Highest Risk Nodes</p>
              <div className="space-y-2">
                {[...networkNodes].sort((a,b) => b.risk - a.risk).slice(0,6).map(n => (
                  <button key={n.id} onClick={() => setSelected(n.id)}
                    className="w-full flex items-center justify-between text-xs hover:bg-muted p-2 rounded transition-smooth">
                    <span className="text-foreground truncate">{n.label}</span>
                    <span className={`ml-2 px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${riskBg(n.risk)}`}>{n.risk}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
