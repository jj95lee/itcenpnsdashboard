import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

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

      <div>2024 매출 : {d.sales2024.toLocaleString()}</div>
      <div>2024 매출이익 : {d.profit2024.toLocaleString()}</div>
      <div>2024 매출원가 : {d.cost2024.toLocaleString()}</div>

      <hr />

      <div>2025 매출 : {d.sales2025.toLocaleString()}</div>
      <div>2025 매출이익 : {d.profit2025.toLocaleString()}</div>
      <div>2025 매출원가 : {d.cost2025.toLocaleString()}</div>

      <hr />

      <div>2026 매출 : {d.sales2026.toLocaleString()}</div>
      <div>2026 매출이익 : {d.profit2026.toLocaleString()}</div>
      <div>2026 매출원가 : {d.cost2026.toLocaleString()}</div>
    </div>
  )
}

export default function ProductChart({ data }) {

  // 제품별 그래프 데이터 생성
  const chartData = data.map(product => {

    const sales = product.rows.find(r => r.label === "매출")
    const profit = product.rows.find(r => r.label === "매출이익")

    // 2024
    const sales2024 = sales?.y2024 ?? 0
    const profit2024 = profit?.y2024 ?? 0

    // 2025
    const sales2025 = sales?.y2025 ?? 0
    const profit2025 = profit?.y2025 ?? 0

    // 2026
    const sales2026 = sales?.y2026 ?? 0
    const profit2026 = profit?.y2026 ?? 0

    return {

      product: product.product,

      // 2024
      sales2024,
      profit2024,
      cost2024: sales2024 - profit2024,

      // 2025
      sales2025,
      profit2025,
      cost2025: sales2025 - profit2025,

      // 2026
      sales2026,
      profit2026,
      cost2026: sales2026 - profit2026,
    }
  })

  return (
    <div style={{ width: "100%", height: 480 }}>
      <ResponsiveContainer>

        <BarChart
          data={chartData}
          barGap={5}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="product"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tickFormatter={(value) => value.toLocaleString()}
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            formatter={(value) => (
              <span style={{ marginRight: 20 }}>
                {value}
              </span>
            )}
            align="center"
            wrapperStyle={{
              fontSize: 12,
              fontWeight: 400,
              transform: "translateX(42px)",
            }}
          />

          {/* ================= 2024 ================= */}

          <Bar
            dataKey="profit2024"
            stackId="2024"
            fill="#6B7280"
            name="2024 매출이익"
          />

          <Bar
            dataKey="cost2024"
            stackId="2024"
            fill="#9CA3AF"
            name="2024 매출"
          />

          {/* ================= 2025 ================= */}

          <Bar
            dataKey="profit2025"
            stackId="2025"
            fill="#2563EB"
            name="2025 매출이익"
          />

          <Bar
            dataKey="cost2025"
            stackId="2025"
            fill="#60A5FA"
            name="2025 매출"
          />

          {/* ================= 2026 ================= */}

          <Bar
            dataKey="profit2026"
            stackId="2026"
            fill="#1D4ED8"
            name="2026 매출이익"
          />

          <Bar
            dataKey="cost2026"
            stackId="2026"
            fill="#197aea"
            name="2026 매출"
          />

        </BarChart>

      </ResponsiveContainer>
    </div>
  )
}