import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Tabs.css'; // Custom styles for the tabs

const Tabs = ({ tabs, defaultActiveTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0].id);

  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(id);
    }
  };

  return (
    <div className="tabs-container">
      <div className="tabs-header" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`tab-header ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`tabpanel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            className={`tab-panel ${activeTab === tab.id ? 'active' : ''}`}
            hidden={activeTab !== tab.id}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  defaultActiveTab: PropTypes.string,
  onTabChange: PropTypes.func,
};

Tabs.defaultProps = {
  defaultActiveTab: null,
  onTabChange: null,
};

export default Tabs;

//EXAMPLE//////////////////////////////////////////////
import React from 'react';
import Tabs from './Tabs';

const NestedTabsExample = () => {
  const outerTabs = [
    {
      id: 'tab1',
      label: 'General Info',
      content: <div>Content for General Info</div>,
    },
    {
      id: 'tab2',
      label: 'Settings',
      content: (
        <Tabs
          tabs={[
            {
              id: 'subtab1',
              label: 'Profile Settings',
              content: <div>Content for Profile Settings</div>,
            },
            {
              id: 'subtab2',
              label: 'Account Settings',
              content: <div>Content for Account Settings</div>,
            },
          ]}
        />
      ),
    },
    {
      id: 'tab3',
      label: 'Analytics',
      content: (
        <div>
          <h2>Analytics Dashboard</h2>
          <p>Various analytics data and graphs go here.</p>
        </div>
      ),
    },
  ];

  return <Tabs tabs={outerTabs} />;
};

export default NestedTabsExample;
