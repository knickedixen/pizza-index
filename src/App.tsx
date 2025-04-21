import { Button, Layout } from 'antd';
import Map from './Map.tsx'
import { createContext, useEffect, useState } from 'react';
import { getRegion, Region } from './db.ts';
import SearchRegionInput from './SearchRegionInput.tsx';
import { CloseOutlined } from '@ant-design/icons';

type RegionSelection = {
  region: Region | null,
  selectedRegion: string | null,
  setRegion: (type: Region) => void;
  setSelectedRegion: (region: string | null) => void;
}

const RegionSelectionContext = createContext<RegionSelection>({
  region: null,
  selectedRegion: null,
  setRegion: () => { },
  setSelectedRegion: () => { },
});

function App() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null)

  const regionSelection = {
    region: region,
    setRegion: setRegion,
    selectedRegion: selectedRegion,
    setSelectedRegion: setSelectedRegion
  }

  useEffect(() => {
    if (selectedRegion) {
      setRegion(getRegion(selectedRegion));
    } else {
      setRegion(null);
    }
  }, [selectedRegion]);

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
        </Layout >
      </RegionSelectionContext.Provider>
    </>
  )
}

export { RegionSelectionContext };
export default App;
