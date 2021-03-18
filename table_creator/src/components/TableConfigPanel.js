import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { AccordionLayout } from '../layout/accordion'
import { COLUMN_TYPE } from '../constants';

export function TableConfigPanel({ columns, onEditColumn, pageSize, onPageSizeChange, onSetAlert }) {
    const [inputColumnCount, setInputColumnCount] = useState(columns.length);
    const [inputPageSize, setInputPageSize] = useState(pageSize);
    const [dataInstances, setDataInstances] = useState();

    //When mounting getting data instances to change the data in the column
    useEffect(() => {
        const dataInstances = columns.map(column => ({ data: column.data, type: column.type }));
        setDataInstances(dataInstances);
    }, [])

    function columnNumChangeHandler(columnCount) {
        
        if (columnCount > 0) {
            let newColumn = JSON.parse(JSON.stringify(columns));

            if (columns.length < columnCount) {
                for (let i = columns.length; i < columnCount; i++) {
                    newColumn.push({
                        id: i + 1 + '-tableColumn',
                        data: dataInstances[0].data,
                        header: dataInstances[0].data.toUpperCase(),
                        type: COLUMN_TYPE.TEXT,
                        isSortable: true,
                        isSearchable: true
                    });
                }

            } else if (columns.length > columnCount) {
                newColumn = newColumn.filter((column, index) => (
                    index < columnCount
                ));
            }
            onEditColumn(newColumn);

        } else {
            onSetAlert('The number of columns must be at least one');
            setInputColumnCount(columns.length);
        }
    }

    function pageSizeChangeHandler(size) {
        if (size >= 10 && size <= 50) {
            onPageSizeChange(+size);
        } else {
            onSetAlert('Page size should be from 10 to 50');
            setInputPageSize(pageSize);
        }
    }

    function columnPositionChangeHandler(newColumnPosition, columnId) {

        if (newColumnPosition <= columns.length) {
            let newColumns = JSON.parse(JSON.stringify(columns));

            let currentIndexes = columns.map((column, index) => {

                return column.id === columnId || index === newColumnPosition - 1 ? index : null;
            }).filter((index) => index !== null);

            if (currentIndexes.length !== 1) {
                [newColumns[currentIndexes[0]], newColumns[currentIndexes[1]]] = [newColumns[currentIndexes[1]], newColumns[currentIndexes[0]]];

                onEditColumn(newColumns);
            }

        } else {
            onSetAlert('The column position should not exceed the number of columns');
        }
    }

    function editColumnHandler(action, columnId) {
        let newColumns = columns.map((column) => {
            if (column.id === columnId) {
                if (typeof (action.payload) === 'object') {
                    for (let i = 0; i <= action.payload.length; i++) {
                        column[action.name[i]] = action.payload[i];
                    }
                } else {
                    column[action.name] = action.payload
                }
            }
            return column;
        });

        onEditColumn(newColumns);
    }

    return (
        <>
            <AccordionLayout>
                <div className='config-panel'>
                    <div className='form-floating mb-3'>
                        <input
                            type='number'
                            className='form-control'
                            value={inputColumnCount}
                            onChange={e => setInputColumnCount(+e.target.value)}
                            onBlur={e => columnNumChangeHandler(+e.target.value)}
                            onKeyPress={e => e.code === 'Enter' ? columnNumChangeHandler(+e.target.value) : ''}
                        />
                        <label htmlFor='floatingInput'>Number of column</label>
                    </div>
                    <div className='form-floating'>
                        <input
                            type='number'
                            className='form-control'
                            value={inputPageSize}
                            onChange={e => setInputPageSize(+e.target.value)}
                            onBlur={e => pageSizeChangeHandler(+e.target.value)}
                            onKeyPress={e => e.code === 'Enter' ? pageSizeChangeHandler(+e.target.value) : ''}
                        />
                        <label htmlFor='floatingInput'>Page size</label>
                    </div>
                </div>

                <table className='h-100 table table-bordered mx-auto w-auto'>
                    <thead>
                        <tr>
                            <th scope='col'>Column Position</th>
                            <th scope='col'>Column Data</th>
                            <th scope='col'>Column Name</th>
                            <th scope='col'>Is sortable?</th>
                            <th scope='col'>Is searchable?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {columns.map((column, index) => {
                            return (
                                <tr key={column.id}>
                                    <td className='input-columnPosition'
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={e => (
                                            e.target.innerText > columns.length
                                                ? onSetAlert('The column position should not exceed the number of columns')
                                                : ''
                                        )}
                                        onBlur={e => {
                                            e.target.innerText > columns.length
                                                ? e.target.innerText = index + 1
                                                : e.target.innerText = e.target.innerText.replace(/[^\d]/g, '');
                                            columnPositionChangeHandler(+e.target.innerText, column.id);
                                        }}
                                    >
                                        {index + 1}
                                    </td>
                                    <td className='input-columnData'
                                        onChange={e => {
                                            const data = dataInstances.filter(instance => instance.data === e.target.value);
                                            editColumnHandler({ name: ['data', 'type'], payload: [data[0].data, data[0].type] }, column.id)
                                        }}
                                    >
                                        <select value={column.data} readOnly>
                                            {dataInstances && dataInstances.map((instance, index) => {
                                                return <option key={instance.data + index}>{instance.data}</option>
                                            })}
                                        </select>
                                    </td>
                                    <td className='input-columnName'
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={e => {
                                            e.target.innerText = e.target.innerText.trim();
                                            editColumnHandler({ name: 'header', payload: e.target.innerText }, column.id);
                                        }}
                                        onKeyPress={e => {
                                            if (e.code === 'Enter') {
                                                e.target.innerText = e.target.innerText.trim();
                                                editColumnHandler({ name: 'header', payload: e.target.innerText }, column.id);
                                            }
                                        }}
                                    >
                                        {column.header}
                                    </td>
                                    <td>
                                        <input
                                            className='checkbox-isSortable'
                                            type='checkbox'
                                            checked={column.isSortable}
                                            onChange={e => editColumnHandler({ name: 'isSortable', payload: e.target.checked }, column.id)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='checkbox-Searchable'
                                            checked={column.isSearchable}
                                            type='checkbox'
                                            onChange={e => editColumnHandler({ name: 'isSearchable', payload: e.target.checked }, column.id)}

                                        />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </AccordionLayout>
        </>
    )
}

TableConfigPanel.propTypes = {
    columns: PropTypes.array.isRequired,
    onEditColumn: PropTypes.func.isRequired,
    pageSize: PropTypes.number.isRequired,
    onPageSizeChange: PropTypes.func.isRequired,
    onSetAlert: PropTypes.func.isRequired
}