import React from "react";
import * as d3 from "d3";

const defaultLineWidth = 2;
const animationDuration = 200;

export const Lines = ({
  nextData,
  lineWidth = defaultLineWidth,
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
    (ctx, data) => {
      const [first, ...rest] = data;
      ctx.strokeStyle = first.color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      if (rest.length) {
        rest.forEach(({ x, y }) => {
          ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
    },
    [lineWidth]
  );

  React.useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const timer = d3.timer((elapsed) => {
      ctx.clearRect(0, 0, width, height);
      Object.values(data).forEach((d) => {
        draw(ctx, d);
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
