import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  // active : 마우스 활성화, payload : 막대 데이터, label : X, Y 축

  if (!active || !payload || !payload.length) return null;

  const d = payload[0].payload; // 현재의 막대 데이터 가져오기

  // 툴팁의 화면 만들기
  return (
    <div
      style={{
        background: "#fff", // 배경색
        border: "1px solid #ddd", //박스 테두리 두께
        padding: "10px", // 내용과 박스 사이 공간
      }}
    >
      <strong>{label}</strong> {/* X축 값 (카테고리 이름 : 공공, 금융, 기업) */}
      <div>
        2024 매출 : {d.sales2024.toLocaleString()} {/* 매출, 1000단위 쉼표 */}
      </div>
      <div>
        2024 매출이익 : {d.profit2024.toLocaleString()} {/* 매출이익 */}
      </div>
      <div>
        2024 매출원가 : {d.cost2024.toLocaleString()} {/* 매출원가 */}
      </div>
      <hr />
      <div>2025 매출 : {d.sales2025.toLocaleString()}</div>
      <div>2025 매출이익 : {d.profit2025.toLocaleString()}</div>
      <div>2025 매출원가 : {d.cost2025.toLocaleString()}</div>
    </div>
  );
};

export default function CustomerChart({ data }) {
  // data는 dash.jsx에서

  const chartData = data.map((category) => {
    const sales = category.rows.find((r) => r.label === "매출");

    const profit = category.rows.find((r) => r.label === "매출이익");

    const sales2024 = sales?.y2024 ?? 0; // 데이터가 있으면 Y.2024 없으면 0
    const sales2025 = sales?.y2025 ?? 0;

    const profit2024 = profit?.y2024 ?? 0;
    const profit2025 = profit?.y2025 ?? 0;

    return {
      // 사용할 데이터 만듦

      customer: category.customer,

      sales2024,
      profit2024,
      cost2024: sales2024 - profit2024, // 매출원가 계산

      sales2025,
      profit2025,
      cost2025: sales2025 - profit2025,
    };
  });

  return (
    // 그래프 그릴 영역
    <div style={{ width: "100%", height: 310 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} barGap={5}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="customer" // 범례
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => value.toLocaleString()} // 소수점 1000
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Tooltip content={<CustomTooltip />} /> {/* 사용자 정의 툴팁 */}
          <Legend
            formatter={(
              value, // 범례 간격 조정
            ) => <span style={{ marginRight: 20 }}>{value}</span>}
            align="center"
            wrapperStyle={{
              fontSize: 12,
              fontWeight: 400,
              transform: "translateX(42px)", // 범례 위치 조정
            }}
          />
          <Bar // 여기부터 막대를 하나씩 만듦
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
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
