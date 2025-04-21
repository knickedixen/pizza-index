import { Button, Select } from "antd";
import { useContext, useMemo, useState } from "react";
import { getAllRegions, getRegion, Region } from './db.ts'
import { RegionSelectionContext } from "./App.tsx";
import { SearchOutlined } from '@ant-design/icons';

export default function SearchRegionInput() {
  const [open, setOpen] = useState<boolean>(false);
  const [areaOptions, setAreaOptions] = useState<Array<{ value: string, label: string }>>([]);
  const { selectedRegion, setSelectedRegion } = useContext(RegionSelectionContext);

  useMemo(() => setAreaOptions(getAllRegions().map((value: Region) =>
    ({ value: value.id, label: value.name })
  )), []);

  let content;
  if (open) {
    content = <Select
      autoFocus
      onBlur={() => setOpen(false)}
      showSearch
      value={selectedRegion?.id}
      onSelect={val => { setSelectedRegion(getRegion(val)); setOpen(false); }}
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
