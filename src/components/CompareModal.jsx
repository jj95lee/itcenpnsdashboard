import { useEffect } from "react";
import CompareTable from "./CompareTable";
import CompareChart from "./CompareChart";

export default function CompareModal({
  open,
  onClose,
  data,
  savedFilters,
  usePeriodFilter,
  periodFilter,
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const chartData = [
    {
      label: "필터 A",
      매출: data.find((x) => x.label === "매출")?.compare1 || 0,
      매출이익: data.find((x) => x.label === "매출이익")?.compare1 || 0,
    },
    {
      label: "필터 B",
      매출: data.find((x) => x.label === "매출")?.compare2 || 0,
      매출이익: data.find((x) => x.label === "매출이익")?.compare2 || 0,
    },
  ];

  const filterColors = [
    {
      background: "#f3f4f6",
      border: "#d1d5db",
    },
    {
      background: "#eff6ff",
      border: "#93c5fd",
    },
    {
      background: "#ecfdf5",
      border: "#86efac",
    },
    {
      background: "#fff7ed",
      border: "#fdba74",
    },
    {
      background: "#fdf2f8",
      border: "#f9a8d4",
    },
    {
      background: "#f5f3ff",
      border: "#c4b5fd",
    },
  ];

  const renderFilters = (savedFilter) => {
    const { filters, periodFilter } = savedFilter;

    const displayKeys = [
      "연도",
      "New/Sold",
      "매출유형",
      "구분",
      "고객유형",
      // "담당자",
      "사업명",
      "프로젝트코드",
    ];

    return displayKeys
      .filter((key) => {
        // 조회기간 사용 시 연도는 숨김
        if (periodFilter && key === "연도") return true;

        const value = filters?.[key];

        return (
          value !== "" &&
          value !== null &&
          value !== undefined &&
          value !== "(공백)"
        );
      })
      .map((key) => (
        <p
          key={key}
          style={{
            margin: "5px 0",
            fontSize: "13px",
            color: "#555",
          }}
        >
          {key === "사업명" || key === "프로젝트코드" ? (
            <>
              <b>검색</b> : {filters[key]}
            </>
          ) : (
            <>
              <b>{periodFilter && key === "연도" ? "조회기간" : key}</b> :{" "}
              {periodFilter && key === "연도"
                ? `${periodFilter.start} ~ ${periodFilter.end}`
                : key === "구분"
                  ? filters[key].replace("솔루션 - ", "")
                  : filters[key]}
            </>
          )}
        </p>
      ));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "950px",
          background: "#fff",
          borderRadius: "12px",
          padding: "25px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* 제목 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>결과 조회</h2>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* 비교 조건 */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {savedFilters.map((filter, index) => {
            const color = filterColors[index % filterColors.length];

            return (
              <div
                key={filter.id}
                style={{
                  background: color.background,
                  border: `1px solid ${color.border}`,
                  padding: "12px 20px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>필터 {index + 1}</h3>

                  <p
                    style={{
                      margin: 0,
                      fontWeight: "600",
                    }}
                  >
                    검색건수 : {filter.resultCount || 0}건
                  </p>
                </div>

                {renderFilters(filter)}
              </div>
            );
          })}
        </div>

        {/* 비교 표 */}
        <CompareTable rows={data} savedFilters={savedFilters} />

        {/* 그래프 */}
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <CompareChart data={data} savedFilters={savedFilters} />
        </div>
      </div>
    </div>
  );
}
