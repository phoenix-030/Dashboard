import React, { useState, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DataTable = ({ data, loading, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filter, setFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const itemsPerPage = 5;

  // Handle row selection
  const handleRowSelect = (itemId) => {
    setSelectedRows(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(item => item.id));
    }
  };

  const getSortValue = (item, key) => {
    if (key === 'price') {
      return Number(item.price ?? item.value ?? 0);
    }
    const value = item[key] ?? '';
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filteredData = data || [];
    
    // Apply filter
    if (filter) {
      const normalizedFilter = filter.toLowerCase();
      filteredData = filteredData.filter(item =>
        (item.id || '').toString().toLowerCase().includes(normalizedFilter) ||
        (item.name || '').toLowerCase().includes(normalizedFilter) ||
        (item.category || '').toLowerCase().includes(normalizedFilter) ||
        (item.price || item.value || '').toString().toLowerCase().includes(normalizedFilter)
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = getSortValue(a, sortConfig.key);
        const bValue = getSortValue(b, sortConfig.key);

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'ascending'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      });
    }
    
    return filteredData;
  }, [data, filter, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="text-muted">Loading data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5 bg-light rounded border">
        <div className="text-center">
          <div className="text-muted mb-3">No data found</div>
          <div className="text-info">
            <small>"Add Item" tab to add your first record!</small>
          </div>
        </div>
      </div>
    );
  }
// ----------------------------------------------------------------------
  return (
    <div className="container-lg py-4">
      <h3 className="text-center mb-4 text-primary">Data Records</h3>
      
      {/* Filter Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name, category, or value..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-control"
        />
      </div>
      
      {/* Selection button */}
      {selectedRows.length > 0 && (
        <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
          <span>
            <strong>{selectedRows.length}</strong> row{selectedRows.length > 1 ? 's' : ''} selected
          </span>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={() => setSelectedRows([])}
              title="Clear selection"
            >
              Clear Selection
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                selectedRows.forEach(id => {
                  const item = paginatedData.find(item => item.id === id);
                  if (item && onDelete) onDelete(item);
                });
                setSelectedRows([]);
              }}
              title="Delete selected rows"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}
      
      <div className="table-responsive border rounded">
        <table className="table table-hover table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                  className="form-check-input"
                  title="Select all rows"
                />
              </th>
              <th 
                style={{ cursor: 'pointer' }}
                title="Serial number (hover to see ID)"
                onClick={() => handleSort('serialNo')}
              >
                S.NO {sortConfig.key === 'serialNo' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th 
                style={{ cursor: 'pointer' }}
                title="Record name"
                onClick={() => handleSort('name')}
              >
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th 
                style={{ cursor: 'pointer' }}
                title="Record category"
                onClick={() => handleSort('category')}
              >
                Type {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th 
                style={{ cursor: 'pointer' }}
                title="Price amount"
                onClick={() => handleSort('price')}
              >
                Price {sortConfig.key === 'price' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th 
                style={{ cursor: 'pointer' }}
                title="Creation date"
                onClick={() => handleSort('date')}
              >
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {/* pagination */}
            {paginatedData.map((item, index) => (
              <tr 
                key={item.id || index}
                className={selectedRows.includes(item.id) ? 'table-active' : ''}
                style={{ cursor: 'pointer' }}
                onClick={() => handleRowSelect(item.id)}
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleRowSelect(item.id)}
                    className="form-check-input"
                    title="Select this row"
                  />
                </td>
                <td title={`Serial No: ${item.serialNo || 'N/A'} (ID: ${item.id})`}>
                  {item.serialNo || index + 1}
                </td>
                <td title={`Name: ${item.name}`}>
                  {item.name}
                </td>
                <td title={`Category: ${item.category}`}>
                  {item.category}
                </td>
                <td title={`Price: ${item.price || item.value}`}>
                  {item.price || item.value}
                </td>
                <td title={`Date: ${item.date}`}>
                  {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <button
                    onClick={() => onDelete && onDelete(item)}
                    className="btn btn-sm btn-danger"
                    title="Delete record"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-primary"
          >
            Previous
          </button>
          
          <span className="fw-semibold text-black">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-primary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
