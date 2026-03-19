import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import { recommendations } from '../../data/sampleData';

const priorityColor = { critical: '#dc2626', high: '#d97706', medium: '#2563eb', low: '#059669' };
const priorityBg    = { critical: 'bg-red-50 border-red-300', high: 'bg-amber-50 border-amber-300', medium: 'bg-blue-50 border-blue-300', low: 'bg-green-50 border-green-300' };
const priorityText  = { critical: 'text-red-700', high: 'text-amber-700', medium: 'text-blue-700', low: 'text-green-700' };
const statusBg      = { open: 'bg-blue-100 text-blue-700', 'in-progress': 'bg-amber-100 text-amber-700', completed: 'bg-green-100 text-green-700' };
const statusIcon    = { open: 'Circle', 'in-progress': 'Clock', completed: 'CheckCircle2' };

export default function ActionableRecommendationsCenter() {
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [statuses, setStatuses] = useState(
    Object.fromEntries(recommendations.map(r => [r.id, r.status]))
  );

  const filtered = recommendations.filter(r => {
    if (filter !== 'all' && r.priority !== filter) return false;
    if (statusFilter !== 'all' && statuses[r.id] !== statusFilter) return false;
    return true;
  });

  const counts = {
    open: recommendations.filter(r => statuses[r.id] === 'open').length,
    inProgress: recommendations.filter(r => statuses[r.id] === 'in-progress').length,
    completed: recommendations.filter(r => statuses[r.id] === 'completed').length,
  };

  const updateStatus = (id, newStatus) => setStatuses(prev => ({ ...prev, [id]: newStatus }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 px-4 md:px-6 pb-20 lg:pb-6 max-w-7xl mx-auto">
        <div className="py-6">
          <h2 className="text-2xl font-bold text-foreground">Actionable Recommendations Center</h2>
          <p className="text-muted-foreground mt-1">AI-generated mitigation strategies ranked by priority and business impact</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Total Actions', value: recommendations.length, color: 'bg-blue-50 text-blue-700' },
            { label: 'Critical', value: recommendations.filter(r=>r.priority==='critical').length, color: 'bg-red-50 text-red-700' },
            { label: 'High', value: recommendations.filter(r=>r.priority==='high').length, color: 'bg-amber-50 text-amber-700' },
            { label: 'Open', value: counts.open, color: 'bg-blue-50 text-blue-700' },
            { label: 'In Progress', value: counts.inProgress, color: 'bg-amber-50 text-amber-700' },
            { label: 'Completed', value: counts.completed, color: 'bg-green-50 text-green-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-4 text-center ${s.color} border-current border-opacity-20`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
            <span className="text-xs text-muted-foreground px-2 py-1 flex items-center">Priority:</span>
            {['all','critical','high','medium','low'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded text-xs font-medium capitalize transition-smooth ${filter === f ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>{f}</button>
            ))}
          </div>
          <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
            <span className="text-xs text-muted-foreground px-2 py-1 flex items-center">Status:</span>
            {['all','open','in-progress','completed'].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded text-xs font-medium capitalize transition-smooth ${statusFilter === f ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {filtered.map(rec => {
            const isOpen = expanded === rec.id;
            const status = statuses[rec.id];
            return (
              <div key={rec.id} className={`bg-card rounded-xl border-2 shadow-level-1 overflow-hidden transition-smooth ${priorityBg[rec.priority]}`}>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: priorityColor[rec.priority] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold uppercase ${priorityText[rec.priority]}`}>{rec.priority}</span>
                            <span className="text-xs text-muted-foreground">· {rec.category} · {rec.timeframe}</span>
                          </div>
                          <h4 className="text-base font-semibold text-foreground">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                        </div>
                        <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBg[status]}`}>
                          <Icon name={statusIcon[status]} size={11} />
                          <span className="capitalize">{status.replace('-',' ')}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Icon name="TrendingUp" size={14} className="text-green-600" />
                          <span className="text-green-700 font-medium">{rec.impact}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Icon name="Zap" size={14} /><span>Effort: {rec.effort}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <button onClick={() => setExpanded(isOpen ? null : rec.id)}
                          className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                          <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} size={14} />
                          {isOpen ? 'Hide steps' : 'View action steps'}
                        </button>
                        {status === 'open' && (
                          <button onClick={() => updateStatus(rec.id, 'in-progress')}
                            className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-smooth">Start Working</button>
                        )}
                        {status === 'in-progress' && (
                          <button onClick={() => updateStatus(rec.id, 'completed')}
                            className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-smooth">Mark Complete</button>
                        )}
                        {status === 'completed' && (
                          <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                            <Icon name="CheckCircle2" size={14} /> Done
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div className="border-t border-current border-opacity-20 bg-white bg-opacity-60 px-5 py-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Action Steps</p>
                    <ol className="space-y-2">
                      {rec.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold mt-0.5">{i+1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Icon name="CheckCircle2" size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">No recommendations match this filter</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}