import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './DataTable.css'; // Custom styles for the DataTable

const DataTable = ({
  columns,
  data,
  expandableRowContent,
  pagination,
  onEdit,
  onDelete,
  customCellRenderer,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination.pageSize);
  const [sortConfig, setSortConfig] = useState(null);
  const [filterText, setFilterText] = useState('');

  const handleSort = (column) => {
    const isAscending = sortConfig?.key === column && sortConfig.direction === 'ascending';
    setSortConfig({ key: column, direction: isAscending ? 'descending' : 'ascending' });
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredData = useMemo(() => {
    const lowercasedFilterText = filterText.toLowerCase();
    return data.filter((item) =>
      columns.some((column) => 
        String(item[column.key]).toLowerCase().includes(lowercasedFilterText)
      )
    );
  }, [data, columns, filterText]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const { key, direction } = sortConfig;
    return [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="data-table">
      <input
        type="text"
        placeholder="Filter..."
        value={filterText}
        onChange={handleFilterChange}
        className="filter-input"
      />
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                <button
                  type="button"
                  onClick={() => handleSort(column.key)}
                  className={`sortable ${sortConfig?.key === column.key ? sortConfig.direction : ''}`}
                >
                  {column.label}
                </button>
              </th>
            ))}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                {columns.map((column) => (
                  <td key={column.key}>
                    {customCellRenderer ? customCellRenderer(column.key, item) : item[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td>
                    {onEdit && <button onClick={() => onEdit(item)}>Edit</button>}
                    {onDelete && <button onClick={() => onDelete(item)}>Delete</button>}
                  </td>
                )}
              </tr>
              {expandableRowContent && (
                <tr>
                  <td colSpan={columns.length + 1}>
                    {expandableRowContent(item)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(sortedData.length / pageSize)))}
          disabled={currentPage === Math.ceil(sortedData.length / pageSize)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  expandableRowContent: PropTypes.func,
  pagination: PropTypes.shape({
    pageSize: PropTypes.number,
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  customCellRenderer: PropTypes.func,
};

DataTable.defaultProps = {
  expandableRowContent: null,
  pagination: { pageSize: 10 },
  onEdit: null,
  onDelete: null,
  customCellRenderer: null,
};

export default DataTable;

//Example////////////////////////////////////////////////////////////////////
import React from 'react';
import DataTable from './DataTable';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
];

const data = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Joy', email: 'joy@example.com' },
  // Add more data here
];

const handleEdit = (item) => {
  console.log('Edit', item);
};

const handleDelete = (item) => {
  console.log('Delete', item);
};

const App = () => (
  <DataTable
    columns={columns}
    data={data}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
);

export default App;
import React from 'react';
import DataTable from './DataTable';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
];

const data = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Joy', email: 'joy@example.com' },
  // Add more data here
];

const expandableRowContent = (item) => (
  <div>
    <p>Additional details for {item.name}</p>
    {/* Add more details here */}
  </div>
);

const customCellRenderer = (key, item) => (
  <span style={{ color: key === 'email' ? 'blue' : 'black' }}>{item[key]}</span>
);

const App = () => (
  <DataTable
    columns={columns}
    data={data}
    expandableRowContent={expandableRowContent}
    customCellRenderer={customCellRenderer}
  />
);

export default App;

