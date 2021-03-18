import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { COLUMN_TYPE } from '../constants';

export function Table({ structure, data, pageSize, onChangeSorting }) {
    const [sort, setSort] = useState();
    const [cellHeight, setCellHeight] = useState();

    //Calculate ul-table cell height
    useEffect(() => {
        const cells = document.getElementsByClassName('table-cell');
        let maxHeight = 0;

        for (let item of cells) {
            item.style.height = 'auto;'
            if (item.offsetHeight > maxHeight) {
                maxHeight = item.offsetHeight;
            }
        }
        setCellHeight(maxHeight);
    }, [structure]);

    const rows = (column) => {

        //Render rows with data
        let rowData = data.map((columnData, index) => {
            let dataContainer;

            switch (column.type) {
                case COLUMN_TYPE.NUMBER:
                case COLUMN_TYPE.TEXT: {
                    dataContainer = columnData[column.data];
                    break;
                }
                case COLUMN_TYPE.LINK: {
                    dataContainer = <a href={columnData[column.data]}>Link</a>
                    break;
                }
                case COLUMN_TYPE.IMAGE: {
                    dataContainer = <img src={columnData[column.data]} alt={columnData[column.header] + ' image'} />
                    break;
                }
            }
            return (
                <li
                    key={index}
                    className='table-cell list-group-item'
                    style={{ height: cellHeight + 'px' }}
                >
                    {dataContainer}
                </li>
            )
        });

        //If the data is less than the number of records per page - create empty 
        if (rowData.length < pageSize) {
            const emptyRowNumber = pageSize - rowData.length;

            for (let i = 0; i < emptyRowNumber; i++) {
                rowData.push(<li key={rowData.length + i} className='table-cell list-group-item' />)
            }
        }
        return rowData;
    }

    function setSortHandler(column) {
        if (column.isSortable) {
            if (sort && sort.direction === 'ASC' && sort.sortingBy === column.header) {
                setSort({ sortingBy: column.header, direction: 'DESC' });
                onChangeSorting({ sortingBy: column.data, direction: 'DESC', type: column.type });
            } else {
                setSort({ sortingBy: column.header, direction: 'ASC' });
                onChangeSorting({ sortingBy: column.data, direction: 'ASC', type: column.type });
            }
        }
    }

    return (
            <nav className='ul-table'>
                {
                    structure.map(column => (
                        <ul
                            key={column.id}
                            className='table-column list-group'
                            id={column.id}
                        >
                            <li
                            key={column.id + '-table-header'}
                            className='table-header list-group-item active'
                            aria-current='true'
                            onClick={() => setSortHandler(column)}
                        >
                            {column.header}
                            {sort && sort.sortingBy === column.header && (
                                <i className={sort.direction === 'ASC' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'} />
                            )}
                        </li>
                            {
                                rows(column)
                            }
                        </ul>
                    ))
                }
            </nav>
    )
}

Table.propTypes = {
    structure: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    pageSize: PropTypes.number.isRequired,
    onChangeSorting: PropTypes.func.isRequired
}