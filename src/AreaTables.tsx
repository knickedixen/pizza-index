import { Collapse, Table } from "antd";
import { calculateAverage, getAllRestaurants, Product } from './db';
import { RegionSelectionContext } from "./App";
import { useContext, useEffect, useMemo, useState } from "react";
import { SortOrder } from "antd/es/table/interface";

export default function AreaTables() {
  const { selectedRegion } = useContext(RegionSelectionContext);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [selectedProducts, setSelectedProducts] = useState<Array<Product>>([]);
  useMemo(() => setProducts(getAllRestaurants()), []);

  useEffect(() => {
    setSelectedProducts(products.filter((product) => !selectedRegion || product.county_code.startsWith(selectedRegion?.id)));
  }, [selectedRegion]);

  const label = (
    <div className='area-info-header'>
      <p><b>{selectedRegion?.name ?? "Sweden"}</b></p>
      <span>Restaurants: {selectedProducts.length}</span>
      <span>Mean: {calculateAverage(selectedProducts).toFixed(1)}kr</span>
    </div>
  );

  const columns: {
    title: string,
    dataIndex: string,
    key: string,
    defaultSortOrder: SortOrder,
    sortDirections: SortOrder[],
    sorter: any
  }[] = [
      {
        title: "Restaurant",
        dataIndex: "restaurant",
        key: "restaurant",
        defaultSortOrder: null,
        sortDirections: [],
        sorter: null
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend", "ascend"],
        sorter: (a: Product, b: Product) => a.price - b.price,
      }
    ];

  return (
    <div className='table-container'>
      <Collapse bordered={false} ghost size='large' expandIconPosition='start' items={[{
        label: label, showArrow: false, children:
          <Table dataSource={products} columns={columns} size="small" pagination={{ pageSize: 5, showSizeChanger: false }}
            onRow={() => {
              return {
                //onClick: () => { alert("TODO Postcode: " + product.postcode) },
              };
            }}
          />
      }]} />
    </div>
  );

}
