import React, { useState, useRef } from "react";
import SQLiteComponent from "./SQLiteComponent";

const App = () => {
  const sqliteRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [fetchedNumber, setFetchedNumber] = useState(null);
  const [updateText, setUpdateText] = useState("");
  const [updateNumber, setUpdateNumber] = useState("");

  const handleSearch = () => {
    if (sqliteRef.current && sqliteRef.current.fetchDataByText) {
      const numberValue = sqliteRef.current.fetchDataByText(searchText);
      setFetchedNumber(numberValue);
    }
  };

  const handleUpdate = () => {
    if (sqliteRef.current && sqliteRef.current.updateNumberByText) {
      sqliteRef.current.updateNumberByText(updateText, updateNumber);
      alert(`Updated "${updateText}" to new number: ${updateNumber}`);
    }
  };

  return (
    <div>
      <h1>React SQLite App</h1>
      <SQLiteComponent ref={sqliteRef} />

      <h3>Search for shirt-inventory by putting the shirt ID eg., shirt5</h3>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Enter text to search"
      />
      <button onClick={handleSearch}>Fetch Number</button>
      {fetchedNumber !== null && (
        <p>Number value for "{searchText}": <strong>{fetchedNumber}</strong></p>
      )}

      <h3>Once user clicks checkout button, reduce the shirt-inventory in Database by the amount of shirts user is buying</h3>
      <input
        type="text"
        value={updateText}
        onChange={(e) => setUpdateText(e.target.value)}
        placeholder="Enter text to update"
      />
      <input
        type="number"
        value={updateNumber}
        onChange={(e) => setUpdateNumber(e.target.value)}
        placeholder="Enter new number value"
      />
      <button onClick={handleUpdate}>Update Number</button>
    </div>
  );
};

export default App;
