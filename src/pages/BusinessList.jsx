import React, { useEffect, useState, useMemo } from "react";
import "./BusinessList.css";
import BusinessFilter from "../components/BusinessFilter";
import BusinessModal from "../components/BusinessModal";
import { deleteBusiness } from "../utils/googleSheet";
import { makeCompareData, getPeriodMonths } from "../utils/dashboardData";
import { calcPeriodAmount } from "../utils/dashboardData";
import CompareTable from "../components/CompareTable";
import CompareModal from "../components/CompareModal";

export default function BusinessList({ masterData, reloadData }) {
  const [filterData, setFilterData] = useState(() => {
    const saved = sessionStorage.getItem("filterData");

    return saved
      ? JSON.parse(saved)
      : {
          연도: "",
          "New/Sold": "",
          팀: "",
          구분: "",
          매출유형: "",
          고객유형: "",
          매출처: "",
          최종고객: "",
          담당자: "",
          확도: "",
          수주월: "",
          매출월: "",
          진행도: "",
          프로젝트코드: "",
          사업명: "",
          조회시작연도: "",
          조회시작월: "",
          조회종료연도: "",
          조회종료월: "",
        };
  });

  const [periodFilter, setPeriodFilter] = useState(() => {
    const saved = sessionStorage.getItem("periodFilter");

    return saved
      ? JSON.parse(saved)
      : {
          start: "",
          end: "",
        };
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const handleResetPeriod = () => {
    setPeriodFilter((prev) => ({
      ...prev,
      start: "",
      end: "",
    }));

    setPeriodResult(null);
  };

  const handleResetCompare = () => {
    // 저장된 필터 먼저 완전히 삭제
    sessionStorage.removeItem("savedFilters");

    // 상태 초기화
    setSavedFilters([]);

    setSaved1(false);
    setSaved2(false);

    setCompareResult([]);
    setCompareOpen(false);

    showToast("필터 초기화 완료");
  };

  const [usePeriodFilter, setUsePeriodFilter] = useState(() => {
    return sessionStorage.getItem("usePeriodFilter") === "true";
  });

  const [lockYearFilter, setLockYearFilter] = useState(false);

  const [autoData, setAutoData] = useState({});

  const [resultRows, setResultRows] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [periodResult, setPeriodResult] = useState(null);

  const [savedFilters, setSavedFilters] = useState(() => {
    const saved = sessionStorage.getItem("savedFilters");

    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  const [saved1, setSaved1] = useState(false);
  const [saved2, setSaved2] = useState(false);

  const [compareResult, setCompareResult] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const [manualFilters, setManualFilters] = useState({});

  const getCompareInfo = () => {
    const info = {};

    Object.keys(filterData).forEach((key) => {
      let value = filterData[key];

      // 일반 선택값
      if (value && value !== "") {
        info[key] = value;
      }

      // 다중 선택값
      if (multiFields[key] && multiSelected[key]?.length) {
        info[key] = multiSelected[key].join(", ");
      }
    });

    return info;
  };

  const [openModal, setOpenModal] = useState(false);

  const [editData, setEditData] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const [multiSelected, setMultiSelected] = useState({
    연도: [],
    팀: [],
    "New/Sold": [],
    매출유형: [],
    구분: [],
    고객유형: [],
    매출처: [],
    최종고객: [],
    담당자: [],
    진행도: [],
    확도: [],
    수주월: [],
    매출월: [],
  });

  // 체크박스 상태
  const [multiFields, setMultiFields] = useState({
    연도: false,
    팀: false,
    "New/Sold": false,
    매출유형: false,
    구분: false,
    고객유형: false,
    매출처: false,
    최종고객: false,
    담당자: false,
    진행도: false,
    확도: false,
    수주월: false,
    매출월: false,
  });

  const [expandedRows, setExpandedRows] = useState({});

  // const progressColor = {
  //   미진행: "#FFFFFF",
  //   진행중: "#FFFFCC",
  //   완료: "#D9D9D9",
  // };

  const hasPeriodAmount = (row) => {
    if (!usePeriodFilter || !periodFilter.start || !periodFilter.end) {
      return true;
    }

    // 매출 데이터만 검사
    if (row["metric"] !== "매출") {
      return true;
    }

    const months = getPeriodMonths(periodFilter.start, periodFilter.end);

    return months.some((m) => {
      if (String(row["연도"]) !== String(m.year)) {
        return false;
      }

      const value = Number(String(row[m.month + "월"] || 0).replace(/,/g, ""));

      return value !== 0;
    });
  };
  // 필터 비교 함수
  const matchFilter = (rowValue, filterValue, key) => {
    // 전체
    // 전체 (검색어 없음)
    if (filterValue === "") {
      return true;
    }

    // 공백 검색 (스페이스 2번 이상 입력)
    if (
      typeof filterValue === "string" &&
      filterValue.length >= 2 &&
      filterValue.trim() === ""
    ) {
      return rowValue === "" || rowValue == null;
    }

    // 공백
    if (filterValue === "(공백)") {
      return rowValue === "" || rowValue == null;
    }

    // 프로젝트코드 / 사업명 검색
    if (key === "프로젝트코드" || key === "사업명") {
      // 띄어쓰기 2번 이상 입력하면 공백 검색
      if (String(filterValue).trim() === "") {
        return String(rowValue || "").trim() === "";
      }

      const value = String(rowValue || "")
        .toLowerCase()
        .replace(/\s/g, "");

      const filter = String(filterValue || "")
        .toLowerCase()
        .replace(/\s/g, "");

      return value.includes(filter);
    }

    // 일반 비교
    return String(rowValue) === String(filterValue);
  };

  const filterKeys = Object.keys(filterData);
  const activeMultiFields = Object.keys(multiFields).filter(
    (field) => multiFields[field],
  );

  const handleSearch = () => {
    const filtered = masterData.rows.filter((row) => {
      // 조회기간 금액 없는 사업 제외
      if (!hasPeriodAmount(row)) {
        return false;
      }

      // ======================
      // 다중 연도 필터
      // ======================
      for (const field of activeMultiFields) {
        const selected = multiSelected[field];

        if (!selected || selected.length === 0) {
          continue;
        }

        const value =
          row[field] === "" || row[field] == null ? "(공백)" : row[field];

        if (!selected.some((item) => String(item) === String(value))) {
          return false;
        }
      }

      return filterKeys.every((key) => {
        if (multiFields[key]) {
          return true;
        }

        return matchFilter(row[key], filterData[key], key);
      });
    });

    const grouped = [];
    const map = {};

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

      if (!map[key]) {
        map[key] = {
          key,
          basic: row,
          metrics: {},
          metricList: [],
        };

        grouped.push(map[key]);
      }

      map[key].metrics[row.metric] = row;
      map[key].metricList.push(row);
    });

    const periodMonths =
      usePeriodFilter && periodFilter.start && periodFilter.end
        ? getPeriodMonths(periodFilter.start, periodFilter.end)
        : [];

    const filteredGrouped = grouped.filter((group) => {
      if (!usePeriodFilter || !periodFilter.start || !periodFilter.end) {
        return true;
      }

      const metricRow = group.metrics["매출"];

      if (!metricRow) {
        return false;
      }

      return periodMonths.some((m) => {
        if (String(group.basic["연도"]) !== String(m.year)) {
          return false;
        }

        const value = Number(
          String(metricRow[m.month + "월"] || 0).replace(/,/g, ""),
        );

        return value !== 0;
      });
    });

    const colorMap = {};

    filteredGrouped.forEach((group) => {
      const color = group.basic?.진행도;

      if (color) {
        colorMap[group.key] = color;
      }
    });

    setColorMap(colorMap);

    if (Array.isArray(filteredGrouped)) setResultRows(filteredGrouped);
    setExpandedRows({});

    if (usePeriodFilter && periodFilter.start && periodFilter.end) {
      const amount = calcPeriodAmount(
        grouped,
        periodFilter.start,
        periodFilter.end,
      );

      setPeriodResult(amount);
    }
  };

  const handleDelete = async (row) => {
    setDeleteTarget(row);
  };

  useEffect(() => {
    handleSearch();
  }, [
    masterData,
    filterData,
    multiSelected,
    multiFields,
    usePeriodFilter,
    periodFilter,
  ]);

  useEffect(() => {
    sessionStorage.setItem("filterData", JSON.stringify(filterData));
  }, [filterData]);

  useEffect(() => {
    sessionStorage.setItem("periodFilter", JSON.stringify(periodFilter));
  }, [periodFilter]);

  useEffect(() => {
    sessionStorage.setItem("usePeriodFilter", usePeriodFilter);
  }, [usePeriodFilter]);

  useEffect(() => {
    try {
      if (savedFilters.length === 0) {
        sessionStorage.removeItem("savedFilters");
        return;
      }

      sessionStorage.setItem("savedFilters", JSON.stringify(savedFilters));
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        showToast("저장된 필터가 너무 많습니다. 필터삭제를 눌러주세요.");
      }
    }
  }, [savedFilters]);

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleEdit = (row) => {
    setEditData(row);
    setOpenModal(true);
  };

  const basicColumns = [
    "연도",
    "New/Sold",
    "매출유형",
    "구분",
    "고객유형",
    "매출처",
    "최종고객",
    "담당자",
    "확도",
    "프로젝트코드",
    "사업명",
  ];

  const metricColumns = [
    "수주월",
    "매출월",
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
    "연간계",
    // "11월 이후",
  ];

  const buttonStyle = {
    padding: "8px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const buttonColors = {
    filterA: {
      background: "#f3f4f6",
      color: "#374151",
    },
    filterB: {
      background: "#eff6ff",
      color: "#2563eb",
    },
    compare: {
      background: "#2563eb",
      color: "#fff",
      border: "1px solid #2563eb",
    },
    reset: {
      background: "#fff",
      color: "#6b7280",
    },
    register: {
      background: "#10b981",
      color: "#fff",
      border: "1px solid #10b981",
    },
  };

  const periodMonths =
    usePeriodFilter && periodFilter.start && periodFilter.end
      ? getPeriodMonths(periodFilter.start, periodFilter.end)
      : [];

  const totals = resultRows.reduce(
    (acc, group) => {
      const salesRow = group.metricList?.find((item) => item.metric === "매출");

      const profitRow = group.metricList?.find(
        (item) => item.metric === "매출이익",
      );

      // 조회기간 적용
      if (usePeriodFilter && periodFilter.start && periodFilter.end) {
        if (salesRow) {
          acc.sales += periodMonths.reduce((sum, m) => {
            if (String(group.basic["연도"]) !== String(m.year)) {
              return sum;
            }

            return (
              sum +
              Number(String(salesRow[`${m.month}월`] || 0).replace(/,/g, ""))
            );
          }, 0);
        }

        if (profitRow) {
          acc.profit += periodMonths.reduce((sum, m) => {
            if (String(group.basic["연도"]) !== String(m.year)) {
              return sum;
            }

            return (
              sum +
              Number(String(profitRow[`${m.month}월`] || 0).replace(/,/g, ""))
            );
          }, 0);
        }

        return acc;
      }

      // 조회기간 미적용 → 연간계
      if (salesRow) {
        acc.sales += Number(String(salesRow["연간계"] || 0).replace(/,/g, ""));
      }

      if (profitRow) {
        acc.profit += Number(
          String(profitRow["연간계"] || 0).replace(/,/g, ""),
        );
      }

      return acc;
    },
    { sales: 0, profit: 0 },
  );

  const totalSales = totals.sales;
  const totalProfit = totals.profit;

  const detailMetricColumns = useMemo(() => {
    // 조회기간 미적용 → 기존처럼 전체 월 표시
    if (!usePeriodFilter || !periodFilter.start || !periodFilter.end) {
      return metricColumns.filter(
        (key) => key !== "수주월" && key !== "매출월" && key !== "비고",
      );
    }

    // 조회기간 적용 → 선택한 기간의 월만 표시
    const months = getPeriodMonths(periodFilter.start, periodFilter.end);

    const monthKeys = months.map((m) => `${m.month}월`);

    return [
      ...monthKeys.filter((key) => metricColumns.includes(key)),
      "연간계",
    ];
  }, [metricColumns, usePeriodFilter, periodFilter.start, periodFilter.end]);

  return (
    <div
      style={{
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      {toast && <div className="toast">{toast}</div>}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "-10px",
          marginBottom: "12px",
        }}
      >
        <h2 style={{ margin: 0 }}>사업 검색</h2>

        <span
          style={{
            position: "relative",
            top: "45px",
            left: "-6px",
            fontSize: "13px",
            color: "#64748b",
            fontWeight: "500",
          }}
        >
          최종 업데이트&nbsp;&nbsp;2026.08.10
        </span>
      </div>
      <div className="period-check-box">
        <label>
          <input
            type="checkbox"
            checked={usePeriodFilter}
            onChange={(e) => {
              const checked = e.target.checked;

              setUsePeriodFilter(checked);

              if (checked) {
                setFilterData((prev) => ({
                  ...prev,
                  연도: "",
                }));

                setMultiFields((prev) => ({
                  ...prev,
                  연도: false,
                }));

                setMultiSelected((prev) => ({
                  ...prev,
                  연도: [],
                }));
              }
            }}
          />
          조회기간 적용 (매출 발생건)
        </label>
      </div>

      {usePeriodFilter && (
        <div className="period-input-area">
          <div className="period-title">조회기간</div>

          <div className="period-row">
            <label>시작월</label>
            <input
              type="month"
              value={periodFilter.start}
              onChange={(e) =>
                setPeriodFilter({
                  ...periodFilter,
                  start: e.target.value,
                })
              }
            />
          </div>

          <div
            className="period-row"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <label>종료월</label>
            <input
              type="month"
              value={periodFilter.end}
              onChange={(e) =>
                setPeriodFilter({
                  ...periodFilter,
                  end: e.target.value,
                })
              }
            />
            <button
              type="button"
              onClick={() => handleResetPeriod()}
              title="조회기간 초기화"
              style={{
                marginLeft: "6px",
                width: "24px",
                height: "24px",
                padding: "0",
                border: "1px solid #cbd5e1",
                borderRadius: "5px",
                background: "#f8fafc",
                color: "#64748b",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                lineHeight: "1",
              }}
            >
              ↺
            </button>
          </div>
        </div>
      )}
      <BusinessFilter
        masterData={masterData}
        // 일반 필터
        formData={filterData}
        setFormData={setFilterData}
        manualFilters={manualFilters}
        setManualFilters={setManualFilters}
        // 자동값
        autoData={autoData}
        setAutoData={setAutoData}
        // 상세행
        setExpandedRows={setExpandedRows}
        // ======================
        multiSelected={multiSelected}
        setMultiSelected={setMultiSelected}
        // 체크박스 UI
        multiFields={multiFields}
        setMultiFields={setMultiFields}
        usePeriodFilter={usePeriodFilter}
        lockYearFilter={lockYearFilter}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <h3
            style={{
              margin: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            {/* 검색 결과 + 사업등록 */}
            <span
              style={{
                fontSize: "15px",
                fontWeight: "500",
                color: "#6b7280",
              }}
            >
              검색 결과 : {resultRows.length}건
              <button
                onClick={() => {
                  setEditData(null);
                  setOpenModal(true);
                }}
                style={{
                  padding: "6px 12px",
                  fontSize: "11px",
                  cursor: "pointer",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  marginLeft: "15px",
                }}
              >
                + 사업등록
              </button>
            </span>

            {/* 매출 + 매출이익 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "24x",
                // color: "#6b7280",
                fontWeight: "600",
              }}
            >
              <span>
                매출 :{" "}
                <strong style={{ fontWeight: "800" }}>
                  {totalSales.toLocaleString()}
                </strong>
              </span>

              <span style={{ color: "#6b7280" }}>|</span>

              <span>
                매출이익 :{" "}
                <strong style={{ fontWeight: "800" }}>
                  {totalProfit.toLocaleString()}
                </strong>
              </span>
            </div>
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
          {/* 1번째 줄 : 비교 버튼 */}
          <div>
            <button
              onClick={() => {
                setSavedFilters((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    filters: { ...filterData },
                    multiFields: { ...multiFields },
                    multiSelected: { ...multiSelected },
                    periodFilter: usePeriodFilter ? { ...periodFilter } : null,
                    resultCount: resultRows.length,
                    // resultRows: resultRows,
                  },
                ]);

                showToast(`✅ 필터 ${savedFilters.length + 1} 저장됨`);
              }}
              style={{
                padding: "8px 18px",
                marginRight: "8px",
                fontSize: "11px",
                cursor: "pointer",
                background: "#fff",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontWeight: "600",
              }}
            >
              필터저장
              <span style={{ marginLeft: "4px" }}>({savedFilters.length})</span>
            </button>

            <button
              onClick={() => {
                if (savedFilters.length === 0) {
                  showToast("　저장된 필터가 없습니다❗");
                  return;
                }

                const result = makeCompareData(savedFilters, masterData.rows);

                setCompareResult(result);
                setCompareOpen(true);
              }}
              style={{
                padding: "8px 18px",
                fontSize: "11px",
                marginRight: "8px",
                cursor: "pointer",
                background: "#9DA3AF",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
              }}
            >
              조회
            </button>

            <button
              onClick={handleResetCompare}
              style={{
                padding: "8px 18px",
                fontSize: "11px",
                background: "#dc2626",
                color: "#fff",
                border: "1px solid #ef4444",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              필터삭제
            </button>
          </div>
        </div>
      </div>
      <table className="business-table" border="2">
        <thead>
          <tr>
            <th>No</th>

            {basicColumns.map((key) => (
              <th key={key}>{key}</th>
            ))}

            <th
            // style={{
            //   background: "#f5f5f5",
            //   whiteSpace: "nowrap",
            // }}
            >
              매출
            </th>
            <th>수정/삭제</th>
          </tr>
        </thead>

        <tbody>
          {resultRows.map((row, index) => {
            const metricList = Array.isArray(row.metricList)
              ? row.metricList
              : [];

            const metricCount = metricList.length;

            return (
              <React.Fragment key={index}>
                <tr
                  style={{
                    backgroundColor: colorMap[row.key] || "transparent",
                  }}
                >
                  <td>{index + 1}</td>
                  {basicColumns.map((key) => (
                    <td
                      key={key}
                      title={String(row.basic[key] ?? "")}
                      className={
                        key === "확도"
                          ? row.basic[key] === "확정(100%)"
                            ? "accuracy-high"
                            : row.basic[key] === "0"
                              ? "accuracy-zero"
                              : "accuracy-mid"
                          : ""
                      }
                    >
                      {key === "구분"
                        ? String(row.basic[key] ?? "")
                            .replace("솔루션 - ", "")
                            .trim()
                        : row.basic[key]}
                    </td>
                  ))}

                  <td
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <button
                      className="detail-button"
                      onClick={() => toggleRow(index)}
                    >
                      {expandedRows[index] ? "▲" : "▼"}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(row)}
                      style={{
                        padding: "1px 10px",
                        fontSize: "10px",
                        cursor: "pointer",
                      }}
                    >
                      수정
                    </button>

                    <button
                      onClick={() => handleDelete(row)}
                      disabled={deleting}
                      style={{
                        padding: "1px 10px",
                        fontSize: "10px",
                        marginLeft: "4px",
                        cursor: deleting ? "not-allowed" : "pointer",
                      }}
                    >
                      {deleting ? "삭제 중.." : "삭제"}
                    </button>
                  </td>
                </tr>

                {expandedRows[index] && (
                  <tr>
                    <td colSpan={basicColumns.length + 3}>
                      <table className="metric-detail-table">
                        <colgroup>
                          {/* 구분 */}
                          <col style={{ width: "60px" }} />

                          {/* 수주월 */}
                          <col style={{ width: "45px" }} />

                          {/* 매출월 */}
                          <col style={{ width: "45px" }} />

                          {/* 상세 지표 */}
                          {detailMetricColumns.map((key) => (
                            <col key={key} style={{ width: "45px" }} />
                          ))}

                          {/* 비고 */}
                          <col style={{ width: "150px" }} />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>구분</th>

                            <th rowSpan="1">수주월</th>
                            <th rowSpan="1">매출월</th>

                            {detailMetricColumns.map((key) => (
                              <th key={key}>{key}</th>
                            ))}

                            <th rowSpan={metricCount}>비고</th>
                          </tr>
                        </thead>

                        <tbody>
                          {metricList.map((metricRow, mIndex) => (
                            <tr key={mIndex}>
                              <td>{metricRow.metric}</td>

                              {mIndex === 0 && (
                                <>
                                  <td rowSpan={metricCount}>
                                    {metricRow["수주월"]}
                                  </td>

                                  <td rowSpan={metricCount}>
                                    {metricRow["매출월"]}
                                  </td>
                                </>
                              )}

                              {detailMetricColumns.map((key) => (
                                <td
                                  key={key}
                                  title={String(metricRow[key] ?? "")}
                                >
                                  {metricRow[key]}
                                </td>
                              ))}
                              {mIndex === 0 && (
                                <td
                                  rowSpan={metricCount}
                                  title={String(metricRow["비고"] ?? "")}
                                >
                                  {metricRow["비고"]}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {openModal && (
        <BusinessModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          masterData={masterData}
          reloadData={reloadData}
          editData={editData}
          showToast={showToast}
        />
      )}
      <CompareModal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        data={compareResult}
        savedFilters={savedFilters}
        usePeriodFilter={usePeriodFilter}
        periodFilter={periodFilter}
      />
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px 35px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "20px", fontWeight: "600" }}>
              삭제하시겠습니까?
            </div>

            <button
              onClick={async () => {
                try {
                  setDeleting(true);

                  // await deleteBusiness(deleteTarget.basic.id);

                  // showToast("삭제 완료");

                  // await reloadData();.

                  deleteBusiness(deleteTarget.basic.id)
                    .then(() => {
                      reloadData();
                    })
                    .catch(() => {
                      showToast("삭제 실패");
                    });

                  showToast("삭제 완료");
                  setDeleteTarget(null);
                } catch (error) {
                  showToast("삭제 실패");
                } finally {
                  setDeleting(false);
                  setDeleteTarget(null);
                }
              }}
              disabled={deleting}
              style={{
                background: deleting ? "#9ca3af" : "#dc2626",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 20px",
                marginRight: "10px",
                cursor: deleting ? "not-allowed" : "pointer",
              }}
            >
              {deleting ? "삭제 중.." : "삭제"}
            </button>

            <button
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              style={{
                background: "#f1f5f9",
                border: "none",
                borderRadius: "8px",
                padding: "8px 20px",
                cursor: deleting ? "not-allowed" : "pointer",
                opacity: deleting ? 0.5 : 1,
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
