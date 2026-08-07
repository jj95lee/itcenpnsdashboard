import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const filterColors = [
  {
    strong: "#6B7280", // 필터1
    light: "#D1D5DB",
  },
  {
    strong: "#3B82F6", // 필터2
    light: "#BFDBFE",
  },
  {
    strong: "#10B981", // 필터3
    light: "#BBF7D0",
  },
  {
    strong: "#F97316", // 필터4
    light: "#FED7AA",
  },
  {
    strong: "#EC4899", // 필터5
    light: "#FBCFE8",
  },
  {
    strong: "#9333EA", // 보라
    light: "#E9D5FF",
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        padding: "10px",
      }}
    >
      <strong>{label}</strong>

      {payload.map((item, index) => (
        <div key={index}>
          {item.name} : {item.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

export default function CompareChart({ data, savedFilters }) {
  // 필터 개수만큼 x축 생성

  const chartData = savedFilters.map((_, index) => {
    return {
      label: `필터 ${index + 1}`,

      매출: data.find((item) => item.label === "매출")?.values?.[index] || 0,

      매출이익:
        data.find((item) => item.label === "매출이익")?.values?.[index] || 0,

      매출원가:
        data.find((item) => item.label === "매출원가")?.values?.[index] || 0,
    };
  });

  return (
    <div
      style={{
        width: "100%",
        height: 250,
      }}
    >
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="label" tick={{ fontSize: 12 }} />

          <YAxis
            tickFormatter={(value) => value.toLocaleString()}
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            content={() => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "30px",
                  marginTop: "10px",
                  fontSize: "12px",
                  paddingLeft: "80px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#6B7280",
                      display: "inline-block",
                      borderRadius: "2px",
                    }}
                  />
                  매출
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#D1D5DB",
                      display: "inline-block",
                      borderRadius: "2px",
                    }}
                  />
                  매출이익
                </div>
              </div>
            )}
          />

          <Bar dataKey="매출" name="매출" barSize={30}>
            {savedFilters.map((_, index) => (
              <Cell
                key={`sales-${index}`}
                fill={filterColors[index % filterColors.length].strong}
              />
            ))}
          </Bar>

          <Bar dataKey="매출이익" name="매출이익" barSize={30}>
            {savedFilters.map((_, index) => (
              <Cell
                key={`profit-${index}`}
                fill={filterColors[index % filterColors.length].light}
              />
            ))}
          </Bar>

          <Bar
            dataKey="매출원가"
            name="매출원가"
            fill="transparent"
            legendType="none"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
