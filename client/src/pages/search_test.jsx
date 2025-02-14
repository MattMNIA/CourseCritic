import React, { useState } from 'react';

export const SearchTest = () => {
  const [searchParams, setSearchParams] = useState({});
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/courses/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchParams)
      });

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching courses:', error);
    }
  };

  return (
    <div>
      <h1>Search Test Page</h1>
      <form onSubmit={handleSubmit}>
        {/* Add your form inputs here */}
      </form>
      {results.length > 0 && (
        <div>
          {/* Display results here */}
        </div>
      )}
    </div>
  );
};
export default SearchTest
