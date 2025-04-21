import { Button, Layout } from 'antd';
import Map from './Map.tsx'
import { createContext, useState } from 'react';
import { Region } from './db.ts';
import SearchRegionInput from './SearchRegionInput.tsx';
import { CloseOutlined } from '@ant-design/icons';
import AreaTables from './AreaTables.tsx';

type RegionSelection = {
  selectedRegion: Region | null,
  setSelectedRegion: (type: Region | null) => void;
}

const RegionSelectionContext = createContext<RegionSelection>({
  selectedRegion: null,
  setSelectedRegion: () => { },
});

function App() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)

  const regionSelection = {
    selectedRegion: selectedRegion,
    setSelectedRegion: setSelectedRegion,
  }

  return (
    <>
      <RegionSelectionContext.Provider value={regionSelection}>
        <Layout style={{ background: "#fff", height: '100%' }}>
          <div style={{ height: 'calc(100% - 115px)' }} >
            <Map />
            <SearchRegionInput />
            {selectedRegion &&
              <div className="deselect-container">
                <Button onClick={() => setSelectedRegion(null)} className="map-button">
                  <CloseOutlined />
                </Button>
              </div>}
          </div>
          <AreaTables />
        </Layout >
      </RegionSelectionContext.Provider>
    </>
  )
}

export { RegionSelectionContext };
export default App;
