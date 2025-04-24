import { Collapse } from "antd";
import { calculateAverage, getAllRestaurants, Product } from './db';
import { AppContext } from "./App";
import { useContext, useEffect, useMemo, useState } from "react";
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import ProductTable from "./ProductTable";

export default function AreaInfo() {
  const { selectedRegion, map } = useContext(AppContext);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<Product>>([]);
  useMemo(() => setProducts(getAllRestaurants()), []);

  useEffect(() => {
    setSelectedProducts(products.filter((product) => !selectedRegion || product.county_code.startsWith(selectedRegion?.id)));
  }, [selectedRegion]);

  const label = (
    <div className="area-info-label">
      <div className="area-info-toggle">{expanded ? <DownOutlined /> : <UpOutlined />}</div>
      <h2>{selectedRegion?.name ?? "Hela landet"}</h2>
      <span><b>Antal restauranger:</b> {selectedProducts.length}</span>
      <span style={{ marginLeft: 5 }}><b>Snittpris: </b>{calculateAverage(selectedProducts).toFixed(1)}kr</span>
    </div>
  );

  useEffect(() => {
    map?.on("movestart", () => {
      setExpanded(false)
    })
  }, [map]);

  return (
    <div className='area-info-container'>
      <Collapse
        bordered={false}
        activeKey={expanded ? "table" : []}
        ghost
        size='large'
        onChange={(event) => setExpanded(event.length > 0)}
        items={[{
          label: label,
          key: "table",
          showArrow: false,
          children: <ProductTable selectedProducts={selectedProducts} />
        }]}
      />
    </div>
  );

}
