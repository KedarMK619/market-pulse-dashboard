import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export interface RingSegment {
  name: string;
  value: number;
  color: string;
}

interface SegmentedRingProps {
  segments: RingSegment[];
  centerPercent: string;
  centerValue: string;
  height?: number;
}

/**
 * Thick segmented donut chart with centered headline KPI and legend dots.
 */
export const SegmentedRing = ({
  segments,
  centerPercent,
  centerValue,
  height = 190,
}: SegmentedRingProps) => {
  return (
    <div className="w-full">
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={76}
              paddingAngle={5}
              cornerRadius={8}
              stroke="none"
            >
              {segments.map((seg) => (
                <Cell key={seg.name} fill={seg.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1C1C20",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centered KPI */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-muted-foreground">
            {centerPercent}
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            {centerValue}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
        {segments.map((seg) => (
          <div key={seg.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span>{seg.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
