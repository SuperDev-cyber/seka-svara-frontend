import React from 'react';

const FeeSlider = ({ 
    min = 5, 
    max = 100, 
    value, 
    onChange, 
    onRefresh,
    label = "Enter Fee 5-100 USDT",
    enabled = false,
    onToggle
}) => {
    const percentage = ((value - min) / (max - min)) * 100;

    const handleChange = (e) => {
        onChange && onChange(e);
    };

    const handleToggle = () => {
        onToggle && onToggle(!enabled);
    };

    return (
        <div className='fee-slider-container'>
            <div className='fee-label-container'>
                <span className='fee-label'>{label}</span>
                <button 
                    className={`fee-toggle-btn ${enabled ? 'active' : ''}`}
                    onClick={handleToggle}
                    title={enabled ? 'Disable fee filter' : 'Enable fee filter'}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {enabled ? (
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        ) : (
                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        )}
                    </svg>
                </button>
                <button className='fee-refresh-btn' onClick={onRefresh}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M3 21v-5h5"/>
                    </svg>
                </button>
            </div>
            <div className='fee-slider-wrapper'>
                <div 
                    className='fee-slider-fill' 
                    style={{ width: `${percentage}%`, opacity: enabled ? 1 : 0.5 }}
                ></div>
                <input 
                    type="range" 
                    min={min}
                    max={max}
                    value={value}
                    onChange={handleChange}
                    className='fee-slider'
                    disabled={!enabled}
                />
            </div>
        </div>
    );
};

export default FeeSlider;
