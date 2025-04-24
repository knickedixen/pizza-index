import { Table } from "antd";
import { SortOrder } from "antd/es/table/interface";
import { getRegion, Product } from './db';
import { latLng } from "leaflet";
import { useContext } from "react";
import { AppContext } from "./App";

export default function ProductTable({ selectedProducts }: { selectedProducts: Array<Product> }) {
  const { map, selectedRegion, setSelectedRegion } = useContext(AppContext);

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
    <Table
      dataSource={selectedProducts}
      rowKey={(product) => "table-" + product.code}
      columns={columns}
      size="small"
      pagination={{ pageSize: 5, showSizeChanger: false }}
      onRow={(product) => {
        return {
          onClick: () => {
            setSelectedRegion(
              getRegion(selectedRegion?.type == "county" ?
                product.county_code : product.state_code)
            );
            map?.flyTo(latLng(product.latitude, product.longitude), 15);
          },
        };
      }}
    />
  );
}
