import { Layout } from 'antd';
import Map from './Map.tsx'

function App() {

  return (
    <>
      <Layout style={{ background: "#fff" }}>
        <Layout style={{ height: "100%" }}>
          <Map />
        </Layout>
      </Layout >
    </>
  )
}

export default App;
