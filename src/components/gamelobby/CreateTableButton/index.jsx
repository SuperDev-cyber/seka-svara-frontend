import React from 'react';

const CreateTableButton = ({ onClick }) => {
    return (
        <button className='create-table-btn' onClick={onClick}>
            <span>+</span>
            Create Table
        </button>
    );
};

export default CreateTableButton;
