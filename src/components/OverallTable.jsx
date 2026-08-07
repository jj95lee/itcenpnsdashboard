import { calcChange, calcYoy, formatNumber, formatYoy } from '../utils/formatters'  // 증감, 증감률, 소수점 표시

export default function OverallTable({ rows = [], unit = "백만원" }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">  {/* 표 내용 시작 */}
        <thead>  {/* 표 머리글 */}
          <tr>
            <th className="col-label">구분</th>
            <th>2024</th>
            <th>2025</th>
            <th>증감</th>
            <th>YOY(%)</th>
          </tr>
        </thead>

        <tbody>  {/* 실제 데이터 들어가는 곳 */}
          {rows.map((row) => { // 반복문
            const change = calcChange(row.y2024, row.y2025)
            const yoy = calcYoy(row.y2024, row.y2025)

            return (
              <tr key={row.label}>
                <td className="col-label">{row.label}</td>
                <td className="col-number">{formatNumber(row.y2024)}</td>
                <td className="col-number">{formatNumber(row.y2025)}</td>
                <td
                  className={`col-number ${change > 0 ? 'positive' :
                      change < 0 ? 'negative' :
                        ''
                    }`}
                >
                  {change > 0 ? '+' : ''}
                  {formatNumber(change)}
                </td>
                <td
                  className={`col-number ${yoy > 0 ? 'positive' :
                      yoy < 0 ? 'negative' :
                        ''
                    }`}
                >
                  {formatYoy(yoy)}  {/* 소수점 + % */}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} className="table-unit">단위: {unit}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}