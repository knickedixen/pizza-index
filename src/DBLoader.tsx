import App from './App.tsx'
import { createContext, StrictMode, useEffect, useState } from 'react'
import { loadDatabase } from './db.ts'
import { Spin } from 'antd';

type Loading = {
  dbReady: boolean
}

const LoadingContext = createContext<Loading>({
  dbReady: false
});

function DBLoader() {
  const [dbReady, setDbReady] = useState<boolean>(false);
  const loadingContext = {
    dbReady: dbReady
  }

  useEffect(() => {
    loadDatabase().then(() => {
      setDbReady(true)
      console.log("Database loaded");
    });
  }, []);

  return (
    <>
      <LoadingContext.Provider value={loadingContext}>
        {!dbReady && <Spin fullscreen size='large' tip="Setting up database..." />}
        <StrictMode>
          <App />
        </StrictMode>
      </LoadingContext.Provider>
    </>
  );
}

export default DBLoader
export { LoadingContext }
