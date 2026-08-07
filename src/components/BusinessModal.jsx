import { saveBusiness } from "../utils/googleSheet";
import { useState, useEffect } from "react";
import BusinessInput from "./BusinessInput";
import "../styles/BusinessModal.css";

export default function BusinessModal({
  open,
  onClose,
  masterData,
  reloadData,
  editData,
  showToast,
}) {
  const [formData, setFormData] = useState({
    metrics: {
      수주: {},
      매출: {},
      매출원가: {},
      매출이익: {},
    },

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
    사업명: "",
    확도: "",
    진행도: "",
    수주월: "",
    매출월: "",
    비고: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      const newData = {
        ...editData.basic,
        metrics: editData.metrics,
      };

      setFormData(newData);
    } else {
      setFormData({
        연도: "",
        "New/Sold": "",
        팀: "솔루션영업팀",
        구분: "",
        매출유형: "",
        고객유형: "",
        매출처: "",
        최종고객: "",
        담당자: "",
        프로젝트코드: "",
        사업명: "",
        확도: "",
        진행도: "",
        수주월: "",
        매출월: "",
        비고: "",

        metrics: {
          수주: {},
          매출: {},
          매출원가: {},
          매출이익: {},
        },
      });
    }
  }, [editData]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        console.log("닫기 실행");
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

  const makeMetricRows = (data) => {
    return Object.keys(data.metrics).map((metric) => ({
      ...data,

      metric,

      비고: metric === "수주" ? data.비고 : "",

      "1월": data.metrics[metric]["1월"] ?? 0,
      "2월": data.metrics[metric]["2월"] ?? 0,
      "3월": data.metrics[metric]["3월"] ?? 0,
      "4월": data.metrics[metric]["4월"] ?? 0,
      "5월": data.metrics[metric]["5월"] ?? 0,
      "6월": data.metrics[metric]["6월"] ?? 0,
      "7월": data.metrics[metric]["7월"] ?? 0,
      "8월": data.metrics[metric]["8월"] ?? 0,
      "9월": data.metrics[metric]["9월"] ?? 0,
      "10월": data.metrics[metric]["10월"] ?? 0,
      "11월": data.metrics[metric]["11월"] ?? 0,
      "12월": data.metrics[metric]["12월"] ?? 0,
    }));
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

  const handleSubmit = async () => {
    if (saving) return;

    setSaving(true);

    const id = editData ? editData.basic.id : crypto.randomUUID();

    const saveRows = makeMetricRows({
      ...formData,
      id,
      수주월: getFirstInputMonth("수주"),
      매출월: getFirstInputMonth("매출"),
    });

    console.log("전송할 데이터:", saveRows);

    saveBusiness(saveRows)
      .then(() => {
        reloadData();
      })
      .catch(() => {
        showToast(editData ? "수정 실패" : "등록 실패");
      });

    onClose();

    showToast(editData ? "수정 완료" : "등록 완료");

    setSaving(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.35)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        overflowY: "auto",
      }}
    >
      <div
        className="business-modal"
        style={{
          background: "white",
          padding: "20px",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            padding: "0px 2px",
            borderBottom: "2px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>{editData ? "사업 수정" : "사업 등록"}</h2>

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

        {/* 내용 */}
        <div
          style={{
            padding: "15px 24px",
            minHeight: "500px",
          }}
        >
          <BusinessInput
            masterData={masterData}
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        {/* 하단 버튼 */}
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            padding: "18px 24px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              border: "none",
              background: "#f1f5f9",
              color: "#475569",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: "600",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: "14px",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving
              ? editData
                ? "수정 중..."
                : "등록 중..."
              : editData
                ? "수정"
                : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
