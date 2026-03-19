import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ActionableRecommendationsCenter from './pages/actionable-recommendations-center';
import AIPredictionEngineMonitor from './pages/ai-prediction-engine-monitor';
import SupplyChainRiskDashboard from './pages/supply-chain-risk-dashboard';
import RiskAnalyticsAndTrends from './pages/risk-analytics-and-trends';
import MarketSentimentAnalysisDashboard from './pages/market-sentiment-analysis-dashboard';
import InteractiveSupplyChainNetworkMap from './pages/interactive-supply-chain-network-map';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ActionableRecommendationsCenter />} />
        <Route path="/actionable-recommendations-center" element={<ActionableRecommendationsCenter />} />
        <Route path="/ai-prediction-engine-monitor" element={<AIPredictionEngineMonitor />} />
        <Route path="/supply-chain-risk-dashboard" element={<SupplyChainRiskDashboard />} />
        <Route path="/risk-analytics-and-trends" element={<RiskAnalyticsAndTrends />} />
        <Route path="/market-sentiment-analysis-dashboard" element={<MarketSentimentAnalysisDashboard />} />
        <Route path="/interactive-supply-chain-network-map" element={<InteractiveSupplyChainNetworkMap />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
