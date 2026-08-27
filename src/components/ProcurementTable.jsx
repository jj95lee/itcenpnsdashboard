import { calcYoy, formatNumber, formatYoy } from '../utils/formatters'

export default function ProcurementTable({ rows, unit = '백만원' }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">

        <thead>
          <tr>
            <th className="col-label">구분</th>
            <th>2024</th>
            <th>2025</th>
            <th>2026 (진행 중)</th>
            <th>2025 YoY</th>
            <th>2026 YoY (진행 중)</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {

            // 2025 YoY = (2025 - 2024) / 2024
            const yoy2025 = calcYoy(row.y2024, row.y2025)

            // 2026 YoY = (2026 - 2025) / 2025
            const yoy2026 = calcYoy(row.y2025, row.y2026)

            return (
              <tr key={row.label}>

                <td className="col-label">
                  {row.label}
                </td>

                <td className="col-number">
                  {formatNumber(row.y2024)}
                </td>

                <td className="col-number">
                  {formatNumber(row.y2025)}
                </td>

                <td className="col-number">
                  {formatNumber(row.y2026)}
                </td>

                <td
                  className={`col-number ${
                    yoy2025 > 0
                      ? 'positive'
                      : yoy2025 < 0
                        ? 'negative'
                        : ''
                  }`}
                >
                  {formatYoy(yoy2025)}
                </td>

                <td
                  className={`col-number ${
                    yoy2026 > 0
                      ? 'positive'
                      : yoy2026 < 0
                        ? 'negative'
                        : ''
                  }`}
                >
                  {formatYoy(yoy2026)}
                </td>

              </tr>
            )
          })}
        </tbody>

        <tfoot>
          <tr>
            <td
              colSpan={6}
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