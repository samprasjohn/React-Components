import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Select = ({
  options,
  value,
  onChange,
  multiple = false,
  loadOptions,
  placeholder = 'Select...',
  customRenderOption,
  customDropdownPosition,
  style,
  dropdownStyle,
}) => {
  const [loadedOptions, setLoadedOptions] = useState(options);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (loadOptions) {
      setIsLoading(true);
      loadOptions(searchTerm).then((newOptions) => {
        setLoadedOptions(newOptions);
        setIsLoading(false);
      });
    }
  }, [loadOptions, searchTerm]);

  const handleOptionSelect = (option) => {
    if (multiple) {
      const newValue = value.includes(option)
        ? value.filter((val) => val !== option)
        : [...value, option];
      onChange(newValue);
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const renderOptions = () => {
    if (isLoading) return <div>Loading...</div>;

    return loadedOptions.map((option, index) =>
      customRenderOption ? (
        customRenderOption(option, handleOptionSelect, index)
      ) : (
        <div
          key={index}
          onClick={() => handleOptionSelect(option)}
          style={{ padding: '8px', cursor: 'pointer', ...dropdownStyle }}
        >
          {option.label}
        </div>
      )
    );
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      <input
        type="text"
        value={multiple ? '' : value?.label || ''}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        readOnly={!multiple}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
      {isOpen && (
        <div
          style={{
            position: customDropdownPosition || 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            zIndex: 1000,
            ...dropdownStyle,
          }}
        >
          {renderOptions()}
        </div>
      )}
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  loadOptions: PropTypes.func,
  placeholder: PropTypes.string,
  customRenderOption: PropTypes.func,
  customDropdownPosition: PropTypes.string,
  style: PropTypes.object,
  dropdownStyle: PropTypes.object,
};

export default Select;

//EXAMPLE//////////////////////////////////
import React, { useState } from 'react';
import Select from './Select';

const fetchOptions = async (searchTerm) => {
  const response = await fetch(`https://api.example.com/options?q=${searchTerm}`);
  const data = await response.json();
  return data.map(item => ({ label: item.name, value: item.id }));
};

const MyForm = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  return (
    <form>
      <label>
        Single Select:
        <Select
          value={selectedOption}
          onChange={setSelectedOption}
          loadOptions={fetchOptions}
          placeholder="Choose an option..."
          style={{ width: '200px', marginBottom: '20px' }}
        />
      </label>

      <label>
        Multi Select:
        <Select
          value={selectedOptions}
          onChange={setSelectedOptions}
          multiple
          loadOptions={fetchOptions}
          placeholder="Choose multiple options..."
          style={{ width: '200px', marginBottom: '20px' }}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
