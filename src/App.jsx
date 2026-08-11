import "./App.css";
import Dashboard from "./Dashboard";
import BusinessForm from "./pages/BusinessForm";
import { useEffect, useState } from "react";
import { getMasterData } from "./services/api";
import BusinessList from "./pages/BusinessList";

import manage from "../src/assets/manage.png";
import dashboard from "../src/assets/dashboard.png";

import logo from "./assets/logo.png";
import char from "./assets/char.png";

function App() {
  const [page, setPage] = useState("dashboard");
  const [masterData, setMasterData] = useState(null);

  const reloadData = () => {
    getMasterData().then((data) => {
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
                fontSize: "35px",
                fontWeight: "600",
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
                title="사업관리"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(2px) scale(1.08)";
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(2px) scale(1)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(5px) scale(0.95)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(2px) scale(1.08)";
                }}
                style={{
                  padding: "0",
                  marginLeft: "10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  transform: "translateY(2px)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={manage}
                  alt="사업관리"
                  style={{
                    width: "65px",
                    height: "68px",
                    display: "block",
                  }}
                />
              </button>

              <button
                onClick={() => setPage("dashboard")}
                title="대시보드"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(2px) scale(1.08)";
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(2px) scale(1)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(5px) scale(0.95)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(2px) scale(1.08)";
                }}
                style={{
                  padding: "0",
                  marginLeft: "10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  transform: "translateY(2px)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={dashboard}
                  alt="대시보드"
                  style={{
                    width: "60px",
                    height: "63px",
                    display: "block",
                  }}
                />
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
            <a
              href="https://ep.cengroup.co.kr/xclickr3_itcen/gate/login.jsp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={logo}
                alt="logo"
                style={{
                  height: "50px",
                  width: "auto",
                  cursor: "pointer",
                }}
              />
            </a>

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
