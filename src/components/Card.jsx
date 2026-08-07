// 대시보드 화면의 공통박스 디자인 담당

export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      <div className="card-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="card-body">{children}</div>
    </section>
  );
}
