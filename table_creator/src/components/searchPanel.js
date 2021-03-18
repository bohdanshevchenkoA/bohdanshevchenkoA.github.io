import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
export function SearchPanel({ columns, data, onSearchData, onSetAlert }) {
    const [filterBy, setFilterBy] = useState();

    useEffect(() => {
        const filteredColumn = columns.map(column => column.isSearchable ? column.data : null);
        setFilterBy(filteredColumn[0]);
    }, [columns]);

    function filterHandler(filteringValue) {
        if (filterBy) {
            const filteredData = data.filter(rowData => 
                rowData[filterBy] && rowData[filterBy].toUpperCase().includes(filteringValue.toUpperCase()) ? rowData : ''
            );

            onSearchData(filteredData);
        } 
        else {
            onSetAlert('First select the column you want to search by');
        }

    }

    return (
        <div className='input-group input-group-sm mb-3 search-panel'>
            <span className='input-group-text' id='inputGroup-sizing-sm'>Search By</span>
            <select
                className='form-select form-select-sm'
                aria-label='.form-select-sm'
                onChange={e => setFilterBy(e.target.value)}
            >
                {columns.map((column, index) => 
                    column.isSearchable && <option key={index} value={column.data}>{column.header}</option>
                )}
            </select>
            <input
                type='text'
                className='form-control input-search'
                placeholder='Search'
                aria-label='Search'
                aria-describedby='basic-addon1'
                onChange={e => filterHandler(e.target.value)}
            />
        </div>

    )
}

SearchPanel.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    onSearchData: PropTypes.func.isRequired,
    onSetAlert: PropTypes.func.isRequired
}