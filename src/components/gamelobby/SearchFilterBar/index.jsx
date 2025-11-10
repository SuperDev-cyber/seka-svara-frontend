import React, { useState } from 'react';
import SearchInput from '../SearchInput';
import NetworkDropdown from '../NetworkDropdown';
import FeeSlider from '../FeeSlider';

const SearchFilterBar = ({ onSearch, onNetworkChange, onFeeChange, onRefresh, feeFilter, onFeeToggle }) => {
    const [searchValue, setSearchValue] = useState('');
    const [networkValue, setNetworkValue] = useState('All Network');
    const [feeValue, setFeeValue] = useState(25);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        onSearch && onSearch(e.target.value);
    };

    const handleNetworkChange = (e) => {
        setNetworkValue(e.target.value);
        onNetworkChange && onNetworkChange(e.target.value);
    };

    const handleFeeChange = (e) => {
        setFeeValue(e.target.value);
        onFeeChange && onFeeChange(e.target.value);
    };

    const handleRefresh = () => {
        onRefresh && onRefresh();
    };

    return (
        <div className='search-filter-bar'>
            <SearchInput 
                value={searchValue}
                onChange={handleSearchChange}
            />
            <NetworkDropdown 
                value={networkValue}
                onChange={handleNetworkChange}
            />
            <FeeSlider 
                value={feeValue}
                onChange={handleFeeChange}
                onRefresh={handleRefresh}
                enabled={feeFilter?.enabled || false}
                onToggle={onFeeToggle}
            />
        </div>
    );
};

export default SearchFilterBar;
