import { Collapse, Table } from "antd";
import { calculateAverage, getAllRestaurants, Product } from './db';
import { RegionSelectionContext } from "./App";
import { useContext, useEffect, useMemo, useState } from "react";
import { SortOrder } from "antd/es/table/interface";
import { UpOutlined, DownOutlined } from '@ant-design/icons';

export default function AreaTables() {
  const { selectedRegion } = useContext(RegionSelectionContext);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<Product>>([]);
  useMemo(() => setProducts(getAllRestaurants()), []);

  useEffect(() => {
    setSelectedProducts(products.filter((product) => !selectedRegion || product.county_code.startsWith(selectedRegion?.id)));
  }, [selectedRegion]);

  const label = (
    <div className='area-info-header'>
      <div className="area-info-toggle">{expanded ? <DownOutlined /> : <UpOutlined />}</div>
      <h2>{selectedRegion?.name ?? "Hela landet"}</h2>
      <span><b>Antal restauranger:</b> {selectedProducts.length}</span>
      <span style={{ marginLeft: 5 }}><b>Snittpris: </b>{calculateAverage(selectedProducts).toFixed(1)}kr</span>
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
        title: "Restaurang",
        dataIndex: "restaurant",
        key: "restaurant",
        defaultSortOrder: null,
        sortDirections: [],
        sorter: null
      },
      {
        title: "Pris",
        dataIndex: "price",
        key: "price",
        defaultSortOrder: "ascend",
        sortDirections: ["ascend", "descend", "ascend"],
        sorter: (a: Product, b: Product) => a.price - b.price,
      }
    ];

  return (
    <div className='table-container'>
      <Collapse
        bordered={false}
        ghost
        size='large'
        onChange={(event) => setExpanded(event.length > 0)}
        items={[{
          label: label, showArrow: false, children:
            <Table dataSource={selectedProducts} columns={columns} size="small" pagination={{ pageSize: 5, showSizeChanger: false }}
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
