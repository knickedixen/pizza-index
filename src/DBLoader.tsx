import App from './App.tsx'
import { StrictMode, useEffect, useState } from 'react'
import { loadDatabase } from './db.ts'
import { Spin } from 'antd';

function DBLoader() {
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadDatabase().then(() => {
      setDbLoaded(true)
      console.log("Database loaded");
    });
  }, []);

  return (
    <>
      {!dbLoaded && <Spin fullscreen size='large' tip="Setting up database..." />}
      <StrictMode>
        <App dbLoaded={dbLoaded} />
      </StrictMode>
    </>
  );
}

export default DBLoader
