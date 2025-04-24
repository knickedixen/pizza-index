import { Button } from "antd"
import SearchRegionInput from './SearchRegionInput.tsx';
import { CloseOutlined } from '@ant-design/icons';
import { useContext } from "react";
import { AppContext } from "./App";

export default function MapControls() {
  const { selectedRegion, setSelectedRegion } = useContext(AppContext);

  return (
    <>
      <SearchRegionInput />
      {
        selectedRegion &&
        <div className="deselect-button">
          <Button onClick={() => setSelectedRegion(null)} className="map-button">
            <CloseOutlined />
          </Button>
        </div>
      }
    </>
  );
}
