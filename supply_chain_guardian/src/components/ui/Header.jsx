import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/supply-chain-risk-dashboard',
      icon: 'BarChart3',
      tooltip: 'Real-time risk overview and alerts'
    },
    {
      label: 'Network Map',
      path: '/interactive-supply-chain-network-map',
      icon: 'Network',
      tooltip: 'Interactive supply chain visualization'
    },
    {
      label: 'Risk Analytics',
      path: '/risk-analytics-and-trends',
      icon: 'TrendingUp',
      tooltip: 'Historical trends and predictions'
    },
    {
      label: 'Market Intelligence',
      path: '/market-sentiment-analysis-dashboard',
      icon: 'Globe',
      tooltip: 'External market factors analysis'
    }
  ];

  const secondaryItems = [
    {
      label: 'AI Monitor',
      path: '/ai-prediction-engine-monitor',
      icon: 'Brain',
      tooltip: 'AI model performance and health'
    },
    {
      label: 'Recommendations',
      path: '/actionable-recommendations-center',
      icon: 'Target',
      tooltip: 'Actionable mitigation strategies'
    }
  ];

  const mockAlerts = [
    { id: 1, type: 'critical', message: 'Supplier disruption detected in Southeast Asia', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'Weather alert affecting logistics routes', time: '15 min ago' },
    { id: 3, type: 'info', message: 'New market intelligence data available', time: '1 hour ago' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      default: return 'Info';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      default: return 'text-primary';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-level-1">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Shield" size={20} color="white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">Supply Chain Guardian</h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            );
          })}
          
          {/* More Menu with Secondary Items */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              className="ml-2"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            >
              More
            </Button>

            {moreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-level-3 z-50">
                <div className="p-2 space-y-1">
                  {secondaryItems?.map((item) => {
                    const isActive = location?.pathname === item?.path;
                    return (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path)}
                        className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                        title={item?.tooltip}
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Alerts */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="Bell"
              onClick={() => setAlertsOpen(!alertsOpen)}
              className="relative"
            >
              {mockAlerts?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                  {mockAlerts?.length}
                </span>
              )}
            </Button>

            {alertsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-level-3 z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Alerts</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {mockAlerts?.map((alert) => (
                    <div key={alert?.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted transition-smooth">
                      <div className="flex items-start space-x-3">
                        <Icon name={getAlertIcon(alert?.type)} size={16} className={getAlertColor(alert?.type)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-popover-foreground">{alert?.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert?.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" fullWidth>
                    View All Alerts
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">John Smith</p>
              <p className="text-xs text-muted-foreground">Risk Manager</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          />
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border shadow-level-2">
          <div className="px-4 py-2 space-y-1">
            {[...navigationItems, ...secondaryItems]?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-level-2 z-40">
        <div className="flex items-center justify-around py-2">
          {[...navigationItems?.slice(0, 2), ...secondaryItems?.slice(0, 2)]?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span className="text-xs font-medium">{item?.label?.split(' ')?.[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Overlay for mobile alerts and more menu */}
      {(alertsOpen || moreMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-20"
          onClick={() => {
            setAlertsOpen(false);
            setMoreMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;