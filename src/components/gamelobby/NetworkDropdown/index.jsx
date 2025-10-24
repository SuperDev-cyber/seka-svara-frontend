import React from 'react';

const NetworkDropdown = ({ value, onChange, options = ["All Network", "BSC", "TRC20", "ERC20"] }) => {
    return (
        <select 
            className='network-dropdown' 
            value={value} 
            onChange={onChange}
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default NetworkDropdown;
