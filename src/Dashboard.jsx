import Card from "./components/Card"; // 카드 틀
import {
  makeOverallData,
  makeProductData,
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
// import { useEffect, useState } from "react"; // React Hook
import logo from "./assets/logo.png";
import char from "./assets/char.png";

export default function Dashboard({ masterData }) {
  const rows = masterData.rows;

  const overallData = makeOverallData(rows);
  const productData = makeProductData(rows);
  const renewalData = makeRenewalData(rows);
  const procurementData = makeProcurementData(rows);
  const customerData = makeCustomerData(rows);

  return (
    <div className="dashboard" >
      {" "}
      {/* 전체 화면 */}
      <header className="dashboard__header">
        {" "}
        
        {/* 상단 제목 */}
        <div className="dashboard__header-content">
          <h1 className="dashboard__title">솔루션영업팀 손익전망</h1>

          <p className="dashboard__meta">2024–2025 실적 비교</p>
        </div>
      </header>
      <main className="dashboard__main">
        {" "}
        {/* 메인 내용 */}
        {/* 전체 카드 */}
        <Card
          className="overall-card"
          title="전체"
          subtitle="팀 전체 실적 요약"
        >
          <div className="overall-layout">
            {" "}
            {/* 표 + 그래프 배치 */}
            <div className="overall-table">
              <OverallTable rows={overallData} />
            </div>
            <div className="overall-chart">
              <OverallChart data={overallData} />
            </div>
          </div>
        </Card>
        {/* 제품별 카드 */}
        <Card
          className="product-card"
          title="제품별 판매 추이"
          subtitle="제품별 매출 및 손익 현황"
        >
          <div className="product-layout">
            <div className="product-table">
              <ProductTable rows={productData} />
            </div>

            <div className="product-chart">
              <ProductChart data={productData} />
            </div>
          </div>
        </Card>
        {/* 갱신형 카드 */}
        <Card
          className="renewal-card"
          title="갱신형 제품"
          subtitle="갱신형 제품 실적"
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
        {/* 조달 카드 */}
        <Card
          className="procurement-card"
          title="조달판매"
          subtitle="조달판매 실적"
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
        {/* 고객사 카드 */}
        <Card
          className="customer-card"
          title="고객사 분류별 판매 추이"
          subtitle="고객사별 실적"
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
        {" "}
        {/* 하단 */}
        <p>© 2026 ITCEN PNS · FinTech Security Department · Sales Management Dashboard</p>
      </footer>
    </div>
  );
}

