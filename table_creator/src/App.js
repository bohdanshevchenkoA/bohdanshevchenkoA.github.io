import React, { useState, useMemo, useEffect } from 'react';
import { PaginationToolbar } from './components/paginationToolbar';
import { Table } from './components/Table';
import { TableConfigPanel } from './components/TableConfigPanel';
import { SearchPanel } from './components/searchPanel';
import { Alert } from './components/alert';
import { COLUMN_TYPE } from './constants';
import cache_response from './IMDB_responce.json';
import './styles/style.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '' });
  const [columns, setColumns] = useState();
  const [data, setData] = useState();
  const [sort, setSort] = useState();
  const [filteredData, setFilteredData] = useState();
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPage] = useState();
  const [recordNumber, setRecordNumber] = useState();

  //When the alert state changes set a timer to hide it
  useEffect(() => {
    const timer = setTimeout(() => setAlert(false), 5000);

    return () => {
      clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    const fetchCards = async () => {
      const films = await fetch('https://imdb-api.com/en/API/Top250Movies/k_9qushv39');
      const response = await films.json();
      let responseColumns;
      let columns = [];
      
      if (response.errorMessage.includes('Maximum usage') || response.errorMessage.includes('Invalid API')) {
        setAlert({ show: true, message: response.errorMessage + ' Cached data will be used.' });
        responseColumns = Object.entries(cache_response.items[0]);
        setData(cache_response.items);
      }
      else {
        responseColumns = Object.entries(response.items[0]);
        setData(response.items);
      }

      for (let i = 1; i < responseColumns.length; i++) {
        let dataType;
        if (isNaN(responseColumns[i][1])) {
          let parser = document.createElement('a');

          parser.href = responseColumns[i][1];
          dataType = parser.host && parser.host !== window.location.host ? COLUMN_TYPE.IMAGE : COLUMN_TYPE.TEXT;
        } else {
          dataType = COLUMN_TYPE.NUMBER;
        }

        columns.push({
          id: i + '-tableColumn',
          data: responseColumns[i][0],
          header: responseColumns[i][0].toUpperCase(),
          type: dataType,
          isSortable: true,
          isSearchable: true
        });
      }

      setColumns(columns);
      setLoading(false);
    }

    fetchCards();
  }, []);

  const currentData = useMemo(() => {
    const lastRowIndex = currentPage * pageSize;
    const firstRowIndex = lastRowIndex - pageSize;
    const currentData = filteredData ? filteredData : data;

    if (sort && sort.sortingBy) {

      currentData.sort((a, b) => {
        let comparison = 0;

        switch (sort.type) {
          case COLUMN_TYPE.IMAGE:
          case COLUMN_TYPE.LINK:
          case COLUMN_TYPE.TEXT: {
            if (sort.direction === 'ASC') {
              comparison = a[sort.sortingBy].toUpperCase() > b[sort.sortingBy].toUpperCase() ? 1 : -1;
            } else {
              comparison = a[sort.sortingBy].toUpperCase() > b[sort.sortingBy].toUpperCase() ? -1 : 1;
            }
            break;
          }
          case COLUMN_TYPE.NUMBER: {
            if (sort.direction === 'ASC') {
              comparison = +a[sort.sortingBy] > +b[sort.sortingBy] ? 1 : -1;
            } else {
              comparison = +a[sort.sortingBy] > +b[sort.sortingBy] ? -1 : 1;
            }
            break;
          }
        }

        return comparison;
      });
    }

    setRecordNumber(currentData ? Number(currentData.length) : 0);
    setNumberOfPage(Math.ceil(currentData && currentData.length / pageSize));

    return (
      currentData && currentData.slice(firstRowIndex, lastRowIndex)
    )
  }, [currentPage, pageSize, sort, filteredData, data]);

  if (!loading) {
    return (
      <div className='App'>
        <TableConfigPanel
          columns={columns}
          onEditColumn={newColumns => setColumns(newColumns)}
          pageSize={pageSize}
          onPageSizeChange={newPageSize => { setPageSize(newPageSize); setCurrentPage(1); }}
          onSetAlert={message => setAlert({ show: true, message: message })}
        />
        <SearchPanel
          columns={columns}
          data={data}
          onSearchData={filteredData => { setFilteredData(filteredData); setCurrentPage(1); }}
          onSetAlert={message => setAlert({ show: true, message: message })}
        />
        <Table
          structure={columns}
          pageSize={pageSize}
          data={currentData}
          onChangeSorting={sort => setSort(sort)}
        />
        <PaginationToolbar
          numberOfPages={numberOfPages}
          currentPage={currentPage}
          onPageChange={page => setCurrentPage(page)}
          recordNumber={recordNumber}
        />
        { alert.show && <Alert>{alert.message}</Alert>}
      </div>
    );
  } else {
    return (
      <div className='spinner-grow text-primary' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    );
  }
}

export default App;
