import { useEffect, useState, createContext } from 'react'
import { searchProducts, Product, Region, getRegions, RegionType, regionConstants, RegionConstant, getAllRestaurants, getRegion } from './db.ts'
import { Layout, Select, Flex, Spin, Tooltip, Button } from 'antd';
import Map from './Map.tsx'
import { LoadingOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

function calculateAverage(products: Array<Product>) {
  let sum = products.reduce((sum, product) => sum + product.price, 0);
  return sum > 0 ? sum / products.length : 0;
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

type Search = {
  regionType: RegionType | null,
  selectedRegion: string | null,
  setRegionType: (attr: RegionType) => void;
  setSelectedRegion: (term: string) => void;
}

const SearchContext = createContext<Search>({
  regionType: null,
  selectedRegion: null,
  setRegionType: () => { },
  setSelectedRegion: () => { },
});

function App({ dbLoaded: dbLoaded }: { dbLoaded: boolean }) {
  const [totalCount, setTotalCount] = useState<number>(0)
  const [totalAverage, setTotalAverage] = useState<number>(0)
  const [areaCount, setAreaCount] = useState<number>(0)
  const [areaAverage, setAreaAverage] = useState<number>(0)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [regionType, setRegionType] = useState<RegionType>("state")
  const [products, setProducts] = useState<Array<Product>>([]);
  const [regions, setRegions] = useState<Array<Region>>([]);
  const [areaOptions, setAreaOptions] = useState<Array<{ value: string, label: string }>>([]);
  const [regionTypeOptions, setRegionTypeOptions] = useState<Array<{ value: string, label: string }>>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [loadingRegions, setLoadingRegions] = useState<boolean>(false);

  const search = {
    regionType: regionType,
    selectedRegion: selectedRegion,
    setRegionType: setRegionType,
    setSelectedRegion: setSelectedRegion
  }

  useEffect(() => {
    if (dbLoaded) {
      if (selectedRegion) {
        setLoadingProducts(true);
        getRegion(selectedRegion).then(region => {
          if (region && region.type) {
            setRegionType(region.type);
          }
        });
        searchProducts(selectedRegion).then((products) => {
          setProducts(products ?? []);
          setAreaAverage(calculateAverage(products ?? []));
          setAreaCount(products ? products.length : 0);
          setLoadingProducts(false);
        });
      } else {

      }
    }
  }, [selectedRegion, selectedRegion, dbLoaded]);

  useEffect(() => {
    if (dbLoaded) {
      setLoadingRegions(true);
      getRegions(regionType).then((regions) => {
        setRegions(regions);
        setLoadingRegions(false);
      });
    }
  }, [regionType, dbLoaded]);

  useEffect(() => {
    if (dbLoaded) {
      regionConstants.forEach((regionConst: RegionConstant, type: RegionType) => {
        setRegionTypeOptions(prev => [...prev, { value: type, label: regionConst.label }]);
        getRegions(type).then((values) =>
          values.map((value) =>
            ({ value: value.id, label: value.name })
          )
        ).then((counties) => setAreaOptions(prev => [...prev, ...counties]));
      });
      getAllRestaurants().then((products) => {
        setTotalCount(products.length);
        setTotalAverage(calculateAverage(products));
      });
    }
  }, [dbLoaded]);

  const onRegionSelection = function(val: RegionType) {
    if (val != regionType) {
      setProducts([]);
      setSelectedRegion("");
    }
    setRegionType(val);
  };

  return (
    <>
      <SearchContext.Provider value={search}>
        <Layout style={{ background: "#fff" }}>
          <Header style={{ background: "#fff", lineHeight: "normal" }}>
            <Flex vertical={false} align='center' justify='space-between' gap={10}>
              <Flex vertical={false} align='center' gap={20}>
                <h3>PizzaIndex</h3>
                <Select
                  value={regionType}
                  onSelect={onRegionSelection}
                  style={{ width: 200 }}
                  options={regionTypeOptions}
                />
                <Select
                  showSearch
                  value={selectedRegion}
                  onSelect={val => setSelectedRegion(val)}
                  style={{ width: 200 }}
                  placeholder="Search Area"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={areaOptions}
                />
                <Button onClick={() => { setSelectedRegion(""); setProducts([]) }}>Reset</Button>
                {selectedRegion &&
                  <>
                    <div>
                      Restaurants In Area: {areaCount}
                      <br />
                      {totalAverage != areaAverage &&
                        <div>
                          Area Average Price: {areaAverage.toFixed(1)} kr
                          <PriceDiff diff={areaAverage - totalAverage} />
                        </div>
                      }
                    </div>
                  </>
                }
              </Flex>
              <div>
                <p>
                  <b>Restaurants:</b> {totalCount}
                  <br />
                  <b>Average price:</b> {totalAverage.toFixed(1)} kr
                </p>
              </div>
            </Flex>
          </Header>
          <Spin style={{ minHeight: "100%" }} indicator={<LoadingOutlined style={{ fontSize: 80 }} />} spinning={loadingProducts || loadingRegions}>
            <Layout style={{ height: "100%" }}>
              <Content>
                <Map products={products} regions={regions} />
              </Content>
            </Layout>
          </Spin >
        </Layout >
      </SearchContext.Provider>
    </>
  )
}

export default App;
export { calculateAverage, SearchContext as searchContext };
