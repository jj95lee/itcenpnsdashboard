import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {

  if (!active || !payload || !payload.length) return null

  const d = payload[0].payload

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        padding: "10px",
      }}
    >
      <strong>{label}</strong>

      <div>
        2024 : {d.y2024.toLocaleString()}
      </div>

      <div>
        2025 : {d.y2025.toLocaleString()}
      </div>

      <div>
        2026 : {d.y2026.toLocaleString()}
      </div>
    </div>
  )
}

export default function ProcurementChart({ data }) {

  return (
    <div style={{ width: '100%', height: 170 }}>
      <ResponsiveContainer>

        <BarChart
          data={data}
          barSize={80}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
          />

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
                  gap: 40,
                  marginLeft: 50
                }}
              >

                {/* 2024 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      background: "#808995",
                      marginRight: 6,
                    }}
                  />

                  <span
                    style={{
                      color: "#808995",
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  >
                    2024
                  </span>
                </div>

                {/* 2025 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      background: "#4284F2",
                      marginRight: 6,
                    }}
                  />

                  <span
                    style={{
                      color: "#4284F2",
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  >
                    2025
                  </span>
                </div>

                {/* 2026 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      background: "#1D4ED8",
                      marginRight: 6,
                    }}
                  />

                  <span
                    style={{
                      color: "#1D4ED8",
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  >
                    2026
                  </span>
                </div>

              </div>
            )}
          />

          {/* 2024 */}
          <Bar dataKey="y2024" name="2024" barSize={50}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.label === "매출"
                    ? "#9CA3AF"
                    : "#6B7280"
                }
              />
            ))}
          </Bar>

          {/* 2025 */}
          <Bar dataKey="y2025" name="2025" barSize={50}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.label === "매출"
                    ? "#60A5FA"
                    : "#2563EB"
                }
              />
            ))}
          </Bar>

          {/* 2026 */}
          <Bar dataKey="y2026" name="2026" barSize={50}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.label === "매출"
                    ? "#197aea"
                    : "#1D4ED8"
                }
              />
            ))}
          </Bar>

        </BarChart>

      </ResponsiveContainer>
    </div>
  )
}