export const hierarchy = [
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
];

export function getOptions(masterData, formData, field) {
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
          (value) =>
            value !== "" &&
            value !== null &&
            value !== undefined
        )
        .map((value) => String(value))
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
    (row) => row[field] === "" || row[field] == null
  );

  if (hasEmpty) {
    values.unshift("(공백)");
  }

  return values;
}