const months = [
  "1월","2월","3월","4월","5월","6월",
  "7월","8월","9월","10월","11월","12월"
];

export default function MetricTable() {

  return (
    <table className="metric-table">
      <thead>
        <tr>
          <th>항목</th>

          {months.map(month => (
            <th key={month}>{month}</th>
          ))}

          <th>연간계</th>
        </tr>
      </thead>

      <tbody>

        <tr>
          <td>매출</td>

          {months.map(month => (
            <td key={month}>
              <input type="number" placeholder="0" />
            </td>
          ))}

          <td>자동계산</td>
        </tr>

        <tr>
          <td>매출이익</td>

          {months.map(month => (
            <td key={month}>
              <input type="number" placeholder="0" />
            </td>
          ))}

          <td>자동계산</td>
        </tr>

      </tbody>
    </table>
  );
}