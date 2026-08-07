import "./App.css";
import Dashboard from "./Dashboard";
import BusinessForm from "./pages/BusinessForm";
import { useEffect, useState } from "react";
import { getMasterData } from "./services/api";
import BusinessList from "./pages/BusinessList";

import logo from "./assets/logo.png";
import char from "./assets/char.png";

function App() {
  const [page, setPage] = useState("dashboard");
  const [masterData, setMasterData] = useState(null);

  const reloadData = () => {
    getMasterData().then((data) => {
      console.log("받은 데이터 개수:", data.rows.length);
      console.log("마지막 데이터:", data.rows[data.rows.length - 1]);

      setMasterData(data);
    });
  };

  useEffect(() => {
    reloadData();
  }, []);

  if (!masterData) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f4f8ff",
          flexDirection: "column",
          gap: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "6px solid #dbeafe",
            borderTop: "6px solid #2563eb",
            animation: "spin 1s linear infinite",
          }}
        />

        <div
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1e3a8a",
          }}
        >
          데이터 불러오는 중...
        </div>

        <style>
          {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
        </style>
      </div>
    );
  }

  return (
    <div>
      <header className="topbar">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* 왼쪽 메뉴 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "400",
                color: "#fff",
              }}
            >
              사업관리 시스템
            </h1>
            <div
              style={{
                display: "flex",
                gap: "6px",
              }}
            >
              <button
                onClick={() => setPage("list")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#eaf2ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
                style={{
                  padding: "5px 10px",
                  fontSize: "12px",
                  background: "#fff",
                  color: "#1f4e79",
                  border: "none",
                  borderRadius: "5px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                사업관리
              </button>

              <button
                onClick={() => setPage("dashboard")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#eaf2ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
                style={{
                  padding: "5px 10px",
                  fontSize: "12px",
                  background: "#fff",
                  color: "#1f4e79",
                  border: "none",
                  borderRadius: "5px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                대시보드
              </button>
            </div>
          </div>

          {/* 오른쪽 이미지 */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                height: "50px",
                width: "auto",
              }}
            />

            <img
              src={char}
              alt="char"
              style={{
                height: "40px",
                width: "auto",
              }}
            />
          </div>
        </div>
      </header>

      <main style={{ padding: "30px" }}>
        {page === "list" && (
          <BusinessList masterData={masterData} reloadData={reloadData} />
        )}

        {page === "form" && (
          <BusinessForm
            masterData={masterData}
            reloadData={reloadData}
            showToast={showToast}
          />
        )}

        {page === "dashboard" && <Dashboard masterData={masterData} />}
      </main>
    </div>
  );
}

export default App;
