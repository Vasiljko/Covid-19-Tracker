import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import "./LineGraph.css";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridlines: false,
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0.0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ casesType = "cases" }) {
  const [data, setData] = useState({});

  //###################  GET  ALL  THE  DATA  FOR  CHART   #################

  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastData;
    for (let date in data[casesType]) {
      if (lastData) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastData,
        };
        chartData.push(newDataPoint);
      }
      lastData = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=355")
      .then((response) => response.json())
      .then((data) => {
        const chartData = buildChartData(data, casesType);
        setData(chartData);
      });
  }, [casesType]);

  return (
    <div className="linegraph">
      {data && data.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
