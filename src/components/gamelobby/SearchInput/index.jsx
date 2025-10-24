import React from 'react';

const SearchInput = ({ placeholder = "Search", value, onChange }) => {
    return (
        <div className='search-container'>
            <svg className='search-icon' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
                type="text" 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className='search-input'
            />
        </div>
    );
};

export default SearchInput;
