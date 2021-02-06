import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";

import React, { useState, useEffect, useRef } from "react";
import InfoBox from "./InfoBox.js";
import Map from "./Map.js";
import Table from "./Table.js";
import { sortData, printStat, printStatTotal } from "./helper.js";
import LineGraph from "./LineGraph.js";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [countryValue, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapChange, setMapChange] = useState(true);

  //###################  LOAD  DROPDOWN   ###################################

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countriesData = data.map((JSON_country) => ({
            name: JSON_country.country,
            value: JSON_country.countryInfo.iso2,
          }));
          const sortedData = sortData(data, casesType);

          setCountries(countriesData);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  //###################  INITIAL  INFORMATIONS FOR WORLDWIDE   ###################################

  useEffect(() => {
    const loadWorldwideData = async () => {
      await fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data);
        });
    };
    loadWorldwideData();
  }, []);

  //###################  AS  COUNTRY  CHANGES   ############################

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapChange(true);
        if (countryCode === "worldwide") setMapCenter([34.80746, -40.4796]);
        else setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  //##############################  APP   ###################################

  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={countryValue}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed={true}
            isGreen={false}
            isBlue={false}
            active={casesType === "cases"}
            onClick={(e) => {
              setCasesType("cases");
              const sortedData = sortData(mapCountries, casesType);
              setTableData(sortedData);
              setMapChange(false);
            }}
            title="Coronavirus cases"
            cases={printStat(countryInfo.todayCases)}
            total={printStatTotal(countryInfo.cases)}
          />
          <InfoBox
            isRed={false}
            isGreen={true}
            isBlue={false}
            active={casesType === "recovered"}
            onClick={(e) => {
              setCasesType("recovered");
              const sortedData = sortData(mapCountries, casesType);
              setTableData(sortedData);
              setMapChange(false);
            }}
            title="Recovered"
            cases={printStat(countryInfo.todayRecovered)}
            total={printStatTotal(countryInfo.recovered)}
          />
          <InfoBox
            isRed={false}
            isGreen={false}
            isBlue={true}
            active={casesType === "deaths"}
            onClick={(e) => {
              setCasesType("deaths");
              const sortedData = sortData(mapCountries, casesType);
              setTableData(sortedData);
              setMapChange(false);
            }}
            title="Deaths"
            cases={printStat(countryInfo.todayDeaths)}
            total={printStatTotal(countryInfo.deaths)}
          />
        </div>

        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          change={mapChange}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>
            Live {casesType.charAt(0).toUpperCase() + casesType.slice(1)} by
            Country
          </h3>
          <Table countries={tableData} casesType={casesType} />

          <h3>
            Live {casesType.charAt(0).toUpperCase() + casesType.slice(1)}{" "}
            Worldwide
          </h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
