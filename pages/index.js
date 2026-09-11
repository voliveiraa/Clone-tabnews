import React from "react";
import Head from "next/head";

const INV_DATA = [
  {
    squad: "Parceria SP",
    focal: "Leo Almeida",
    site: "SP",
    hostname: "SPPAAD-ACLIENT2",
    ip: "10.193.48.204",
    so: "Windows 7",
    app: "CED",
    tipo: "Cliente",
    plan: [{ q: "Q3", state: "current" }],
    status: "Em Andamento",
    solCont: "Mitigado",
  },
  {
    squad: "Parceria SP",
    focal: "Leo Almeida",
    site: "SP",
    hostname: "MIDIAS-CTRS-SP",
    ip: "10.236.28.174",
    so: "Windows 8",
    app: "COT",
    tipo: "Cliente",
    plan: [{ q: "Q4", state: "current" }],
    status: "Pendente",
    solCont: "Mitigado",
  },
  {
    squad: "Parceria SP",
    focal: "Leo Almeida",
    site: "SP",
    hostname: "SRVSPPAMEM1IN03",
    ip: "10.236.72.138",
    so: "Windows 7",
    app: "MAM INGEST",
    tipo: "Cliente",
    plan: [{ q: "Q4", state: "current" }],
    status: "Pendente",
    solCont: "Mitigado",
  },
  {
    squad: "Centros Exibidores",
    focal: "Helena Oliveira / Leo",
    site: "SP",
    hostname: "CLIENT-AIR-DR-1",
    ip: "10.193.152.8",
    so: "Windows 7",
    app: "PEBBLE TVA",
    tipo: "Cliente",
    plan: [{ q: "Q4", state: "current" }],
    status: "Pendente",
    solCont: "Mitigado",
  },
  {
    squad: "Centros Exibidores",
    focal: "Helena Oliveira / Leo",
    site: "SP",
    hostname: "EXB-AB-CH18-1",
    ip: "10.193.49.36",
    so: "Windows 7",
    app: "PEBBLE TVA",
    tipo: "Cliente",
    plan: [{ q: "Q3", state: "current" }],
    status: "Em Andamento",
    solCont: "Mitigado",
  },
  {
    squad: "Centros Exibidores",
    focal: "Helena Oliveira / Leo",
    site: "SP",
    hostname: "EXIB-AB-PROG",
    ip: "10.193.49.44",
    so: "Windows 7",
    app: "PEBBLE TVA",
    tipo: "Cliente",
    plan: [{ q: "Q3", state: "current" }],
    status: "Em Andamento",
    solCont: "Pendente",
  },
  {
    squad: "Centros Exibidores",
    focal: "Helena Oliveira / Leo",
    site: "SP",
    hostname: "INGEST-AB-4",
    ip: "10.193.49.51",
    so: "Windows 7",
    app: "PEBBLE TVA",
    tipo: "Cliente",
    plan: [{ q: "Q3", state: "current" }],
    status: "Em Andamento",
    solCont: "Pendente",
  },
  {
    squad: "Centros Exibidores",
    focal: "Helena Oliveira / Leo",
    site: "SP",
    hostname: "EXIB-AB-SAT-2",
    ip: "10.193.49.35",
    so: "Windows 7",
    app: "PEBBLE TVA",
    tipo: "Cliente",
    plan: [{ q: "Q3", state: "current" }],
    status: "Em Andamento",
    solCont: "Mitigado",
  },
  {
    squad: "Centros Exibidores",
    focal: "Helena Oliveira / Leo",
    site: "SP",
    hostname: "EXIB-AB-COORD",
    ip: "10.193.49.38",
    so: "Windows 7",
    app: "PEBBLE TVA",
    tipo: "Cliente",
    plan: [{ q: "Q3", state: "current" }],
    status: "Em Andamento",
    solCont: "Mitigado",
  },
  {
    squad: "Parceria SP",
    focal: "Leo Almeida / Victor",
    site: "SP",
    hostname: "SKYPE41",
    ip: "10.236.29.5",
    so: "Windows 7",
    app: "SKYPE",
    tipo: "Cliente",
    plan: [
      { q: "Q1", state: "past" },
      { q: "Q2", state: "past" },
      { q: "Q3", state: "current" },
    ],
    status: "Em Andamento",
    solCont: "Pendente",
  },
  {
    squad: "Parceria SP",
    focal: "Leo Almeida / Victor",
    site: "SP",
    hostname: "SVR-SKYPE-M3GN",
    ip: "10.236.29.13",
    so: "Windows 7",
    app: "SKYPE",
    tipo: "Cliente",
    plan: [
      { q: "Q1", state: "past" },
      { q: "Q2", state: "past" },
      { q: "Q3", state: "current" },
    ],
    status: "Em Andamento",
    solCont: "Pendente",
  },
  {
    squad: "Parceria SP",
    focal: "Leo Almeida",
    site: "SP",
    hostname: "WKS-SSTV04",
    ip: "10.236.12.25",
    so: "Windows 7",
    app: "SUPORTE",
    tipo: "Cliente",
    plan: [
      { q: "Q2", state: "past" },
      { q: "Q3", state: "current" },
    ],
    status: "Em Andamento",
    solCont: "Mitigado",
  },
];

function LogoSvg() {
  return (
    <svg viewBox="0 0 491 249" xmlns="http://www.w3.org/2000/svg" aria-label="Logo Globo">
      <defs>
        <linearGradient id="cedinvG1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6B2FF2" />
          <stop offset="100%" stopColor="#12A8E8" />
        </linearGradient>
      </defs>
      <circle cx="124" cy="124" r="100" fill="url(#cedinvG1)" />
      <rect x="70" y="100" width="108" height="48" fill="#0A0D13" rx="4" />
      <circle cx="124" cy="124" r="24" fill="url(#cedinvG1)" />
      <text
        x="205"
        y="150"
        fontFamily="Space Grotesk, sans-serif"
        fontWeight="700"
        fontSize="70"
        fill="url(#cedinvG1)"
      >
        globo
      </text>
    </svg>
  );
}

function CaretSvg() {
  return (
    <svg className="cedinv-caret" viewBox="0 0 16 16" width="16" height="16" fill="none">
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function statusBadge(status) {
  const cls = status === "Em Andamento" ? "status-andamento" : "status-pendente";
  return <span className={`cedinv-badge ${cls}`}>{status}</span>;
}

function solBadge(sol) {
  const cls = sol === "Mitigado" ? "sol-mitigado" : "sol-pendente";
  return <span className={`cedinv-badge ${cls}`}>{sol}</span>;
}

function planChips(plan) {
  return plan.map((item, index) => {
    const sep = index > 0 ? <span key={`${item.q}-sep`} className="sep">›</span> : null;
    const cls = item.state === "current" ? "q-current" : "q-past";
    return (
      <React.Fragment key={`${item.q}-${index}`}>
        {sep}
        <span className={cls}>{item.q}</span>
      </React.Fragment>
    );
  });
}

function Home() {
  return (
    <>
      <Head>
        <title>Inventário de Sistemas — Parceria SP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Inventário de sistemas da parceria SP" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="cedinv-root">
        <header className="cedinv-header">
          <div className="cedinv-brand">
            <LogoSvg />
            <div className="cedinv-brand-text">
              <div className="cedinv-top">CENTRAL DE ENGENHARIA</div>
              <h1>Inventário de Sistemas — Parceria SP</h1>
            </div>
          </div>
          <div className="cedinv-count">{INV_DATA.length} hosts cadastrados</div>
        </header>

        <div className="cedinv-scroll">
          <table className="cedinv-table">
            <thead>
              <tr>
                <th className="cedinv-caret-col"></th>
                <th>Squad / Ponto Focal</th>
                <th>Site</th>
                <th>Hostname</th>
                <th>IP</th>
                <th>SO</th>
                <th>Aplicação</th>
                <th>Tipo</th>
                <th>Plan.</th>
                <th>Status</th>
                <th>Sol. Cont.</th>
              </tr>
            </thead>
            <tbody>
              {INV_DATA.map((item, index) => (
                <React.Fragment key={`${item.hostname}-${index}`}>
                  <tr className="cedinv-row">
                    <td>
                      <CaretSvg />
                    </td>
                    <td>
                      <div className="cedinv-squad">{item.squad}</div>
                      <div className="cedinv-focal">{item.focal}</div>
                    </td>
                    <td>{item.site}</td>
                    <td className="cedinv-hostname">{item.hostname}</td>
                    <td className="cedinv-ip">{item.ip}</td>
                    <td>{item.so}</td>
                    <td>{item.app}</td>
                    <td>
                      <span className="cedinv-badge tipo">{item.tipo}</span>
                    </td>
                    <td>
                      <div className="cedinv-plan">{planChips(item.plan)}</div>
                    </td>
                    <td>{statusBadge(item.status)}</td>
                    <td>{solBadge(item.solCont)}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx>{`
        :global(html, body) {
          margin: 0;
          background: #0a0d13;
        }

        :global(body) {
          font-family: "Space Grotesk", sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .cedinv-root {
          --bg-void: #0a0d13;
          --bg-panel: #11151e;
          --bg-row: #12161f;
          --bg-row-alt: #0f131b;
          --bg-expand: #171c28;
          --line: #252c3b;
          --line-soft: #1d2331;
          --text-1: #eaedf3;
          --text-2: #8c96aa;
          --text-3: #5c6479;
          --globo-grad: linear-gradient(135deg, #6b2ff2, #12a8e8);
          --blue-tag: #4ea8f5;
          --blue-tag-bg: rgba(78, 168, 245, 0.12);
          --amber: #f2a93b;
          --amber-bg: rgba(242, 169, 59, 0.12);
          --green: #3dd68c;
          --green-bg: rgba(61, 214, 140, 0.12);
          --grey-bg: rgba(140, 150, 170, 0.1);
          background: var(--bg-void);
          color: var(--text-1);
          font-family: "Space Grotesk", sans-serif;
          -webkit-font-smoothing: antialiased;
          border-radius: 12px;
          overflow: hidden;
          box-sizing: border-box;
          max-width: 1440px;
          margin: 0 auto;
        }

        .cedinv-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 28px;
          border-bottom: 1px solid var(--line);
          background: linear-gradient(180deg, rgba(107, 47, 242, 0.1), transparent);
          position: relative;
        }

        .cedinv-header::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: var(--globo-grad);
        }

        .cedinv-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .cedinv-brand svg {
          height: 26px;
          width: auto;
          display: block;
        }

        .cedinv-brand-text .cedinv-top {
          font-size: 10.5px;
          letter-spacing: 0.08em;
          color: var(--text-3);
          font-family: "JetBrains Mono", monospace;
        }

        .cedinv-brand-text h1 {
          font-size: 17px;
          font-weight: 600;
          margin: 2px 0 0;
        }

        .cedinv-count {
          font-family: "JetBrains Mono", monospace;
          font-size: 12px;
          color: var(--text-2);
        }

        .cedinv-scroll {
          overflow-x: auto;
        }

        table.cedinv-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1080px;
        }

        .cedinv-table thead th {
          text-align: left;
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--text-3);
          font-weight: 500;
          padding: 14px 16px;
          border-bottom: 1px solid var(--line);
          white-space: nowrap;
        }

        .cedinv-table th.cedinv-caret-col {
          width: 34px;
          padding-left: 20px;
        }

        .cedinv-row td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--line-soft);
          font-size: 13px;
          vertical-align: middle;
          white-space: nowrap;
        }

        .cedinv-row:nth-child(4n + 1) td,
        .cedinv-row:nth-child(4n + 2) td {
          background: var(--bg-row);
        }

        .cedinv-row:nth-child(4n + 3) td,
        .cedinv-row:nth-child(4n + 4) td {
          background: var(--bg-row-alt);
        }

        .cedinv-row:hover td {
          background: #1a2030;
        }

        .cedinv-caret {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          color: var(--text-3);
        }

        .cedinv-squad {
          font-weight: 600;
          font-size: 13.5px;
          color: var(--text-1);
        }

        .cedinv-focal {
          font-size: 11.5px;
          color: var(--text-3);
          margin-top: 2px;
        }

        .cedinv-hostname {
          font-family: "JetBrains Mono", monospace;
          color: var(--blue-tag);
          font-size: 12.5px;
        }

        .cedinv-ip {
          font-family: "JetBrains Mono", monospace;
          color: var(--text-2);
          font-size: 12.5px;
        }

        .cedinv-badge {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          white-space: nowrap;
          display: inline-block;
        }

        .cedinv-badge.tipo {
          color: var(--blue-tag);
          background: var(--blue-tag-bg);
        }

        .cedinv-badge.status-andamento {
          color: var(--blue-tag);
          background: var(--blue-tag-bg);
        }

        .cedinv-badge.status-pendente {
          color: var(--text-2);
          background: var(--grey-bg);
        }

        .cedinv-badge.sol-mitigado {
          color: var(--green);
          background: var(--green-bg);
        }

        .cedinv-badge.sol-pendente {
          color: var(--amber);
          background: var(--amber-bg);
        }

        .cedinv-plan {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
        }

        .cedinv-plan .q-past {
          color: var(--text-3);
          text-decoration: line-through;
        }

        .cedinv-plan .q-current {
          color: var(--amber);
          background: var(--amber-bg);
          padding: 2px 7px;
          border-radius: 12px;
          font-weight: 600;
        }

        .cedinv-plan .sep {
          color: var(--text-3);
        }

        @media (max-width: 860px) {
          .cedinv-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            padding: 18px 20px;
          }
        }
      `}</style>
    </>
  );
}

export default Home;
