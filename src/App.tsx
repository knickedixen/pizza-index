import { Button } from 'antd';
import Map from './Map.tsx'
import { createContext, useState } from 'react';
import { Region } from './db.ts';
import SearchRegionInput from './SearchRegionInput.tsx';
import { CloseOutlined } from '@ant-design/icons';
import AreaInfo from './AreaInfo.tsx';

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
        <div className="map-container">
          <Map />
          <SearchRegionInput />
          {selectedRegion &&
            <div className="deselect-button">
              <Button onClick={() => setSelectedRegion(null)} className="map-button">
                <CloseOutlined />
              </Button>
            </div>}
        </div>
        <AreaInfo />
      </RegionSelectionContext.Provider>
    </>
  )
}

export { RegionSelectionContext };
export default App;
