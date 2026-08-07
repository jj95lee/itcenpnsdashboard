export default function CompareTable({ rows, savedFilters }) {
  const makeSummary = (info) => {
    const filters = info?.filters || {};
    const periodFilter = info?.periodFilter;

    return [
      periodFilter
        ? `${periodFilter.start.slice(2)} ~ ${periodFilter.end.slice(2)}`
        : filters.연도 && `${filters.연도}년`,

      filters["New/Sold"],

      filters.구분 && filters.구분.replace("솔루션 - ", ""),

      filters["고객유형"],

      filters["사업명"],

      filters["프로젝트코드"],
    ]
      .filter(
        (v) => v !== "" && v !== null && v !== undefined && v !== "(공백)",
      )
      .join(" / ");
  };

  return (
    <table
      style={{
        width: "100%",
        tableLayout: "fixed",
        borderCollapse: "collapse",
        marginBottom: "20px",
        fontSize: "14px",
        border: "1px solid #ddd",
      }}
    >
      <colgroup>
        <col style={{ width: "7.5%" }} />

        {savedFilters.map((filter) => (
          <col
            key={filter.id}
            style={{ width: `${91 / savedFilters.length}%` }}
          />
        ))}
      </colgroup>

      <thead>
        <tr>
          <th style={thStyle}></th>

          {savedFilters.map((filter, index) => (
            <th key={filter.id} style={thStyle}>
              <div style={{ fontSize: "15px" }}>필터 {index + 1}</div>

              <div style={infoStyle}>{makeSummary(filter)}</div>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <td
              style={{
                ...tdStyle,
                fontWeight: "600",
                fontSize: "11px",
                background: "#f8fafc",
              }}
            >
              {row.label}
            </td>

            {savedFilters.map((filter, index) => (
              <td key={filter.id} style={numberTdStyle}>
                {(row.values[index] || 0).toLocaleString()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "12px",
  background: "#f1f5f9",
  fontWeight: "700",
  textAlign: "center",
  color: "#333",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "center",
  background: "#fff",
};

const numberTdStyle = {
  ...tdStyle,
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
};

const infoStyle = {
  marginTop: "6px",
  fontSize: "12px",
  fontWeight: "400",
  color: "#666",
  whiteSpace: "nowrap",
};
