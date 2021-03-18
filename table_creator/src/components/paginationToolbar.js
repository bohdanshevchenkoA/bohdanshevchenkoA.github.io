import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

export function PaginationToolbar({ currentPage, numberOfPages, onPageChange, recordNumber }) {
    const [inputPageNum, setInputPageNum] = useState(currentPage);

    useEffect(() => {
        setInputPageNum(currentPage);
    }, [currentPage])

    function validatePageChange(action) {
        switch (action.actionName) {
            case 'toPrevPage':
                if (action.payload !== 0) {
                    setInputPageNum(action.payload);
                    onPageChange(action.payload)
                }
                break;
            case 'toNextPage':
                if (action.payload <= numberOfPages) {
                    setInputPageNum(action.payload);
                    onPageChange(action.payload)
                }
                break;
            case 'toInsertedPage':
                if (action.payload > 0 && action.payload <= numberOfPages) {
                    setInputPageNum(action.payload);
                    onPageChange(action.payload)
                } else {
                    setInputPageNum(currentPage);
                }
                break;
        }
    }

    return (
        <div className='input-group mb-3 pagination'>
            <button
                className='btn btn-outline-secondary btn-first-page'
                onClick={() => onPageChange(1)}
            >
                <i className='bi bi-chevron-double-left' />
            </button>
            <button
                className='btn btn-outline-secondary'
                onClick={() => validatePageChange({ actionName: 'toPrevPage', payload: currentPage - 1 })}
            >
                <i className='bi bi-chevron-left' />
            </button>
            <span className='input-group-text pagination-text'>Page</span>
            <input
                className='form-control input-page'
                value={inputPageNum}
                onKeyPress={e => e.code === 'Enter'
                    ? validatePageChange({ actionName: 'toInsertedPage', payload: e.target.value.trim() })
                    : ''}
                onChange={e => setInputPageNum(e.target.value)}
                onBlur={e => validatePageChange({ actionName: 'toInsertedPage', payload: e.target.value.trim() })}
            />
            <span className='input-group-text pagination-text'>of &nbsp;
            {numberOfPages}
            </span>
            <button
                className='btn btn-outline-secondary btn-next-page'
                onClick={() => validatePageChange({ actionName: 'toNextPage', payload: currentPage + 1 })}
            >
                <i className='bi bi-chevron-right' />
            </button>
            <button
                className='btn btn-outline-secondary btn-last-page'
                onClick={e => onPageChange(numberOfPages)}>
                <i className='bi bi-chevron-double-right' />
            </button>
            <div className='input-group-text record-number'>{'Number of records: ' + recordNumber}</div>
        </div>
    )
}

PaginationToolbar.propTypes = {
    currentPage: PropTypes.number.isRequired,
    numberOfPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    recordNumber: PropTypes.number.isRequired
}