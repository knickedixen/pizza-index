import { useEffect, useState, createContext, useContext } from 'react'
import { searchProducts, Product, getRegions, RegionType, regionConstants, RegionConstant, getAllRestaurants, getRegion } from './db.ts'
import { Layout, Select, Flex, Tooltip, Button } from 'antd';
import Map from './Map.tsx'
import { LoadingContext } from './DBLoader.tsx';

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

type RegionSelection = {
  regionType: RegionType | null,
  selectedRegion: string | null,
  setRegionType: (attr: RegionType) => void;
  setSelectedRegion: (term: string) => void;
}

const RegionSelectionContext = createContext<RegionSelection>({
  regionType: null,
  selectedRegion: null,
  setRegionType: () => { },
  setSelectedRegion: () => { },
});

function App() {
  const [totalCount, setTotalCount] = useState<number>(0)
  const [totalAverage, setTotalAverage] = useState<number>(0)
  const [areaCount, setAreaCount] = useState<number>(0)
  const [areaAverage, setAreaAverage] = useState<number>(0)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [regionType, setRegionType] = useState<RegionType>("state")
  const [products, setProducts] = useState<Array<Product>>([]);
  const [areaOptions, setAreaOptions] = useState<Array<{ value: string, label: string }>>([]);
  const [regionTypeOptions, setRegionTypeOptions] = useState<Array<{ value: string, label: string }>>([]);
  const { dbReady } = useContext(LoadingContext);

  const regionSelection = {
    regionType: regionType,
    selectedRegion: selectedRegion,
    setRegionType: setRegionType,
    setSelectedRegion: setSelectedRegion
  }

  useEffect(() => {
    if (dbReady) {
      if (selectedRegion) {
        getRegion(selectedRegion).then(region => {
          if (region && region.type) {
            setRegionType(region.type);
          }
        });
        searchProducts(selectedRegion).then((products) => {
          setProducts(products ?? []);
          setAreaAverage(calculateAverage(products ?? []));
          setAreaCount(products ? products.length : 0);
        });
      } else {
        setProducts([]);
      }
    }
  }, [selectedRegion, dbReady]);

  useEffect(() => {
    if (dbReady) {
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
  }, [dbReady]);

  const onRegionSelection = function(val: RegionType) {
    if (val != regionType) {
      setProducts([]);
      setSelectedRegion("");
    }
    setRegionType(val);
  };

  return (
    <>
      <RegionSelectionContext.Provider value={regionSelection}>
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
          <Layout style={{ height: "100%" }}>
            <Content>
              <Map products={products} />
            </Content>
          </Layout>
        </Layout >
      </RegionSelectionContext.Provider>
    </>
  )
}

export default App;
export { calculateAverage, RegionSelectionContext };
