// ============================== 전체 ==============================

export function makeOverallData(rows) {
  let sales2024 = 0;
  let sales2025 = 0;

  let profit2024 = 0;
  let profit2025 = 0;

  rows.forEach((row) => {
    const year = String(row["연도"]);
    const metric = row["metric"];
    const total = Number(row["연간계"] || 0);

    if (metric === "매출") {
      if (year === "2024") sales2024 += total;
      if (year === "2025") sales2025 += total;
    }

    if (metric === "매출이익") {
      if (year === "2024") profit2024 += total;
      if (year === "2025") profit2025 += total;
    }
  });

  return [
    {
      label: "매출",
      y2024: sales2024,
      y2025: sales2025,
    },
    {
      label: "매출이익",
      y2024: profit2024,
      y2025: profit2025,
    },
  ];
}

// ============================== 제품별 ==============================

export function makeProductData(rows) {
  const result = {};

  rows.forEach((row) => {
    let product = row["구분"] || "(공백)";
    product = product.replace("솔루션 - ", "").trim();

    // ===== 숨길 항목 =====
    const hideProducts = [
      "(공백)",
      "IFRS",
      "서비스",
      "유지보수",
      "상품",
      "기타(상품)",
      "CMVP",
      //   "AppIron",
      //   "Keypad",
      //   "Vaccine",
      //   "EdgeDB",
      //   "enxection",
      "",
    ];

    // 숨길 항목이면 제외
    if (hideProducts.includes(product)) return;

    const year = String(row["연도"]);
    const metric = row["metric"];
    const total = Number(row["연간계"] || 0);

    if (!result[product]) {
      result[product] = {
        sales2024: 0,
        sales2025: 0,
        profit2024: 0,
        profit2025: 0,
      };
    }

    if (metric === "매출") {
      if (year === "2024") result[product].sales2024 += total;
      if (year === "2025") result[product].sales2025 += total;
    }

    if (metric === "매출이익") {
      if (year === "2024") result[product].profit2024 += total;
      if (year === "2025") result[product].profit2025 += total;
    }
  });

  return Object.entries(result).map(([product, value]) => ({
    product,
    rows: [
      {
        label: "매출",
        y2024: value.sales2024,
        y2025: value.sales2025,
      },
      {
        label: "매출이익",
        y2024: value.profit2024,
        y2025: value.profit2025,
      },
    ],
  }));
}

// ============================== 갱신형 ==============================

export function makeRenewalData(rows) {
  let sales2024 = 0;
  let sales2025 = 0;

  let profit2024 = 0;
  let profit2025 = 0;

  rows.forEach((row) => {
    // 사업명에 "갱신"이 없으면 제외
    if (!String(row["사업명"] || "").includes("갱신")) return;

    const year = String(row["연도"]);
    const metric = row["metric"];
    const total = Number(row["연간계"] || 0);

    if (metric === "매출") {
      if (year === "2024") sales2024 += total;
      if (year === "2025") sales2025 += total;
    }

    if (metric === "매출이익") {
      if (year === "2024") profit2024 += total;
      if (year === "2025") profit2025 += total;
    }
  });

  return [
    {
      label: "매출",
      y2024: sales2024,
      y2025: sales2025,
    },
    {
      label: "매출이익",
      y2024: profit2024,
      y2025: profit2025,
    },
  ];
}

// ============================== 조달 ==============================

export function makeProcurementData(rows) {
  let sales2024 = 0;
  let sales2025 = 0;

  let profit2024 = 0;
  let profit2025 = 0;

  rows.forEach((row) => {
    // 매출처가 "조달"인 데이터만
    if (row["매출처"] !== "조달") return;

    const year = String(row["연도"]);
    const metric = row["metric"];
    const total = Number(row["연간계"] || 0);

    if (metric === "매출") {
      if (year === "2024") sales2024 += total;
      if (year === "2025") sales2025 += total;
    }

    if (metric === "매출이익") {
      if (year === "2024") profit2024 += total;
      if (year === "2025") profit2025 += total;
    }
  });

  return [
    {
      label: "매출",
      y2024: sales2024,
      y2025: sales2025,
    },
    {
      label: "매출이익",
      y2024: profit2024,
      y2025: profit2025,
    },
  ];
}

// ============================== 고객사 ==============================

export function makeCustomerData(rows) {
  const result = {};

  rows.forEach((row) => {
    let customer = row["고객유형"] || "(공백)";

    // ===== 표시할 고객유형 설정 =====

    // 공백 숨기기
    if (customer === "(공백)") return;

    // 기업 숨기기
    // if (customer === "기업") return;

    // 금융 숨기기
    // if (customer === "금융") return;

    // 공공 숨기기
    // if (customer === "공공") return;
    const year = String(row["연도"]);
    const metric = row["metric"];
    const total = Number(row["연간계"] || 0);

    if (!result[customer]) {
      result[customer] = {
        sales2024: 0,
        sales2025: 0,
        profit2024: 0,
        profit2025: 0,
      };
    }

    if (metric === "매출") {
      if (year === "2024") result[customer].sales2024 += total;
      if (year === "2025") result[customer].sales2025 += total;
    }

    if (metric === "매출이익") {
      if (year === "2024") result[customer].profit2024 += total;
      if (year === "2025") result[customer].profit2025 += total;
    }
  });

  return Object.entries(result).map(([customer, value]) => ({
    customer,
    rows: [
      {
        label: "매출",
        y2024: value.sales2024,
        y2025: value.sales2025,
      },
      {
        label: "매출이익",
        y2024: value.profit2024,
        y2025: value.profit2025,
      },
    ],
  }));
}

export function makeCompareData(savedFilters) {
  const results = savedFilters.map((filter, index) => {
    let sales = 0;
    let profit = 0;
    let cost = 0;

    filter.rows.forEach((row) => {
      row.metricList.forEach((metricRow) => {
        console.log("metric 확인:", metricRow.metric);
        if (metricRow.metric === "매출") {
          if (
            filter.periodFilter &&
            filter.periodFilter.start &&
            filter.periodFilter.end
          ) {
            const months = getPeriodMonths(
              filter.periodFilter.start,
              filter.periodFilter.end,
            );

            months.forEach((m) => {
              if (String(row.basic["연도"]) === String(m.year)) {
                sales += Number(
                  String(metricRow[m.month + "월"] || 0).replace(/,/g, ""),
                );
              }
            });
          } else {
            sales += Number(metricRow["연간계"] || 0);
          }
        }

        if (metricRow.metric === "매출이익") {
          if (
            filter.periodFilter &&
            filter.periodFilter.start &&
            filter.periodFilter.end
          ) {
            const months = getPeriodMonths(
              filter.periodFilter.start,
              filter.periodFilter.end,
            );

            months.forEach((m) => {
              if (String(row.basic["연도"]) === String(m.year)) {
                profit += Number(
                  String(metricRow[m.month + "월"] || 0).replace(/,/g, ""),
                );
              }
            });
          } else {
            profit += Number(metricRow["연간계"] || 0);
          }
        }

        if (metricRow.metric === "매출원가") {
          if (
            filter.periodFilter &&
            filter.periodFilter.start &&
            filter.periodFilter.end
          ) {
            const months = getPeriodMonths(
              filter.periodFilter.start,
              filter.periodFilter.end,
            );

            months.forEach((m) => {
              if (String(row.basic["연도"]) === String(m.year)) {
                cost += Number(
                  String(metricRow[m.month + "월"] || 0).replace(/,/g, ""),
                );
              }
            });
          } else {
            cost += Number(metricRow["연간계"] || 0);
          }
        }
      });
    });

    return {
      label: `필터 ${index + 1}`,
      sales,
      profit,
      cost,
    };
  });
  console.log("비교 결과:", results);
  return [
    {
      label: "매출",
      values: results.map((item) => item.sales),
    },
    {
      label: "매출이익",
      values: results.map((item) => item.profit),
    },
    {
      label: "재료비",
      values: results.map((item) => item.cost),
    },
  ];
}

export function calcPeriodAmount(rows, start, end) {
  const months = getPeriodMonths(start, end);

  let result = {
    수주: 0,
    매출: 0,
    매출원가: 0,
    매출이익: 0,
  };

  rows.forEach((row) => {
    row.metricList.forEach((metricRow) => {
      const metric = metricRow.metric;

      months.forEach((m) => {
        if (String(row.basic["연도"]) === String(m.year)) {
          const rawValue = metricRow[m.month + "월"];

          const value = Number(String(rawValue || 0).replace(/,/g, "")) || 0;

          if (result[metric] !== undefined) {
            result[metric] += value;
          }
        }
      });
    });
  });

  return result;
}

// 조회기간 월 리스트 생성
export function getPeriodMonths(start, end) {
  const result = [];

  let [startYear, startMonth] = start.split("-").map(Number);
  let [endYear, endMonth] = end.split("-").map(Number);

  while (
    startYear < endYear ||
    (startYear === endYear && startMonth <= endMonth)
  ) {
    result.push({
      year: startYear,
      month: startMonth,
    });

    startMonth++;

    if (startMonth > 12) {
      startMonth = 1;
      startYear++;
    }
  }

  return result;
}
