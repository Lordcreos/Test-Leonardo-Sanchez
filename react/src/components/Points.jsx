import React from "react";
import * as d3 from "d3";
import get from "lodash/get";

const defaultPointSize = 3;
const animationDuration = 200;
const lineColor = "#D1DCE5";

export const Points = ({
  nextData,
  pointSize = defaultPointSize,
  previousData,
  width,
  height,
  margin,
  duration = animationDuration
}) => {
  const canvasRef = React.useRef();
  const [data, setData] = React.useState(nextData);

  const interpolator = React.useMemo(() => {
    return d3.interpolate(previousData, nextData);
  }, [previousData, nextData]);

  const draw = React.useCallback(
    (ctx, { x, y, color = "black" }) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
      ctx.fill();
    },
    [pointSize]
  );

  const drawLine = React.useCallback(
    (ctx, x) => {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, height - margin.bottom);
      ctx.closePath();
      ctx.stroke();
    },
    [height, margin]
  );

  React.useLayoutEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const timer = d3.timer((elapsed) => {
      ctx.clearRect(0, 0, width, height);

      const x = get(Object.values(data), "[0][0].x");
      if (x) {
        drawLine(ctx, x);
      }
      Object.values(data).forEach((points) => {
        points.forEach((d) => draw(ctx, d));
      });

      const step = duration ? elapsed / duration : 1;
      if (elapsed > duration) {
        timer.stop();
        setData(interpolator(1));
      }
      setData(interpolator(step));
    });

    return () => timer.stop();
  }, [
    setData,
    canvasRef,
    data,
    draw,
    drawLine,
    duration,
    interpolator,
    previousData,
    nextData,
    height,
    width
  ]);

  return (
    <canvas
      className="chart"
      height={height}
      width={width}
      style={{
        marginLeft: margin.left,
        marginRight: margin.right,
        marginTop: margin.top,
        marginBottom: margin.bottom
      }}
      ref={canvasRef}
    />
  );
};
