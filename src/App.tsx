import { useEffect, useState } from 'react'
import { db, searchProducts, fetchUniqueValues, Product } from './db.ts'
import { Layout, Select, Flex, Spin, Tooltip } from 'antd';
import Map from './Map.tsx'
import { LoadingOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

function calculateAverage(products: Array<Product>) {
  return products.reduce((sum, product) => sum + product.price, 0) / products.length;
}

const PriceDiff = function({ diff }: { diff: number }) {
  let color = diff > 0 ? "red" : "green";
  let sign = diff > 0 ? "+" : "";
  return (
    <>
      {diff != 0 &&
        <Tooltip placement="right" title="Compared to nation average!">
          <span style={{ color: color, marginLeft: "5px" }}>{sign}{diff.toFixed(1)} kr</span>
        </Tooltip>}
    </>
  );
}

function App({ dbLoaded: dbLoaded }: { dbLoaded: boolean }) {
  const [totalCount, setTotalCount] = useState<number>(0)
  const [totalAverage, setTotalAverage] = useState<number>(0)
  const [areaCount, setAreaCount] = useState<number>(0)
  const [areaAverage, setAreaAverage] = useState<number>(0)
  const [attr, setAttr] = useState<string>("country")
  const [term, setTerm] = useState<string>("SE")
  const [products, setProducts] = useState<Array<Product>>([]);
  const [options, setOptions] = useState<Array<{ value: string, label: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (dbLoaded) {
      setLoading(true);
      searchProducts(attr, term).then((products) => {
        setProducts(products)
        setAreaAverage(calculateAverage(products));
        setAreaCount(products.length);
        setLoading(false)
      });
    }
  }, [attr, term, dbLoaded]);

  useEffect(() => {
    if (dbLoaded) {
      setOptions([{ value: "country.SE", label: "Hela Sverige" }]);
      fetchUniqueValues("city").then((cities) =>
        cities.map((city) =>
          ({ value: `city.${city}`, label: `${city} Stad` })
        )
      ).then((cities) => setOptions(prev => [...prev, ...cities]));

      fetchUniqueValues("county").then((counties) =>
        counties.map((county) =>
          ({ value: `county.${county}`, label: `${county} Kommun` })
        )
      ).then((counties) => setOptions(prev => [...prev, ...counties]));

      fetchUniqueValues("state").then((states) =>
        states.map((state) =>
          ({ value: `state.${state}`, label: `${state} Län` })
        )
      ).then((states) => setOptions(prev => [...prev, ...states]));

      db.vesuvios.count().then((count) => setTotalCount(count));
      searchProducts('country', 'SE').then((products) => {
        setTotalAverage(calculateAverage(products));
      });
    }
  }, [dbLoaded]);

  function onAreaSelect(value: string) {
    const split = value.split(".");
    setAttr(split[0]);
    setTerm(split[1]);
  }

  return (
    <>
      <Layout style={{ background: "#fff" }}>
        <Header style={{ background: "#fff", lineHeight: "normal" }}>
          <Flex vertical={false} align='center' gap={10}>
            <h3>PizzaIndex</h3>
            <div>
              <p>Total: {totalCount}</p>
              <p>Average: {totalAverage.toFixed(1)} kr</p>
            </div>
            <Select
              showSearch
              onSelect={onAreaSelect}
              style={{ width: 200 }}
              placeholder="Search Area"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={options}
            />
            <div>
              <p>Area Total: {areaCount}</p>
              {totalAverage != areaAverage &&
                <p>
                  Area Average: {areaAverage.toFixed(1)} kr
                  <PriceDiff diff={areaAverage - totalAverage} />
                </p>
              }
            </div>
          </Flex>
        </Header>
        <Spin style={{ minHeight: "100%" }} indicator={<LoadingOutlined style={{ fontSize: 80 }} />} spinning={loading}>
          <Layout style={{ height: "100%" }}>
            <Content>
              <Map products={products} />
            </Content>
          </Layout>
        </Spin >
      </Layout >
    </>
  )
}

export default App
