import { GraphSample, GraphSeries } from "./graphHistory";
import { linePath } from "./graphPath";
import { Axis, niceAxis, ticksOf } from "./graphScale";

const WIDTH = 280;
const HEIGHT = 200;
const MARGIN = { left: 36, right: 10, top: 10, bottom: 28 };
/** The time axis is at least this long, s, so a run starts on a readable scale. */
const MIN_SECONDS = 30;
/** The temperature axis is at least this tall, °C. */
const MIN_DEGREES = 10;

interface LiveGraphProps {
  series: GraphSeries[];
  samples: GraphSample[];
}

/** A temperature against time chart, drawn from the recorded samples. */
export default function LiveGraph({ series, samples }: LiveGraphProps) {
  const values = samples.flatMap((s) => series.map((line) => s[line.key]).filter((v): v is number => v !== null));
  const lastT = samples.length ? samples[samples.length - 1].t : 0;

  const yAxis: Axis = niceAxis(Math.min(...values, 20), Math.max(...values, 25), MIN_DEGREES, 4);
  const xAxis: Axis = niceAxis(0, Math.max(lastT, MIN_SECONDS), MIN_SECONDS, 5);
  xAxis.min = 0;

  const plotW = WIDTH - MARGIN.left - MARGIN.right;
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const x = (t: number) => MARGIN.left + ((t - xAxis.min) / (xAxis.max - xAxis.min)) * plotW;
  const y = (v: number) => MARGIN.top + (1 - (v - yAxis.min) / (yAxis.max - yAxis.min)) * plotH;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label="Temperature against time">
      {ticksOf(yAxis).map((v) => (
        <g key={`y${v}`}>
          <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(v)} y2={y(v)} stroke="var(--sim-neutral-200)" />
          <text x={MARGIN.left - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="var(--sim-neutral-600)">
            {v}
          </text>
        </g>
      ))}
      {ticksOf(xAxis).map((v) => (
        <text key={`x${v}`} x={x(v)} y={HEIGHT - MARGIN.bottom + 12} textAnchor="middle" fontSize="9" fill="var(--sim-neutral-600)">
          {v}
        </text>
      ))}
      <line x1={MARGIN.left} x2={MARGIN.left} y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} stroke="var(--sim-neutral-900)" strokeWidth="1.5" />
      <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={HEIGHT - MARGIN.bottom} y2={HEIGHT - MARGIN.bottom} stroke="var(--sim-neutral-900)" strokeWidth="1.5" />
      <text x={MARGIN.left + plotW / 2} y={HEIGHT - 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--sim-neutral-600)">
        TIME (s)
      </text>
      <text x={8} y={MARGIN.top + plotH / 2} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--sim-neutral-600)" transform={`rotate(-90 8 ${MARGIN.top + plotH / 2})`}>
        °C
      </text>
      {series.map((line) => (
        <path key={line.key} d={linePath(samples, line.key, x, y)} fill="none" stroke={line.color} strokeWidth="2" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
