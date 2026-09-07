import { useMemo, useState } from "react";
import Card from "./components/Card"; // 카드 틀
import {
  makeOverallData,
  makeOverallDataExcludingMaintenance,
  makeMaintenanceData,
  makeProductData,
  makeProductDataExcludingMaintenance,
  makeRenewalData,
  makeProcurementData,
  makeCustomerData,
} from "./utils/dashboardData";
import OverallTable from "./components/OverallTable"; // 전체 표
import OverallChart from "./components/OverallChart"; // 전체 그래프
import ProductTable from "./components/ProductTable"; // 제품별 표
import ProductChart from "./components/ProductChart"; // 제품별 그래프
import RenewalTable from "./components/RenewalTable"; // 갱신형 표
import RenewalChart from "./components/RenewalChart"; // 갱신형 그래프
import ProcurementTable from "./components/ProcurementTable"; // 조달 표
import ProcurementChart from "./components/ProcurementChart"; // 조달 그래프
import CustomerTable from "./components/CustomerTable"; // 고객사 표
import CustomerChart from "./components/CustomerChart"; // 고객사 그래프
import "./Dashboard.css"; // 전체 css
import logo from "./assets/logo.png";
import char from "./assets/char.png";

export default function Dashboard({ masterData }) {
  const rows = (masterData.rows || []).map((row) => {
    const category = String(row["구분"] || "")
      .trim()
      .toLowerCase();

    return {
      ...row,
      구분:
        category === "솔루션 - enxection" ? "솔루션 - EnXection" : row["구분"],
    };
  });

  // 데이터에 실제로 존재하는 팀 목록을 자동으로 생성
  const teamOptions = useMemo(() => {
    const teams = [
      ...new Set(
        rows.map((row) => String(row["팀"] || "").trim()).filter(Boolean),
      ),
    ];

    // 기존 대시보드와 동일하게 솔루션영업팀을 기본값으로 사용
    teams.sort((a, b) => {
      if (a === "솔루션영업팀") return -1;
      if (b === "솔루션영업팀") return 1;
      return a.localeCompare(b, "ko");
    });

    return teams;
  }, [rows]);

  const [selectedTeam, setSelectedTeam] = useState("솔루션영업팀");

  // 데이터가 갱신되어 기본 팀이 없어지는 경우 첫 번째 팀으로 자동 변경
  const activeTeam = teamOptions.includes(selectedTeam)
    ? selectedTeam
    : teamOptions[0] || "솔루션영업팀";

  const overallData = makeOverallData(rows, activeTeam);
  const overallDataExcludingMaintenance = makeOverallDataExcludingMaintenance(
    rows,
    activeTeam,
  );

  const maintenanceData = makeMaintenanceData(rows, activeTeam);

  const productData = makeProductData(rows, activeTeam);
  const productDataExcludingMaintenance = makeProductDataExcludingMaintenance(
    rows,
    activeTeam,
  );

  const renewalData = makeRenewalData(rows, activeTeam);
  const procurementData = makeProcurementData(rows, activeTeam);
  const customerData = makeCustomerData(rows, activeTeam);

  return (
    <div className="dashboard">
      {/* 전체 화면 */}
      <header className="dashboard__header">
        {/* 상단 제목 */}
        <div
          className="dashboard__header-content"
          className="dashboard__header-content"
          style={{ position: "relative" }}
        >
          {/* 팀 선택 */}
          <div className="dashboard__team-select">
            <label htmlFor="dashboard-team-select">팀 선택</label>

            <select
              id="dashboard-team-select"
              value={activeTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              {teamOptions.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          <h1 className="dashboard__title">{activeTeam} 손익전망</h1>

          <p className="dashboard__meta">2024–2026 실적 비교</p>
        </div>
      </header>

      <main className="dashboard__main">
        {/* 전체 카드 */}
        <Card className="overall-card" title="전체">
          {/* 유지보수 포함 */}
          <div className="overall-section">
            <p className="product-section-subtitle">
              팀 전체 실적 요약<span>(유지보수 포함)</span>
            </p>

            <div className="overall-layout">
              <div className="overall-table">
                <OverallTable rows={overallData} />
              </div>

              <div className="overall-chart">
                <OverallChart data={overallData} />
              </div>
            </div>
          </div>

          {/* 유지보수 제외 */}
          <div className="overall-section overall-section--exclude">
            <p className="product-section-subtitle">
              팀 전체 실적 요약<span>(유지보수 제외)</span>
            </p>

            <div className="overall-layout">
              <div className="overall-table">
                <OverallTable rows={overallDataExcludingMaintenance} />
              </div>

              <div className="overall-chart">
                <OverallChart data={overallDataExcludingMaintenance} />
              </div>
            </div>
          </div>
        </Card>

        {/* 유지보수 카드 */}
        <Card className="maintenance-card" title="유지보수">
          <p className="product-section-subtitle">유지보수 실적 요약</p>

          <div className="overall-layout">
            <div className="overall-table">
              <OverallTable rows={maintenanceData} />
            </div>

            <div className="overall-chart">
              <OverallChart data={maintenanceData} />
            </div>
          </div>
        </Card>

        {/* 제품별 카드 */}
        <Card className="product-card" title="제품별 판매 추이">
          {/* 유지보수 포함 */}
          <div className="product-section">
            <p className="product-section-subtitle">
              제품별 매출 및 손익 현황<span>(유지보수 포함)</span>
            </p>

            <div className="product-layout">
              <div className="product-table">
                <ProductTable rows={productData} />
              </div>

              <div className="product-chart">
                <ProductChart data={productData} />
              </div>
            </div>
          </div>

          {/* 유지보수 제외 */}
          <div className="product-section product-section--exclude">
            <p className="product-section-subtitle">
              제품별 매출 및 손익 현황<span>(유지보수 제외)</span>
            </p>

            <div className="product-layout">
              <div className="product-table">
                <ProductTable rows={productDataExcludingMaintenance} />
              </div>

              <div className="product-chart">
                <ProductChart data={productDataExcludingMaintenance} />
              </div>
            </div>
          </div>
        </Card>

        {/* 갱신형 카드 */}
        {activeTeam === "솔루션영업팀" && (
          <Card
            className="renewal-card"
            title="갱신형 제품"
            subtitle="갱신형 제품 실적 (유지보수 제외)"
          >
            <div className="renewal-layout">
              <div className="renewal-table">
                <RenewalTable rows={renewalData} />
              </div>

              <div className="renewal-chart">
                <RenewalChart data={renewalData} />
              </div>
            </div>
          </Card>
        )}

        {/* 조달 카드 */}
        {activeTeam === "솔루션영업팀" && (
          <Card
            className="procurement-card"
            title="조달판매"
            subtitle="조달판매 실적 (유지보수 제외)"
          >
            <div className="procurement-layout">
              <div className="procurement-table">
                <ProcurementTable rows={procurementData} />
              </div>

              <div className="procurement-chart">
                <ProcurementChart data={procurementData} />
              </div>
            </div>
          </Card>
        )}

        {/* 고객사 카드 */}
        <Card
          className="customer-card"
          title="고객사 분류별 판매 추이"
          subtitle="고객사별 실적 (유지보수 포함)"
        >
          <div className="customer-layout">
            <div className="customer-table">
              <CustomerTable rows={customerData} />
            </div>

            <div className="customer-chart">
              <CustomerChart data={customerData} />
            </div>
          </div>
        </Card>
      </main>

      <footer className="dashboard__footer">
        {/* 하단 */}
        <p>
          © 2026 ITCEN PNS · FinTech Security Department · Sales Management
          Dashboard
        </p>
      </footer>
    </div>
  );
}
