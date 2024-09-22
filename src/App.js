import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [options, setOptions] = useState({
    alphabets: false,
    numbers: false,
    highestLowercase: false,
  });

  const handleChange = (e) => {
    setJsonInput(e.target.value);
    setError('');
  };

  const handleOptionChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate JSON input
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid data format. Expected an array.");
      }

      // Make API call
      const formData = new FormData();
      formData.append('data', JSON.stringify(parsedData.data));
      formData.append('file', null); // If you have no file to send

      const response = await axios.post('https://tesstbfhl-c895dd981268.herokuapp.com/bfhl', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResponseData(response.data);
      setError(''); // Clear error on success
    } catch (err) {
      if (err.response) {
        // API error
        setError(`API Error: ${err.response.data.message || 'Something went wrong'}`);
      } else {
        // JSON parse error
        setError(`Invalid JSON input: ${err.message}`);
      }
      setResponseData(null); // Clear previous response data
    }
  };

  const handleFinalSubmit = () => {
    // Logic to filter response based on selected options
    let filteredData = responseData;
    
    if (options.alphabets && Array.isArray(filteredData.alphabets)) {
      filteredData = filteredData.alphabets;
    }
    if (options.numbers && Array.isArray(filteredData.numbers)) {
      filteredData = filteredData.numbers;
    }
    if (options.highestLowercase) {
      const highest = filteredData.highest_lowercase_alphabet || '';
      filteredData = highest;
    }

    // Display final response
    setResponseData(filteredData);
  };

  return (
    <div>
      <h1>RA2111008020070</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={handleChange}
          placeholder='Enter JSON input here'
          required
        />
        <button type="submit">Submit</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>

      {responseData && (
        <div>
          <h2>Select Options</h2>
          <label>
            <input
              type="checkbox"
              name="alphabets"
              checked={options.alphabets}
              onChange={handleOptionChange}
            />
            Alphabets
          </label>
          <label>
            <input
              type="checkbox"
              name="numbers"
              checked={options.numbers}
              onChange={handleOptionChange}
            />
            Numbers
          </label>
          <label>
            <input
              type="checkbox"
              name="highestLowercase"
              checked={options.highestLowercase}
              onChange={handleOptionChange}
            />
            Highest lowercase alphabet
          </label>
          <button onClick={handleFinalSubmit}>Show Response</button>
        </div>
      )}

      {responseData && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
