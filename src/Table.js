import React from "react";
import numeral from "numeral";
import "./Table.css";
import { sortData } from "./helper.js";

function Table({ countries, casesType }) {
  const sortedData = sortData(countries, casesType);
  return (
    <div className="table">
      {sortedData.map((currentCountry) => (
        <tr>
          <td>{currentCountry.country}</td>
          <td>
            <strong>{numeral(currentCountry[casesType]).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
