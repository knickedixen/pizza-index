import { Button, Select } from "antd";
import { useContext, useMemo, useState } from "react";
import { getAllRegions, getRegion, Region } from './db.ts'
import { AppContext } from "./App.tsx";
import { SearchOutlined } from '@ant-design/icons';
import { geoJson } from "leaflet";

export default function SearchRegionInput() {
  const [open, setOpen] = useState<boolean>(false);
  const [areaOptions, setAreaOptions] = useState<Array<{ value: string, label: string }>>([]);
  const { selectedRegion, setSelectedRegion, map } = useContext(AppContext);

  useMemo(() => setAreaOptions(getAllRegions().map((value: Region) =>
    ({ value: value.id, label: value.name })
  )), []);

  const onSelect = function(val: string) {
    let region = getRegion(val);
    setSelectedRegion(region);
    map?.fitBounds(geoJson(region.geojson).getBounds());
    setOpen(false);
  }

  let content;
  if (open) {
    content = <Select
      autoFocus
      onBlur={() => setOpen(false)}
      showSearch
      value={selectedRegion?.id}
      onSelect={onSelect}
      placeholder="Sök län eller kommun..."
      style={{ width: 250, height: 48 }}
      size="large"
      optionFilterProp="label"
      options={areaOptions}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
      }
    />
  } else {
    content = <Button
      className="map-button"
      title="Sök område"
      onClick={() => setOpen(true)}>
      <SearchOutlined />
    </Button>
  }

  return (
    <div className="search-container">
      {content}
    </div>
  );

}
