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

const CustomTooltip = ({ active, payload, label }) => { // active : 마우스 활성화, payload : 막대 데이터, label : X, Y 축

  if (!active || !payload || !payload.length) return null

  const d = payload[0].payload  // 현재의 막대 데이터 가져오기

  // 툴팁의 화면 만들기
  return (
    <div
      style={{
        background: "#fff",  // 배경색
        border: "1px solid #ddd",  // 박스 테두리 두께
        padding: "10px",  // 내용과 박스 사이 공간
      }}
    >
      <strong>{label}</strong>  {/* 제품 이름 */}

      <div>2024 매출 : {d.sales2024.toLocaleString()}</div>  {/* 2024 매출 */}
      <div>2024 매출이익 : {d.profit2024.toLocaleString()}</div>  {/* 2024 매출이익 */}
      <div>2024 재료비 : {d.cost2024.toLocaleString()}</div>  {/* 2024 재료비 */}

      <hr />  {/* 가로선 */}

      <div>2025 매출 : {d.sales2025.toLocaleString()}</div>  {/* 2025 매출 */}
      <div>2025 매출이익 : {d.profit2025.toLocaleString()}</div>  {/* 2025 매출이익 */}
      <div>2025 재료비 : {d.cost2025.toLocaleString()}</div>  {/* 2025 재료비 */}
    </div>
  )
}

export default function ProductChart({ data }) {  // Dashboard의 productData를 data라는 이름으로 받음

  // 매출 데이터만 추출
  const chartData = data.map(product => {

    const sales = product.rows.find(r => r.label === "매출")  // 매출 데이터 찾기
    const profit = product.rows.find(r => r.label === "매출이익")  // 매출이익 데이터 찾기

    const sales2024 = sales?.y2024 ?? 0  // 데이터가 있으면 y2024, 없으면 0
    const sales2025 = sales?.y2025 ?? 0

    const profit2024 = profit?.y2024 ?? 0
    const profit2025 = profit?.y2025 ?? 0

    return {  // 그래프에서 사용할 데이터 생성

      product: product.product,

      sales2024,
      profit2024,
      cost2024: sales2024 - profit2024,  // 재료비 계산

      sales2025,
      profit2025,
      cost2025: sales2025 - profit2025,
    }
  })

  return (
    <div style={{ width: "100%", height: 480 }}>  {/* 그래프 영역 */}
      <ResponsiveContainer>  {/* 반응형 */}
        <BarChart data={chartData} barGap={5}>  {/* 가공한 데이터 사용 */}

          <CartesianGrid strokeDasharray="3 3" />  {/* 점선 격자 */}

          <XAxis
            dataKey="product"  // X축(제품명)
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tickFormatter={(value) => value.toLocaleString()}  // 천 단위 쉼표
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} />  {/* 사용자 정의 툴팁 */}

          <Legend
            formatter={(value) => (  // 범례 간격 조정
              <span style={{ marginRight: 20 }}>
                {value}
              </span>
            )}
            align="center"
            wrapperStyle={{
              fontSize: 12,
              fontWeight: 400,
              transform: "translateX(42px)",  // 범례 위치 조정
            }}
          />

          <Bar
            dataKey="profit2024"
            stackId="2024"
            fill="#6B7280"
            name="2024 매출이익"
          />  {/* 2024 매출이익 */}

          <Bar
            dataKey="cost2024"
            stackId="2024"
            fill="#9CA3AF"
            name="2024 매출"
          />  {/* 2024 재료비 */}

          <Bar
            dataKey="profit2025"
            stackId="2025"
            fill="#2563EB"
            name="2025 매출이익"
          />  {/* 2025 매출이익 */}

          <Bar
            dataKey="cost2025"
            stackId="2025"
            fill="#60A5FA"
            name="2025 매출"
          />  {/* 2025 재료비 */}

        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}