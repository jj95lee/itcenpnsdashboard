import { useEffect, useRef } from "react";

export default function BasicInfo({
  masterData,
  formData,
  setFormData,
  autoData,
  setAutoData,
  setExpandedRows,

  multiFields,
  setMultiFields,

  multiSelected,
  setMultiSelected,

  usePeriodFilter,
  lockYearFilter,
}) {
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

    outline: "none",
  });

  const isResetting = useRef(false);
  const hierarchy = [
    "연도",
    "팀",
    "New/Sold",
    "매출유형",
    "구분",
    "고객유형",
    "매출처",
    "최종고객",
    "담당자",
    "확도",
    "진행도",
  ];

  const handleSelectAll = (field, options) => {
    setMultiSelected((prev) => ({
      ...prev,
      [field]:
        prev[field].length === options.length
          ? []
          : options.map((v) => String(v)),
    }));
  };

  // 필터 옵션 생성
  const getOptions = (field) => {
    let parentFields = [];

    const index = hierarchy.indexOf(field);

    if (index !== -1) {
      parentFields = hierarchy.slice(0, index);
    }

    if (field === "수주월" || field === "매출월") {
      parentFields = [...hierarchy];
    }

    const filtered = masterData.rows.filter((row) => {
      return parentFields.every((key) => {
        if (!formData[key]) return true;

        if (formData[key] === "(공백)") {
          return row[key] === "" || row[key] == null;
        }

        return String(row[key]) === String(formData[key]);
      });
    });

    const values = [
      ...new Set(
        filtered
          .map((row) => row[field])
          .filter(
            (value) => value !== "" && value !== null && value !== undefined,
          )
          .map((value) => String(value)),
      ),
    ];

    if (field === "수주월" || field === "매출월") {
      values.sort((a, b) => {
        const monthA = Number(String(a).replace("월", ""));
        const monthB = Number(String(b).replace("월", ""));

        const isMonthA = monthA >= 1 && monthA <= 12;
        const isMonthB = monthB >= 1 && monthB <= 12;

        if (isMonthA && isMonthB) {
          return monthA - monthB;
        }

        if (isMonthA) return -1;
        if (isMonthB) return 1;

        return String(a).localeCompare(String(b), "ko");
      });
    } else {
      values.sort();
    }

    const hasEmpty = filtered.some(
      (row) => row[field] === "" || row[field] == null,
    );

    if (hasEmpty) {
      values.unshift("(공백)");
    }

    return values;
  };

  const yearOptions = getOptions("연도");

  const newSoldOptions = getOptions("New/Sold");

  const teamOptions = getOptions("팀");

  const salesTypeOptions = getOptions("매출유형");

  const productOptions = getOptions("구분");

  const customerTypeOptions = getOptions("고객유형");

  const vendorOptions = getOptions("매출처");

  const customerOptions = getOptions("최종고객");

  const ownerOptions = getOptions("담당자");

  const accuracyOptions = getOptions("확도");

  const orderMonthOptions = getOptions("수주월");

  const salesMonthOptions = getOptions("매출월");

  const progressOptions = {
    // 미착수: "#FFFFFF",
    "⚪": "#FFFFFF",
    // 진행중: "#FFFFCC",
    "🟡": "#FFFFCC",
    // 완료: "#D9D9D9",
    "⚫": "#D9D9D9",
  };

  const handleReset = () => {
    isResetting.current = true;
    setFormData({
      연도: "",
      "New/Sold": "",
      팀: "",
      구분: "",
      매출유형: "",
      고객유형: "",
      매출처: "",
      최종고객: "",
      담당자: "",
      프로젝트코드: "",
      확도: "",
      사업명: "",
      수주월: "",
      매출월: "",
      진행도: "",
      비고: "",
    });
    // 체크박스 선택값 초기화
    setMultiSelected({
      연도: [],
      팀: [],
      "New/Sold": [],
      매출유형: [],
      구분: [],
      고객유형: [],
      매출처: [],
      최종고객: [],
      담당자: [],
      확도: [],
      수주월: [],
      매출월: [],
      진행도: [],
    });

    // 체크박스 모드도 해제하고 싶으면 추가
    setMultiFields({
      연도: false,
      팀: false,
      "New/Sold": false,
      매출유형: false,
      구분: false,
      고객유형: false,
      매출처: false,
      최종고객: false,
      담당자: false,
      확도: false,
      진행도: false,
    });

    setExpandedRows({});
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedClass = (field) => {
    return formData[field] !== "" &&
      formData[field] !== null &&
      formData[field] !== undefined
      ? "selected"
      : "";
  };

  // 자동 선택
  useEffect(() => {
    if (isResetting.current) {
      isResetting.current = false;
      return;
    }

    const autoSelect = (field, options) => {
      if (options.length === 1 && !formData[field]) {
        setFormData((prev) => ({
          ...prev,
          [field]: options[0],
        }));
      }
    };

    const autoMultiSelect = (field, options) => {
      if (
        multiFields[field] &&
        options.length === 1 &&
        multiSelected[field].length === 0
      ) {
        setMultiSelected((prev) => ({
          ...prev,
          [field]: [String(options[0])],
        }));
      }
    };

    if (!lockYearFilter) {
      autoSelect("연도", yearOptions);
    }
    autoSelect("팀", teamOptions);
    autoSelect("New/Sold", newSoldOptions);
    autoSelect("매출유형", salesTypeOptions);
    autoSelect("구분", productOptions);
    autoSelect("고객유형", customerTypeOptions);
    autoSelect("매출처", vendorOptions);
    autoSelect("최종고객", customerOptions);
    autoSelect("담당자", ownerOptions);
    autoSelect("확도", accuracyOptions);
    autoSelect("수주월", orderMonthOptions);
    autoSelect("매출월", salesMonthOptions);
    autoSelect("진행도", progressOptions);
    if (!lockYearFilter) {
      autoMultiSelect("연도", yearOptions);
    }
    autoMultiSelect("팀", teamOptions);
    autoMultiSelect("New/Sold", newSoldOptions);
    autoMultiSelect("매출유형", salesTypeOptions);
    autoMultiSelect("구분", productOptions);
    autoMultiSelect("고객유형", customerTypeOptions);
    autoMultiSelect("매출처", vendorOptions);
    autoMultiSelect("최종고객", customerOptions);
    autoMultiSelect("담당자", ownerOptions);
    autoMultiSelect("확도", accuracyOptions);
    autoMultiSelect("수주월", orderMonthOptions);
    autoMultiSelect("매출월", salesMonthOptions);
    autoMultiSelect("진행도", progressOptions);
  }, [
    yearOptions,
    teamOptions,
    newSoldOptions,
    salesTypeOptions,
    productOptions,
    customerTypeOptions,
    vendorOptions,
    customerOptions,
    ownerOptions,
    accuracyOptions,
    orderMonthOptions,
    salesMonthOptions,
    progressOptions,
    multiFields,
    multiSelected,
  ]);

  return (
    <div className="basic-info">
      {/* <h3>기본정보</h3> */}

      <div className="form-grid">
        {/* 연도 */}
        <div>
          <label className="filter-label">
            연도
            <input
              type="checkbox"
              checked={multiFields.연도}
              disabled={usePeriodFilter}
              onChange={() => {
                const next = !multiFields.연도;

                setMultiFields((prev) => ({
                  ...prev,
                  연도: next,
                }));

                // 다중선택 진입
                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    연도: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    연도: "",
                    팀: "",
                    "New/Sold": "",
                    매출유형: "",
                    구분: "",
                    고객유형: "",
                    매출처: "",
                    최종고객: "",
                    담당자: "",
                    확도: "",
                    수주월: "",
                    매출월: "",
                    진행도: "",
                  }));
                }

                // 다중선택 해제
                else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    연도: [],
                  }));
                  setFormData((prev) => ({
                    ...prev,
                    연도: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.연도 ? (
            <div className="multi-select-list">
              <label className="multi-all">
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.연도.length === yearOptions.length &&
                    yearOptions.length > 0
                  }
                  onChange={() => handleSelectAll("연도", yearOptions)}
                />
              </label>
              {yearOptions.map((year) => (
                <label key={year} className="multi-option">
                  {year}

                  <input
                    type="checkbox"
                    checked={multiSelected.연도.includes(String(year))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          연도: [...prev.연도, String(year)],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          연도: prev.연도.filter(
                            (item) => item !== String(year),
                          ),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.연도)}
              value={formData.연도 || ""}
              disabled={usePeriodFilter}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,

                  연도: e.target.value,

                  팀: "",
                  "New/Sold": "",
                  매출유형: "",
                  구분: "",
                  고객유형: "",
                  매출처: "",
                  최종고객: "",
                  담당자: "",
                  확도: "",
                  수주월: "",
                  매출월: "",
                  진행도: "",
                }));
              }}
            >
              <option value="">전체</option>

              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 팀 */}
        <div>
          <label className="filter-label">
            팀
            {/* <input
              type="checkbox"
              checked={multiFields.팀}
              onChange={() => {
                const next = !multiFields.팀;

                setMultiFields((prev) => ({
                  ...prev,
                  팀: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    팀: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    팀: "",
                    "New/Sold": "",
                    매출유형: "",
                    구분: "",
                    고객유형: "",
                    매출처: "",
                    최종고객: "",
                    담당자: "",
                    확도: "",
                    수주월: "",
                    매출월: "",
                    진행도: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    팀: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    팀: "",
                  }));
                }
              }}
            /> */}
          </label>

          {multiFields.팀 ? (
            <div className="multi-select-list">
              {/* <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.팀.length === teamOptions.length &&
                    teamOptions.length > 0
                  }
                  onChange={() => handleSelectAll("팀", teamOptions)}
                />
              </label> */}
              {teamOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.팀.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          팀: [...prev.팀, item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          팀: prev.팀.filter((v) => v !== item),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.팀)}
              value={formData.팀 || autoData.팀 || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  팀: e.target.value,
                  "New/Sold": "",
                  매출유형: "",
                  구분: "",
                  고객유형: "",
                  매출처: "",
                  최종고객: "",
                  담당자: "",
                  확도: "",
                  수주월: "",
                  매출월: "",
                  진행도: "",
                });
              }}
            >
              <option value="">전체</option>

              {teamOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* New/Sold */}
        <div>
          <label className="filter-label">
            New/Sold
            <input
              type="checkbox"
              checked={multiFields["New/Sold"]}
              onChange={() => {
                const next = !multiFields["New/Sold"];

                setMultiFields((prev) => ({
                  ...prev,
                  "New/Sold": next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    "New/Sold": [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    "New/Sold": "",
                    매출유형: "",
                    구분: "",
                    고객유형: "",
                    매출처: "",
                    최종고객: "",
                    담당자: "",
                    확도: "",
                    수주월: "",
                    매출월: "",
                    진행도: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    "New/Sold": [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    "New/Sold": "",
                  }));
                }
              }}
            />
          </label>

          {multiFields["New/Sold"] ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected["New/Sold"].length ===
                      newSoldOptions.length && newSoldOptions.length > 0
                  }
                  onChange={() => handleSelectAll("New/Sold", newSoldOptions)}
                />
              </label>
              {newSoldOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected["New/Sold"].includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          "New/Sold": [...prev["New/Sold"], item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          "New/Sold": prev["New/Sold"].filter(
                            (v) => v !== item,
                          ),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData["New/Sold"])}
              value={formData["New/Sold"] || autoData["New/Sold"] || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  "New/Sold": e.target.value,
                  매출유형: "",
                  구분: "",
                  고객유형: "",
                  매출처: "",
                  최종고객: "",
                  담당자: "",
                  확도: "",
                  수주월: "",
                  매출월: "",
                  진행도: "",
                });
              }}
            >
              <option value="">전체</option>

              {newSoldOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 매출유형 */}
        <div>
          <label className="filter-label">
            매출유형
            <input
              type="checkbox"
              checked={multiFields.매출유형}
              onChange={() => {
                const next = !multiFields.매출유형;

                setMultiFields((prev) => ({
                  ...prev,
                  매출유형: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    매출유형: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    매출유형: "",
                    구분: "",
                    고객유형: "",
                    매출처: "",
                    최종고객: "",
                    담당자: "",
                    확도: "",
                    수주월: "",
                    매출월: "",
                    진행도: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    매출유형: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    매출유형: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.매출유형 ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.매출유형.length === salesTypeOptions.length &&
                    salesTypeOptions.length > 0
                  }
                  onChange={() => handleSelectAll("매출유형", salesTypeOptions)}
                />
              </label>
              {salesTypeOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.매출유형.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          매출유형: [...prev.매출유형, item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          매출유형: prev.매출유형.filter((v) => v !== item),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.매출유형)}
              value={formData.매출유형 || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  매출유형: e.target.value,
                  구분: "",
                  고객유형: "",
                  매출처: "",
                  최종고객: "",
                  담당자: "",
                  확도: "",
                  수주월: "",
                  매출월: "",
                  진행도: "",
                });
              }}
            >
              <option value="">전체</option>

              {salesTypeOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 구분 */}
        <div>
          <label className="filter-label">
            구분
            <input
              type="checkbox"
              checked={multiFields.구분}
              onChange={() => {
                const next = !multiFields.구분;

                setMultiFields((prev) => ({
                  ...prev,
                  구분: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    구분: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    구분: "",
                    고객유형: "",
                    매출처: "",
                    최종고객: "",
                    담당자: "",
                    확도: "",
                    수주월: "",
                    매출월: "",
                    진행도: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    구분: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    구분: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.구분 ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.구분.length === productOptions.length &&
                    productOptions.length > 0
                  }
                  onChange={() => handleSelectAll("구분", productOptions)}
                />
              </label>
              {productOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.구분.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          구분: [...prev.구분, item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          구분: prev.구분.filter((v) => v !== item),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.구분)}
              value={formData.구분 || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  구분: e.target.value,
                  고객유형: "",
                  매출처: "",
                  최종고객: "",
                  담당자: "",
                  확도: "",
                  수주월: "",
                  매출월: "",
                  진행도: "",
                });
              }}
            >
              <option value="">전체</option>

              {productOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 고객유형 */}
        <div>
          <label className="filter-label">
            고객유형
            <input
              type="checkbox"
              checked={multiFields.고객유형}
              onChange={() => {
                const next = !multiFields.고객유형;

                setMultiFields((prev) => ({
                  ...prev,
                  고객유형: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    고객유형: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    고객유형: "",
                    매출처: "",
                    최종고객: "",
                    담당자: "",
                    확도: "",
                    수주월: "",
                    매출월: "",
                    진행도: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    고객유형: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    고객유형: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.고객유형 ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.고객유형.length ===
                      customerTypeOptions.length &&
                    customerTypeOptions.length > 0
                  }
                  onChange={() =>
                    handleSelectAll("고객유형", customerTypeOptions)
                  }
                />
              </label>
              {customerTypeOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.고객유형.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          고객유형: [...prev.고객유형, item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          고객유형: prev.고객유형.filter((v) => v !== item),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.고객유형)}
              value={formData.고객유형 || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  고객유형: e.target.value,
                  매출처: "",
                  최종고객: "",
                  담당자: "",
                  확도: "",
                  수주월: "",
                  매출월: "",
                  진행도: "",
                });
              }}
            >
              <option value="">전체</option>

              {customerTypeOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 매출처 */}
        <div>
          <label className="filter-label">
            매출처
            <input
              type="checkbox"
              checked={multiFields.매출처}
              onChange={() => {
                const next = !multiFields.매출처;

                setMultiFields((prev) => ({
                  ...prev,
                  매출처: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    매출처: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    매출처: "",
                    최종고객: "",
                    담당자: "",
                    확도: "",
                    수주월: "",
                    매출월: "",
                    진행도: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    매출처: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    매출처: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.매출처 ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.매출처.length === vendorOptions.length &&
                    vendorOptions.length > 0
                  }
                  onChange={() => handleSelectAll("매출처", vendorOptions)}
                />
              </label>
              {vendorOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.매출처.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          매출처: [...prev.매출처, item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          매출처: prev.매출처.filter((v) => v !== item),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.매출처)}
              value={formData.매출처 || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  매출처: e.target.value,
                  최종고객: "",
                  담당자: "",
                  확도: "",
                  수주월: "",
                  매출월: "",
                  진행도: "",
                });
              }}
            >
              <option value="">전체</option>

              {vendorOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 최종고객 */}
        <div>
          <label className="filter-label">
            최종고객
            <input
              type="checkbox"
              checked={multiFields.최종고객}
              onChange={() => {
                const next = !multiFields.최종고객;

                setMultiFields((prev) => ({
                  ...prev,
                  최종고객: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    최종고객: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    최종고객: "",
                    담당자: "",
                    확도: "",
                    수주월: "",
                    매출월: "",
                    진행도: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    최종고객: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    최종고객: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.최종고객 ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.최종고객.length === customerOptions.length &&
                    customerOptions.length > 0
                  }
                  onChange={() => handleSelectAll("최종고객", customerOptions)}
                />
              </label>
              {customerOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.최종고객.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          최종고객: [...prev.최종고객, item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          최종고객: prev.최종고객.filter((v) => v !== item),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.최종고객)}
              value={formData.최종고객 || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  최종고객: e.target.value,
                  담당자: "",
                  확도: "",
                  수주월: "",
                  매출월: "",
                  진행도: "",
                });
              }}
            >
              <option value="">전체</option>

              {customerOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 담당자 */}
        <div>
          <label className="filter-label">
            담당자
            <input
              type="checkbox"
              checked={multiFields.담당자}
              onChange={() => {
                const next = !multiFields.담당자;

                setMultiFields((prev) => ({
                  ...prev,
                  담당자: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    담당자: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    담당자: "",
                    확도: "",
                    수주월: "",
                    매출월: "",
                    진행도: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    담당자: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    담당자: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.담당자 ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.담당자.length === ownerOptions.length &&
                    ownerOptions.length > 0
                  }
                  onChange={() => handleSelectAll("담당자", ownerOptions)}
                />
              </label>
              {ownerOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.담당자.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          담당자: [...prev.담당자, item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          담당자: prev.담당자.filter((v) => v !== item),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.담당자)}
              value={formData.담당자 || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  담당자: e.target.value,
                  확도: "",
                  수주월: "",
                  매출월: "",
                  진행도: "",
                });
              }}
            >
              <option value="">전체</option>

              {ownerOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 확도 */}
        <div>
          <label className="filter-label">
            확도
            <input
              type="checkbox"
              checked={multiFields.확도}
              onChange={() => {
                const next = !multiFields.확도;

                setMultiFields((prev) => ({
                  ...prev,
                  확도: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    확도: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    확도: "",
                    수주월: "",
                    매출월: "",
                    진행도: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    확도: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    확도: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.확도 ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.확도.length === accuracyOptions.length &&
                    accuracyOptions.length > 0
                  }
                  onChange={() => handleSelectAll("확도", accuracyOptions)}
                />
              </label>
              {accuracyOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.확도.includes(String(item))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          확도: [...prev.확도, String(item)],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          확도: prev.확도.filter((v) => v !== String(item)),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.확도)}
              value={formData.확도 || ""}
              onChange={(e) => {
                isResetting.current = true;
                setFormData({
                  ...formData,
                  확도: e.target.value,
                  수주월: "",
                  매출월: "",
                  진행도: "",
                });
              }}
            >
              <option value="">전체</option>

              {accuracyOptions.map((item) => (
                <option key={item} value={String(item)}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 수주월 */}
        <div>
          <label className="filter-label">
            수주월
            <input
              type="checkbox"
              checked={multiFields.수주월}
              onChange={() => {
                const next = !multiFields.수주월;

                setMultiFields((prev) => ({
                  ...prev,
                  수주월: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    수주월: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    수주월: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    수주월: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    수주월: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.수주월 ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.수주월.length === orderMonthOptions.length &&
                    orderMonthOptions.length > 0
                  }
                  onChange={() => handleSelectAll("수주월", orderMonthOptions)}
                />
              </label>
              {orderMonthOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.수주월.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          수주월: [...prev.수주월, item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          수주월: prev.수주월.filter((v) => v !== item),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.수주월)}
              value={formData.수주월 || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  수주월: e.target.value,
                });
              }}
            >
              <option value="">전체</option>

              {orderMonthOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 매출월 */}
        <div>
          <label className="filter-label">
            매출월
            <input
              type="checkbox"
              checked={multiFields.매출월}
              onChange={() => {
                const next = !multiFields.매출월;

                setMultiFields((prev) => ({
                  ...prev,
                  매출월: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    매출월: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    매출월: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    매출월: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    매출월: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.매출월 ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.매출월.length === salesMonthOptions.length &&
                    salesMonthOptions.length > 0
                  }
                  onChange={() => handleSelectAll("매출월", salesMonthOptions)}
                />
              </label>
              {salesMonthOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.매출월.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          매출월: [...prev.매출월, item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          매출월: prev.매출월.filter((v) => v !== item),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.매출월)}
              value={formData.매출월 || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  매출월: e.target.value,
                });
              }}
            >
              <option value="">전체</option>

              {salesMonthOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 진행도 */}
        <div>
          <label className="filter-label">
            진행도
            <input
              type="checkbox"
              checked={multiFields.진행도}
              onChange={() => {
                const next = !multiFields.진행도;

                setMultiFields((prev) => ({
                  ...prev,
                  진행도: next,
                }));

                if (next) {
                  setMultiSelected((prev) => ({
                    ...prev,
                    진행도: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    진행도: "",
                  }));
                } else {
                  setMultiSelected((prev) => ({
                    ...prev,
                    진행도: [],
                  }));

                  setFormData((prev) => ({
                    ...prev,
                    진행도: "",
                  }));
                }
              }}
            />
          </label>

          {multiFields.진행도 ? (
            <div className="multi-select-list">
              <label>
                전체
                <input
                  type="checkbox"
                  checked={
                    multiSelected.진행도.length === progressOptions.length &&
                    progressOptions.length > 0
                  }
                  onChange={() => handleSelectAll("진행도", progressOptions)}
                />
              </label>
              {progressOptions.map((item) => (
                <label key={item} className="multi-option">
                  {item}

                  <input
                    type="checkbox"
                    checked={multiSelected.진행도.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMultiSelected((prev) => ({
                          ...prev,
                          진행도: [...prev.진행도, item],
                        }));
                      } else {
                        setMultiSelected((prev) => ({
                          ...prev,
                          진행도: prev.진행도.filter((v) => v !== item),
                        }));
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          ) : (
            <select
              style={getInputStyle(formData.진행도)}
              value={formData.진행도 || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  진행도: e.target.value,
                });
              }}
            >
              <option value="">전체</option>
              <option value="#FFFFFF">⚪</option>
              <option value="#FFFFCC">🟡</option>
              <option value="#D9D9D9">⚫</option>
            </select>
          )}
        </div>

        {/* 프로젝트코드 */}
        <div>
          <label>프로젝트코드</label>

          <input
            value={formData.프로젝트코드 || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                프로젝트코드: e.target.value,
              }))
            }
            style={getInputStyle(formData.프로젝트코드)}
          />
        </div>

        {/* 사업명 */}
        <div>
          <label>사업명</label>

          <input
            value={formData.사업명 || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                사업명: e.target.value,
              }))
            }
            style={getInputStyle(formData.사업명)}
          />
        </div>
      

        {/* 초기화 */}
        <div className="reset-box">
          <label>&nbsp;</label>

          <button
            onClick={handleReset}
            style={{
              padding: "8px 16px",
              background: "#fff",
              color: "#dc2626",
              border: "1px solid #dc2626",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ⭮ 초기화 (F2)
          </button>
        </div>
      </div>
    </div>
  );
}
