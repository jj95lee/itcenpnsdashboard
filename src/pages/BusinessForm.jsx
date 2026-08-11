import { saveBusiness } from "../utils/googleSheet";
import { useState } from "react";
import BusinessInput from "../components/BusinessInput";

export default function BusinessForm({ masterData, reloadData, showToast }) {
  const [formData, setFormData] = useState({
    metrics: {
      수주: {
        "1월": 0,
        "2월": 0,
        "3월": 0,
        "4월": 0,
        "5월": 0,
        "6월": 0,
        "7월": 0,
        "8월": 0,
        "9월": 0,
        "10월": 0,
        "11월": 0,
        "12월": 0,
      },

      매출: {
        "1월": 0,
        "2월": 0,
        "3월": 0,
        "4월": 0,
        "5월": 0,
        "6월": 0,
        "7월": 0,
        "8월": 0,
        "9월": 0,
        "10월": 0,
        "11월": 0,
        "12월": 0,
      },

      매출원가: {
        "1월": 0,
        "2월": 0,
        "3월": 0,
        "4월": 0,
        "5월": 0,
        "6월": 0,
        "7월": 0,
        "8월": 0,
        "9월": 0,
        "10월": 0,
        "11월": 0,
        "12월": 0,
      },

      매출이익: {
        "1월": 0,
        "2월": 0,
        "3월": 0,
        "4월": 0,
        "5월": 0,
        "6월": 0,
        "7월": 0,
        "8월": 0,
        "9월": 0,
        "10월": 0,
        "11월": 0,
        "12월": 0,
      },
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
    수주월: "",
    매출월: "",
    비고: "",
  });
  const [showMetric, setShowMetric] = useState(false);

  const makeMetricRows = (data) => {
    const rows = [];

    Object.keys(data.metrics).forEach((metric) => {
      rows.push({
        ...data,

        metric,

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
      });
    });

    return rows;
  };

  const handleSubmit = async () => {
    try {
      const saveRows = makeMetricRows(formData);

      // 저장 실행
      // await saveBusiness(saveRows);

      // // 성공 토스트
      // showToast("등록 완료");

      // // 데이터 다시 불러오기
      // await reloadData();

      saveBusiness(saveRows)
        .then(() => {
          reloadData();
        })
        .catch(() => {
          showToast("저장 실패");
        });

      showToast("등록 완료");

      // 입력 초기화
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
        수주월: "",
        매출월: "",
        비고: "",

        metrics: {
          수주: {
            "1월": 0,
            "2월": 0,
            "3월": 0,
            "4월": 0,
            "5월": 0,
            "6월": 0,
            "7월": 0,
            "8월": 0,
            "9월": 0,
            "10월": 0,
            "11월": 0,
            "12월": 0,
          },

          매출: {
            "1월": 0,
            "2월": 0,
            "3월": 0,
            "4월": 0,
            "5월": 0,
            "6월": 0,
            "7월": 0,
            "8월": 0,
            "9월": 0,
            "10월": 0,
            "11월": 0,
            "12월": 0,
          },

          매출원가: {
            "1월": 0,
            "2월": 0,
            "3월": 0,
            "4월": 0,
            "5월": 0,
            "6월": 0,
            "7월": 0,
            "8월": 0,
            "9월": 0,
            "10월": 0,
            "11월": 0,
            "12월": 0,
          },

          매출이익: {
            "1월": 0,
            "2월": 0,
            "3월": 0,
            "4월": 0,
            "5월": 0,
            "6월": 0,
            "7월": 0,
            "8월": 0,
            "9월": 0,
            "10월": 0,
            "11월": 0,
            "12월": 0,
          },
        },
      });
    } catch (error) {

      showToast("저장 실패");
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        height: "calc(100vh - 120px)",
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: "15px",
      }}
    >
      {toast}
      <h2
        style={{
          marginBottom: "25px",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        사업 등록
      </h2>

      <hr style={{ margin: "30px 0" }} />

      <div
        onClick={() => setShowMetric(!showMetric)}
        style={{
          marginTop: "30px",
          padding: "12px 16px",
          background: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <span>Metric</span>
        <span>{showMetric ? "▲" : "▼"}</span>
      </div>

      {showMetric && (
        <BusinessInput
          masterData={masterData}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          style={{
            background: "red",
            color: "white",
            padding: "20px",
            fontSize: "20px",
          }}
          onClick={handleSubmit}
        >
          등록
        </button>
      </div>
    </div>
  );
}
