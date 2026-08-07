import { calcChange, calcYoy, formatNumber, formatYoy } from '../utils/formatters'  // 증감, 증감률, 소수점 표시

export default function CustomerTable({ rows, unit = '백만원' }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">  {/* 표 내용 시작 */}

        <thead>  {/* 표 머리글 */}
          <tr>
            <th className="col-customer">고객사 분류</th>
            <th className="col-label">구분</th>
            <th>2024</th>
            <th>2025</th>
            <th>증감</th>
            <th>YOY(%)</th>
          </tr>
        </thead>

        <tbody>  {/* 실제 데이터 들어가는 곳 */}
          {rows.map((customer) =>  // 제품 반복
            customer.rows.map((row, index) => {

              const change = calcChange(row.y2024, row.y2025)
              const yoy = calcYoy(row.y2024, row.y2025)

              return (
                <tr
                  key={`${customer.customer}-${row.label}`}  // 각 행을 구분
                  className={index === 0 ? 'customer-group-start' : ''}  
                >

                  {index === 0 && (  // 첫 번째 줄일 때만 제품명 출력
                    <td
                      className="col-customer"  // CSS 스타일 적용
                      rowSpan={customer.rows.length}  // 셀을 여러 줄에 걸쳐 합침(셀 병합)
                    >
                      {customer.customer}
                    </td>
                  )}

                  <td className="col-label">
                    {row.label}
                  </td>

                  <td className="col-number">
                    {formatNumber(row.y2024)}
                  </td>

                  <td className="col-number">
                    {formatNumber(row.y2025)}
                  </td>

                  <td  
                    className={`col-number ${
                      change >= 0 ? 'positive' : 'negative'
                    }`}  // 증감에 따라 폰트 색 변화
                  >
                    {change >= 0 ? '+' : ''}  
                    {formatNumber(change)}
                  </td>

                  <td
                    className={`col-number ${
                      yoy >= 0 ? 'positive' : 'negative'
                    }`}
                  >
                    {formatYoy(yoy)}  {/* 소수점 + % */}
                  </td>

                </tr>
              )
            })
          )}
        </tbody>

        <tfoot>
          <tr>
            <td
              colSpan={6}  // 6개 열을 하나로 (셀 병합)
              className="table-unit"
            >
              단위: {unit}
            </td>
          </tr>
        </tfoot>

      </table>
    </div>
  )
}