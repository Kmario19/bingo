'use client';

import { useState, useEffect } from 'react';

function useIndexedDB<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const DB_NAME = 'bingoApp';
  const STORE_NAME = 'games';

  const initDB = async () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  };

  useEffect(() => {
    const loadInitialValue = async () => {
      try {
        const db = await initDB();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          const value = request.result;
          setStoredValue(value || initialValue);
        };
      } catch (error) {
        console.error('Error loading from IndexedDB:', error);
        setStoredValue(initialValue);
      }
    };

    loadInitialValue();
  }, [key, initialValue]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      const db = await initDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await store.put(valueToStore, key);
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useIndexedDB;
