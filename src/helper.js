import React, { useRef } from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 240,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 300,
  },
  deaths: {
    hex: "#5c6491",
    multiplier: 1200,
  },
};

//###################  SORT  DATA  FOR  TABLE   ############################

export const sortData = (data, casesType) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    return a[casesType] > b[casesType] ? -1 : 1;
  });
  return sortedData;
};

//###################  FORMATING  OUTPUT   #################################

export const printStat = (stat) =>
  stat
    ? stat >= 1000
      ? `+${numeral(stat).format("0.0a")}`
      : `+${stat}`
    : `+0`;

export const printStatTotal = (stat) =>
  stat ? (stat >= 1000 ? `${numeral(stat).format("0.0a")}` : `${stat}`) : `0`;

//###################  SHOW CIRCLES AND POPUPS   ###########################

export const showDataOnMap = (data, casesType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={{
        color: casesTypeColors[casesType].hex,
        fillColor: casesTypeColors[casesType].hex,
      }}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info_container">
          <div
            className="info_flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info_name">{country.country}</div>
          <div className="info_cases">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info_recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info_deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
