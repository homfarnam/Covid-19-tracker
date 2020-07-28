import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

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
      label: function (tooltipItem: { value: any; }, data: any) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // include a dollar sign in ticks
          callback: function (value: any, index: any, values: any) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data: { [x: string]: { [x: string]: any; }; cases: any[] }, casesType = "cases") => {
  const chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    if (lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };

      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

type Data = any[]

type chartData = {
  x: string,
  y: number
}

const LineGraph = ({casesType='cases', ...props}) => {
  const [data, setData] = useState<Data>([]);

  // https://disease.sh/v3/covid-19/historical/all?lastdays=120

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          //   console.log(chartData);
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: " rgba(204,16,52,1)",
                borderColor: "#cc1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
};

export default LineGraph;
