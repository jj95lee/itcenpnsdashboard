import {
  BarChart,
  Bar,
  Cell,  // 막대의 색 지정
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

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
      <strong>{label}</strong>  {/* 항목 이름 */}

      <div>
        2024 : {d.y2024.toLocaleString()}  {/* 2024, 1000단위 쉼표 */}
      </div>

      <div>
        2025 : {d.y2025.toLocaleString()}  {/* 2025 */}
      </div>
    </div>
  )
}

export default function ProcurementChart({ data }) {  // Dashboard의 procurementData를 data라는 이름으로 받음

  return (
    <div style={{ width: '100%', height: 170 }}>  {/* 그래프 영역 */}
      <ResponsiveContainer>  {/* 반응형 */}
        <BarChart data={data} barSize={80}>  {/* 받아온 data를 사용, 막대 너비 80 */}

          <CartesianGrid strokeDasharray="3 3" />  {/* 점선 격자 */}

          <XAxis
            dataKey="label"  // X축(매출, 매출이익)
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tickFormatter={(value) => value.toLocaleString()}  // 천 단위 쉼표
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} />  {/* 사용자 정의 툴팁 */}

          <Legend  // 직접 만든 범례 사용
            content={() => (
              <div style={{ display: "flex", justifyContent: "center", gap: 40, marginLeft: 50 }}>  {/* 가로로 정렬 */}

                <div style={{ display: "flex", alignItems: "center" }}>  {/* 세로로 정렬 */}
                  <div
                    style={{  // 네모칸 스타일
                      width: 12,
                      height: 12,
                      background: "#808995",
                      marginRight: 6,
                    }}
                  />
                  <span  // 범례 글씨
                    style={{
                      color: "#808995",
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  >
                    2024
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>  {/* 동일 */}
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

              </div>
            )}
          />

          <Bar dataKey="y2024" name="2024">  {/* 2024 막대 */}
            {data.map((entry, index) => (  // map은 색을 다르게 칠하기 위해
              <Cell
                key={index}
                fill={entry.label === "매출" ? "#9CA3AF" : "#6B7280"}
              />
            ))}
          </Bar>

          <Bar dataKey="y2025" name="2025">  {/* 2025 막대 */}
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.label === "매출" ? "#60A5FA" : "#2563EB"}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}