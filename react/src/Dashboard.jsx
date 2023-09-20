import * as d3 from "d3";
import React from "react";
import { Tooltip, XAxis, YAxis, Lines, Points } from "./components";
import jsonData from "./data/data.json";
import { usePreviousData } from "./util/usePreviousData";
import "./index.css";

const defaultHeight = 500;
const defaultWidth = 800;
const defaultMargin = {
  left: 70,
  right: 20,
  top: 20,
  bottom: 60
};

const populationData = jsonData.populationData;

const Dashboard = ({
  width = defaultWidth,
  height = defaultHeight,
  data = populationData,
  margin = defaultMargin
}) => {
  const [activePoint, setActivePoint] = React.useState();
  const [isolatedCountry, setIsolatedCountry] = React.useState();

  const filteredData = React.useMemo(() => {
    return isolatedCountry
      ? data.filter(({ country }) => country === isolatedCountry)
      : data;
  }, [data, isolatedCountry]);

  const getFlattenedData = React.useCallback((data) => {
    return data.reduce((all, { country, values }) => {
      return [...all, ...values.map((v) => ({ ...v, country }))];
    }, []);
  }, []);

  const colorScale = React.useMemo(() => {
    const flattenedData = getFlattenedData(data);
    return d3
      .scaleSequential()
      .domain(d3.extent(flattenedData, (d) => d.value))
      .interpolator(d3.interpolateRainbow);
  }, [getFlattenedData, data]);

  const getColor = React.useCallback(
    (values) => {
      const mean = d3.mean(values.map(({ value }) => value));
      return colorScale(mean);
    },
    [colorScale]
  );

  const scaleX = React.useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([1960, 2019])
        .range([margin.left, width - margin.right])
        .nice(),
    [margin, width]
  );

  const scaleY = React.useMemo(() => {
    const flattenedData = getFlattenedData(filteredData);
    return d3
      .scaleLinear()
      .domain(d3.extent(flattenedData, (d) => d.value))
      .range([height - margin.bottom, margin.top])
      .nice();
  }, [margin, height, getFlattenedData, filteredData]);

  const scale = React.useCallback(
    (data, additionalData = {}) => {
      return data.map(({ year, value }) => ({
        x: scaleX(year),
        y: scaleY(value),
        year,
        value,
        ...additionalData
      }));
    },
    [scaleX, scaleY]
  );

  const delaunay = React.useMemo(() => {
    const flattenedData = getFlattenedData(filteredData);
    return d3.Delaunay.from(
      flattenedData,
      (d) => scaleX(d.year),
      (d) => scaleY(d.value)
    );
  }, [getFlattenedData, filteredData, scaleX, scaleY]);

  const onMouseMove = React.useCallback(
    (event) => {
      const flattenedData = getFlattenedData(filteredData);
      const [xPosition, yPosition] = d3.pointer(event);

      const index = delaunay.find(xPosition, yPosition);
      setActivePoint(flattenedData[index]);
    },
    [setActivePoint, getFlattenedData, filteredData, delaunay]
  );

  const onMouseLeave = React.useCallback(() => {
    setActivePoint(undefined);
  }, [setActivePoint]);

  const handleClick = React.useCallback(() => {
    if (isolatedCountry) {
      setIsolatedCountry(undefined);
    } else {
      const { country } = activePoint;
      setIsolatedCountry(country);
    }
  }, [activePoint, setIsolatedCountry, isolatedCountry]);

  const nextLineData = React.useMemo(() => {
    return filteredData.reduce((d, { country, values }) => {
      d[country] = scale(values, { color: getColor(values) });
      return d;
    }, {});
  }, [filteredData, getColor, scale]);

  const nextPointsData = React.useMemo(() => {
    if (!activePoint) {
      return {};
    }

    return filteredData.reduce((d, { country, values }) => {
      const activeValues = values.filter(
        ({ year }) => year === activePoint.year
      );
      d[country] = scale(activeValues, { color: getColor(values) });
      return d;
    }, {});
  }, [filteredData, activePoint, getColor, scale]);

  const previousLineData = usePreviousData(nextLineData);
  const previousPointsData = usePreviousData(nextPointsData);


  return (
    <main>
      <title>World Population 1960-2019</title>
      <Lines
        nextData={nextLineData}
        previousData={previousLineData}
        width={width}
        height={height}
        margin={margin}
      />
      <Points
        nextData={nextPointsData}
        previousData={previousPointsData}
        width={width}
        height={height}
        margin={margin}
      />
      <svg
        className="chart"
        height={height}
        width={width}
        transform={`translate(${margin.left}, ${margin.top})`}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}
      >
        <text
          x={(height / 2 - margin.top / 2) * -1}
          dy={15}
          transform="rotate(-90)"
          textAnchor="middle"
        >
          Population
        </text>
        <text
          x={width / 2 + margin.left / 2}
          y={height - 10}
          textAnchor="middle"
        >
          Year
        </text>
        <XAxis scale={scaleX} margin={margin} height={height} />
        <YAxis scale={scaleY} margin={margin} />
        {activePoint && (
          <Tooltip
            x={scaleX(activePoint.year)}
            y={scaleY(activePoint.value)}
            width={200}
            height={100}
            canvasWidth={width}
            margin={margin}
          >
            <p className="bold">{activePoint.country}</p>
            <p>
              {activePoint.year} - {activePoint.value}
            </p>
          </Tooltip>
        )}
      </svg>
    </main>
  );
};

export default Dashboard;
