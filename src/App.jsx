import React, { useRef } from "react";
import SQLiteComponent from "./SQLiteComponent";

const App = () => {
  const sqliteRef = useRef(null);

  const handleInsert = () => {
    if (sqliteRef.current) {
      sqliteRef.current.insertData(); // Calls insertData() from SQLiteComponent
    }
  };

  const handleFetch = () => {
    if (sqliteRef.current) {
      sqliteRef.current.fetchData(); // Calls fetchData() from SQLiteComponent
    }
  };

  return (
    <div>
      <h1>React SQLite App</h1>
      <SQLiteComponent ref={sqliteRef} />
      <button onClick={handleInsert}>Insert Data</button>
      <button onClick={handleFetch}>Fetch Data</button>
    </div>
  );
};

export default App;
