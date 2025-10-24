import React from 'react';

const SecondaryFilters = ({ activeFilter, setActiveFilter }) => {
    const filters = [
        { 
            id: 'Featured', 
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                </svg>
            ), 
            label: 'Featured' 
        },
        { 
            id: 'Hot', 
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            ), 
            label: 'Hot' 
        },
        { 
            id: 'New', 
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    {/* Larger star (lower-left) */}
                    <path d="M2 6h2v2h2v2h2v2h2v-2h2V8h2V6h-2V4h-2V2H8v2H6v2H4v2z"/>
                    {/* Smaller star (upper-right) */}
                    <path d="M8 2h1v1h1v1h1v1h1V3h1V2h-1V1h-1V0H9v1H8v1z"/>
                </svg>
            ), 
            label: 'New' 
        }
    ];

    return (
        <div className='secondary-filters'>
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter.id)}
                >
                    <span className='filter-icon'>{filter.icon}</span>
                    {filter.label}
                </button>
            ))}
        </div>
    );
};

export default SecondaryFilters;
