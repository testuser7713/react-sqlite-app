import { useEffect, useState } from "react";

const DB_PATH = "/sql-wasm.js"; // Path to sql-wasm.js in the public folder

const SQLiteComponent = () => {
  const [db, setDb] = useState(null);
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const SQL = await window.initSqlJs({
          locateFile: (file) => `${process.env.PUBLIC_URL}/sql-wasm.wasm`,
        });

        const request = indexedDB.open("MyDatabase", 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore("sqlite", { keyPath: "id" });
        };

        request.onsuccess = (event) => {
          const idb = event.target.result;
          const transaction = idb.transaction("sqlite", "readwrite");
          const store = transaction.objectStore("sqlite");
          const getRequest = store.get(1);

          getRequest.onsuccess = () => {
            let database;
            if (getRequest.result) {
              database = new SQL.Database(new Uint8Array(getRequest.result.data));
            } else {
              database = new SQL.Database();
              database.run(
                "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT);"
              );
            }
            setDb(database);
          };
        };
      } catch (error) {
        console.error("Error loading database:", error);
      }
    };

    loadDatabase();
  }, []);

  const saveToIndexedDB = () => {
    if (!db) return;

    const binaryArray = db.export();
    const request = indexedDB.open("MyDatabase", 1);

    request.onsuccess = (event) => {
      const idb = event.target.result;
      const transaction = idb.transaction("sqlite", "readwrite");
      const store = transaction.objectStore("sqlite");
      store.put({ id: 1, data: binaryArray });
    };
  };

  const insertData = () => {
    if (!db || !inputValue) return;
    db.run("INSERT INTO messages (text) VALUES (?)", [inputValue]);
    setInputValue("");
    saveToIndexedDB();
    fetchData();
  };

  const fetchData = () => {
    if (!db) return;
    const result = db.exec("SELECT * FROM messages");
    const rows = result.length
      ? result[0].values.map(([id, text]) => ({ id, text }))
      : [];
    setData(rows);
  };

  useEffect(() => {
    if (db) fetchData();
  }, [db]);

  return (
    <div>
      <h2>SQLite in React (Persistent)</h2>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter message"
      />
      <button onClick={insertData}>Insert</button>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default SQLiteComponent;
