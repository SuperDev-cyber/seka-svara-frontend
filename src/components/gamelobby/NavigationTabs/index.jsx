import React from 'react';

const NavigationTabs = ({ activeTab, setActiveTab, activeTablesCount = 0 }) => {
    const tabs = [
        { id: 'Active Tables', label: `Active Tables (${activeTablesCount})` },
        { id: 'My Games', label: 'My Games' },
        { id: 'History', label: 'History' }
    ];

    return (
        <div className='navigation-tabs'>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default NavigationTabs;
