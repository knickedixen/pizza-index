import { Button, Select } from "antd";
import { useContext, useEffect, useState } from "react";
import { getRegions, RegionType, regionConstants, RegionConstant } from './db.ts'
import { LoadingContext } from "./DBLoader";
import { RegionSelectionContext } from "./Map";
import { SearchOutlined } from '@ant-design/icons';

export default function SearchRegionInput() {
  const [open, setOpen] = useState<boolean>(false);
  const [areaOptions, setAreaOptions] = useState<Array<{ value: string, label: string }>>([]);
  const { selectedRegion, setSelectedRegion } = useContext(RegionSelectionContext);
  const { dbReady } = useContext(LoadingContext);

  useEffect(() => {
    if (dbReady) {
      regionConstants.forEach((_regionConst: RegionConstant, type: RegionType) => {
        getRegions(type).then((values) =>
          values.map((value) =>
            ({ value: value.id, label: value.name })
          )
        ).then((counties) => setAreaOptions(prev => [...prev, ...counties]));
      });
    }
  }, [dbReady]);

  let content;
  if (open) {
    content = <Select
      autoFocus
      onBlur={() => setOpen(false)}
      showSearch
      value={selectedRegion}
      onSelect={val => { setSelectedRegion(val); setOpen(false); }}
      placeholder="Search Area"
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
      className="search-info-button"
      title="Search"
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
