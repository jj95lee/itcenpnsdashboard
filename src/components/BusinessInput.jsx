import { useEffect } from "react";
export default function BusinessInput({ masterData, formData, setFormData }) {
  const getAllOptions = (field) => {
    return [
      ...new Set(
        masterData.rows
          .map((row) => row[field])
          .filter((v) => v !== "" && v !== null && v !== undefined),
      ),
    ].sort();
  };
  const yearOptions = [
    ...new Set([...getAllOptions("연도"), "2026"].map(String)),
  ].sort((a, b) => Number(a) - Number(b));

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      팀: "솔루션영업팀",
    }));
  }, [setFormData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getFirstInputMonth = (metric) => {
    const months = [
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
    ];

    const metricData = formData.metrics?.[metric] || {};

    for (const month of months) {
      if (Number(metricData[month] || 0) !== 0) {
        return month;
      }
    }

    return "";
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  };

  const labelStyle = {
    width: "95px",
    fontWeight: 600,
    fontSize: "15px",
    color: "#333",
    flexShrink: 0,
  };

  const inputStyle = {
    width: "270px",
    height: "40px",
    padding: "0 12px",
    border: "1px solid #d0d7de",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  };

  const boxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const getInputStyle = (value) => ({
    width: "260px",
    height: "40px",
    padding: "0 12px",
    border: "1px solid #d0d7de",
    borderRadius: "6px",
    boxSizing: "border-box",

    backgroundColor:
      value !== "" && value !== undefined && value !== null
        ? "#f3f8ff"
        : "#ffffff",

    borderColor:
      value !== "" && value !== undefined && value !== null
        ? "#4f8cff"
        : "#d0d7de",
  });
  const sectionTitleStyle = {
    gridColumn: "1 / -1",
    marginTop: "5px",
    marginBottom: "-5px",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "3px",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px 50px",
        padding: "10px 5px",
      }}
    >
      {/* 연도 */}
      <div style={rowStyle}>
        <label style={labelStyle}>연도</label>

        <select
          style={getInputStyle(formData.연도)}
          name="연도"
          value={formData.연도}
          onChange={handleChange}
        >
          <option value="">선택</option>

          {yearOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 팀 */}
      <div style={boxStyle}>
        <label style={labelStyle}>팀</label>

        <input
          type="text"
          name="팀"
          value={formData.팀 || "솔루션영업팀"}
          disabled
          style={{
            ...getInputStyle(formData.팀),
            color: "#333",
            cursor: "not-allowed",
          }}
        />
      </div>

      {/* New/Sold */}
      <div style={rowStyle}>
        <label style={labelStyle}>New/Sold</label>

        <select
          name="New/Sold"
          value={formData["New/Sold"]}
          onChange={handleChange}
          style={getInputStyle(formData["New/Sold"])}
        >
          <option value="">선택</option>

          {getAllOptions("New/Sold").map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 매출유형 */}
      <div style={rowStyle}>
        <label style={labelStyle}>매출유형</label>

        <select
          style={getInputStyle(formData.매출유형)}
          name="매출유형"
          value={formData.매출유형}
          onChange={handleChange}
        >
          <option value="">선택</option>

          {getAllOptions("매출유형").map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 구분 */}
      <div style={rowStyle}>
        <label style={labelStyle}>구분</label>

        <select
          style={getInputStyle(formData.구분)}
          name="구분"
          value={formData.구분}
          onChange={handleChange}
        >
          <option value="">선택</option>

          {getAllOptions("구분").map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 고객유형 */}
      <div style={rowStyle}>
        <label style={labelStyle}>고객유형</label>

        <select
          style={getInputStyle(formData.고객유형)}
          name="고객유형"
          value={formData.고객유형}
          onChange={handleChange}
        >
          <option value="">선택</option>

          {getAllOptions("고객유형").map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 매출처 */}
      <div style={rowStyle}>
        <label style={labelStyle}>매출처</label>

        <input
          style={getInputStyle(formData.매출처)}
          type="text"
          name="매출처"
          value={formData.매출처}
          onChange={handleChange}
        />
      </div>

      {/* 최종고객 */}
      <div style={rowStyle}>
        <label style={labelStyle}>최종고객</label>

        <input
          style={getInputStyle(formData.최종고객)}
          type="text"
          name="최종고객"
          value={formData.최종고객}
          onChange={handleChange}
        />
      </div>

      {/* 담당자 */}
      <div style={rowStyle}>
        <label style={labelStyle}>담당자</label>

        <select
          style={getInputStyle(formData.담당자)}
          name="담당자"
          value={formData.담당자}
          onChange={handleChange}
        >
          <option value="">선택</option>

          {getAllOptions("담당자").map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 확도 */}
      <div style={rowStyle}>
        <label style={labelStyle}>확도</label>

        <select
          style={getInputStyle(formData.확도)}
          name="확도"
          value={formData.확도}
          onChange={handleChange}
        >
          <option value="">선택</option>

          {getAllOptions("확도").map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* 수주월 */}
      {/* <div>
        <label>수주월</label>

        <input
          type="text"
          name="수주월"
          value={getFirstInputMonth("수주")}
          readOnly
        />
      </div> */}

      {/* 매출월 */}
      {/* <div>
        <label>매출월</label>

        <input
          type="text"
          name="매출월"
          value={getFirstInputMonth("매출")}
          readOnly
        />
      </div> */}

      {/* 프로젝트코드 */}
      <div style={rowStyle}>
        <label style={labelStyle}>프로젝트코드</label>

        <input
          style={getInputStyle(formData.프로젝트코드)}
          type="text"
          name="프로젝트코드"
          value={formData.프로젝트코드}
          onChange={handleChange}
        />
      </div>

      {/* 사업명 */}
      <div style={rowStyle}>
        <label style={labelStyle}>사업명</label>

        <input
          style={getInputStyle(formData.사업명)}
          type="text"
          name="사업명"
          value={formData.사업명}
          onChange={handleChange}
        />
      </div>

      {/* 비고 */}
      <div
        style={{
          gridColumn: "1 / -1",
          width: "85%",
        }}
      >
        <label>비고</label>

        <textarea
          name="비고"
          value={formData.비고}
          onChange={handleChange}
          rows={4}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #d0d7de",
            borderRadius: "8px",
            resize: "vertical",
            boxSizing: "border-box",
            fontSize: "14px",
          }}
        />
      </div>

      {/* 상세매출 */}

      <div style={sectionTitleStyle}>
        <h3 style={{ margin: 0 }}>상세매출</h3>
      </div>

      {["수주", "매출", "매출원가", "매출이익"].map((type) => (
        <div
          key={type}
          style={{
            gridColumn: "1 / -1",
            border: "1px solid #e5e7eb",
            padding: "18px",
            borderRadius: "12px",
            background: "#fafafa",
          }}
        >
          <h4
            style={{
              margin: "0 0 10px 0",
              fontSize: "15px",
              fontWeight: "700",
            }}
          >
            {type}
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 90px)",
              gap: "10px",
            }}
          >
            {Array.from({ length: 12 }, (_, i) => `${i + 1}월`).map((month) => (
              <div key={month}>
                <label>{month}</label>
                <input
                  type="number"
                  readOnly={type === "매출이익"}
                  style={{
                    width: "90px",
                    padding: "6px",
                    boxSizing: "border-box",
                    backgroundColor: type === "매출이익" ? "#f1f5f9" : "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    height: "32px",
                    // textAlign: "right",
                  }}
                  value={formData.metrics?.[type]?.[month] ?? 0}
                  onChange={(e) => {
                    if (type === "매출이익") return;

                    setFormData((prev) => ({
                      ...prev,

                      metrics: {
                        ...(prev.metrics || {}),

                        [type]: {
                          ...(prev.metrics?.[type] || {}),
                          [month]: Number(e.target.value),
                        },
                      },
                    }));
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
