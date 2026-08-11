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
    // 매출처에 "조달"이라는 단어가 포함된 데이터만
    if (!String(row["사업명"] || "").includes("조달")) return;

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

export function makeCompareData(savedFilters, masterRows) {
  const results = savedFilters.map((filter, index) => {
    let sales = 0;
    let profit = 0;
    let cost = 0;

    // 저장된 필터 조건으로 다시 검색
    const filtered = masterRows.filter((row) => {
      // 일반 필터
      for (const key in filter.filters) {
        const filterValue = filter.filters[key];

        if (!filterValue) continue;

        // "(공백)"은 실제 빈 셀로 처리
        if (filterValue === "(공백)") {
          if (row[key] !== "" && row[key] !== null && row[key] !== undefined) {
            return false;
          }
        } else {
          // 사업명은 포함 검색
          if (key === "사업명") {
            if (!String(row[key] || "").includes(String(filterValue))) {
              return false;
            }
          } else {
            // 나머지는 기존처럼 정확히 일치
            if (String(row[key]) !== String(filterValue)) {
              return false;
            }
          }
        }
      }

      // 다중 선택 필터
      if (filter.multiFields && filter.multiSelected) {
        for (const key in filter.multiFields) {
          if (!filter.multiFields[key]) continue;

          const selected = filter.multiSelected[key];

          if (!selected || selected.length === 0) continue;

          const value =
            row[key] === "" || row[key] == null ? "(공백)" : row[key];

          if (!selected.some((item) => String(item) === String(value))) {
            return false;
          }
        }
      }

      return true;
    });
    console.log("저장된 필터:", filter.filters);
    console.log("필터 적용 전:", masterRows.length);
    console.log("필터 적용 후:", filtered.length);

    // BusinessList와 동일한 방식으로 그룹화
    const grouped = {};
    const groupedRows = [];

    filtered.forEach((row) => {
      const key = [
        row["id"],
        row["연도"],
        row["New/Sold"],
        row["매출유형"],
        row["구분"],
        row["고객유형"],
        row["매출처"],
        row["최종고객"],
        row["담당자"],
        row["확도"],
        row["진행도"],
        row["프로젝트코드"],
        row["사업명"],
      ].join("|");

      if (!grouped[key]) {
        grouped[key] = {
          key,
          basic: row,
          metrics: {},
          metricList: [],
        };

        groupedRows.push(grouped[key]);
      }

      grouped[key].metrics[row.metric] = row;
      grouped[key].metricList.push(row);
    });

    // 금액 계산
    groupedRows.forEach((group) => {
      const salesRow = group.metricList?.find((item) => item.metric === "매출");

      const profitRow = group.metricList?.find(
        (item) => item.metric === "매출이익",
      );

      const costRow = group.metricList?.find(
        (item) => item.metric === "매출원가",
      );

      // 조회기간 적용
      if (
        filter.periodFilter &&
        filter.periodFilter.start &&
        filter.periodFilter.end
      ) {
        const months = getPeriodMonths(
          filter.periodFilter.start,
          filter.periodFilter.end,
        );

        // 매출
        if (salesRow) {
          sales += months.reduce((monthSum, m) => {
            if (String(group.basic["연도"]) !== String(m.year)) {
              return monthSum;
            }

            return (
              monthSum +
              Number(String(salesRow[`${m.month}월`] || 0).replace(/,/g, ""))
            );
          }, 0);
        }

        // 매출이익
        if (profitRow) {
          profit += months.reduce((monthSum, m) => {
            if (String(group.basic["연도"]) !== String(m.year)) {
              return monthSum;
            }

            return (
              monthSum +
              Number(String(profitRow[`${m.month}월`] || 0).replace(/,/g, ""))
            );
          }, 0);
        }

        // 매출원가
        if (costRow) {
          cost += months.reduce((monthSum, m) => {
            if (String(group.basic["연도"]) !== String(m.year)) {
              return monthSum;
            }

            return (
              monthSum +
              Number(String(costRow[`${m.month}월`] || 0).replace(/,/g, ""))
            );
          }, 0);
        }
      }

      // 조회기간 미적용
      else {
        if (salesRow) {
          sales += Number(String(salesRow["연간계"] || 0).replace(/,/g, ""));
        }

        if (profitRow) {
          profit += Number(String(profitRow["연간계"] || 0).replace(/,/g, ""));
        }

        if (costRow) {
          cost += Number(String(costRow["연간계"] || 0).replace(/,/g, ""));
        }
      }
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
      label: "매출원가",
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
