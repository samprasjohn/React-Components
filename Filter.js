import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd'; // Assuming you're using Ant Design for date picker
import 'antd/dist/antd.css';

const { RangePicker } = DatePicker;

const Filter = ({ filters, onFilterChange, customComponents }) => {
  const [filterValues, setFilterValues] = useState({});

  const handleInputChange = (name, value) => {
    const updatedValues = { ...filterValues, [name]: value };
    setFilterValues(updatedValues);
    onFilterChange(updatedValues);
  };

  const renderFilterInput = (filter) => {
    const { name, label, type, component, options } = filter;

    const handleChange = (e) => {
      handleInputChange(name, e.target ? e.target.value : e);
    };

    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={label}
            onChange={handleChange}
          />
        );
      case 'select':
        return (
          <select onChange={handleChange}>
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'date-range':
        return (
          <RangePicker onChange={(dates, dateStrings) => handleChange(dateStrings)} />
        );
      default:
        const CustomComponent = customComponents[component];
        return (
          CustomComponent ? (
            <CustomComponent onChange={(value) => handleChange(value)} />
          ) : null
        );
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      {filters.map((filter) => (
        <div key={filter.name} style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '0.5rem' }}>{filter.label}</label>
          {renderFilterInput(filter)}
        </div>
      ))}
    </div>
  );
};

Filter.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      component: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  customComponents: PropTypes.object,
};

export default Filter;

//EXAMPLE////////////////////////////////////////////////////////////////
import React, { useState, useEffect } from 'react';
import Filter from './Filter';
import axios from 'axios';

const MyApp = () => {
  const [data, setData] = useState([]);
  const [filterParams, setFilterParams] = useState({});

  const filters = [
    { name: 'search', label: 'Search', type: 'text' },
    { name: 'category', label: 'Category', type: 'select', options: [
      { value: 'all', label: 'All' },
      { value: 'electronics', label: 'Electronics' },
      { value: 'books', label: 'Books' },
      { value: 'clothing', label: 'Clothing' },
    ]},
    { name: 'dateRange', label: 'Date Range', type: 'date-range' },
  ];

  const handleFilterChange = (newFilterParams) => {
    setFilterParams(newFilterParams);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('https://api.example.com/data', {
        params: filterParams,
      });
      setData(response.data);
    };

    fetchData();
  }, [filterParams]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Data Filtering Example</h1>
      <Filter filters={filters} onFilterChange={handleFilterChange} />
      <div>
        {data.length > 0 ? (
          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default MyApp;
