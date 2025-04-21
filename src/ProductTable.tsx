import { Table } from "antd";
import { SortOrder } from "antd/es/table/interface";
import { Product } from './db';

export default function ProductTable({ selectedProducts }: { selectedProducts: Array<Product> }) {
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
      columns={columns}
      size="small"
      pagination={{ pageSize: 5, showSizeChanger: false }}
      onRow={() => {
        return {
          //onClick: () => { alert("TODO Postcode: " + product.postcode) },
        };
      }}
    />
  );
}
