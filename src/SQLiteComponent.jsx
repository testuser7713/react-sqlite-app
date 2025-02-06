import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

const DB_PATH = "/sql-wasm.js"; // Path to sql-wasm.js in the public folder

const SQLiteComponent = forwardRef((props, ref) => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const SQL = await window.initSqlJs({
          locateFile: (file) => `${process.env.PUBLIC_URL}/sql-wasm.wasm`,
        });

        const request = indexedDB.open("MyDatabase", 1);

        request.onupgradeneeded = (event) => {
          const idb = event.target.result;
          idb.createObjectStore("sqlite", { keyPath: "id" });
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
                "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, number INTEGER);"
              );

              database.run("INSERT INTO messages (text, number) VALUES (?, ?)", ["shirt1", 10]);
              database.run("INSERT INTO messages (text, number) VALUES (?, ?)", ["shirt2", 10]);
              database.run("INSERT INTO messages (text, number) VALUES (?, ?)", ["shirt3", 10]);
              database.run("INSERT INTO messages (text, number) VALUES (?, ?)", ["shirt4", 10]);
              database.run("INSERT INTO messages (text, number) VALUES (?, ?)", ["shirt5", 10]);
              database.run("INSERT INTO messages (text, number) VALUES (?, ?)", ["shirt6", 10]);
              database.run("INSERT INTO messages (text, number) VALUES (?, ?)", ["shirt7", 10]);

              saveToIndexedDB(database);
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

  const saveToIndexedDB = (database) => {
    const binaryArray = database.export();
    const request = indexedDB.open("MyDatabase", 1);

    request.onsuccess = (event) => {
      const idb = event.target.result;
      const transaction = idb.transaction("sqlite", "readwrite");
      const store = transaction.objectStore("sqlite");
      store.put({ id: 1, data: binaryArray });
    };
  };

  const fetchDataByText = (searchText) => {
    if (!db || !searchText) return null;

    const query = "SELECT number FROM messages WHERE text = ?";
    const result = db.exec(query, [searchText]);

    if (result.length && result[0].values.length) {
      return result[0].values[0][0];
    } else {
      return null;
    }
  };

  const updateNumberByText = (text, newNumber) => {
    if (!db || !text || !newNumber) return;

    const query = "UPDATE messages SET number = ? WHERE text = ?";
    db.run(query, [parseInt(newNumber, 10), text]);

    saveToIndexedDB(db);
    console.log(`Updated "${text}" to number: ${newNumber}`);
  };

  useImperativeHandle(ref, () => ({
    fetchDataByText,
    updateNumberByText,
  }));

  return <div></div>;
});

export default SQLiteComponent;
