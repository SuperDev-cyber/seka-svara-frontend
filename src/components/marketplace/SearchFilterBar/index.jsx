import React from 'react';

const SearchFilterBar = ({ 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory, 
    selectedPrice, 
    setSelectedPrice, 
    sortBy, 
    setSortBy 
}) => {
    return (
        <div className='search-filter-bar'>
            <div className='search-container'>
                <svg className='search-icon' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
                <input 
                    type="text" 
                    placeholder="Search NFTs, creators..." 
                    className='search-input'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className='filter-dropdowns'>
                <select 
                    className='filter-select'
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option>All Categories</option>
                    <option>Art</option>
                    <option>Gaming</option>
                    <option>Music</option>
                </select>
                <select 
                    className='filter-select'
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                >
                    <option>All Prices</option>
                    <option>Under 1 ETH</option>
                    <option>1-5 ETH</option>
                    <option>5+ ETH</option>
                </select>
                <select 
                    className='filter-select'
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                </select>
            </div>
        </div>
    );
};

export default SearchFilterBar;
