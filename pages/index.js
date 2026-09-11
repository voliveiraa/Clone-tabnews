import Head from "next/head";

const CED_DATA = {
  updatedLabel: "atualizado em 25/09/2026",
  stats: {
    total: 6,
    grassValley: 4,
    videoData: 2,
    aguardandoFornecedor: 4,
  },
  grassValley: [
    {
      numero: "00944912",
      status: "wait",
      statusLabel: "Aguardando fornecedor",
      titulo: "Saída em preto (black) intermitente no gateway GW5",
      descricao:
        "O gateway apresenta falha de black sempre que ocorre uma troca de sinal, sem relação com fonte ou destino específico. Vídeo da falha já disponível para envio.",
      meta: [
        { label: "Equipamento", value: "IQUCP25" },
        { label: "S/N", value: "S58091262" },
      ],
    },
    {
      numero: "00943199",
      status: "investig",
      statusLabel: "Em investigação",
      titulo: "Ruído de áudio no ar durante o programa BDSP",
      descricao:
        "Ruído identificado no ar com suspeita de origem na mesa Masterpiece, equipamento com histórico de ocorrências semelhantes.",
      meta: [{ label: "Equipamento", value: "Mesa Masterpiece" }],
    },
    {
      numero: "00945495",
      status: "investig",
      statusLabel: "Em investigação",
      titulo: "Perdas de sinal no ar — SPG e switch já descartados",
      descricao:
        "Duas quedas de sinal no ar (19s e 22s) e uma terceira de 4s no mesmo dia. SPG e switch Cisco já foram descartados; logs da Masterpiece em análise.",
      meta: [
        { label: "Equipamento", value: "Mesa Masterpiece" },
        { label: "Duração", value: "19s · 22s · 4s" },
      ],
    },
    {
      numero: "00946651",
      status: "wait",
      statusLabel: "Aguardando fornecedor",
      titulo: "Instabilidade SPG–SPINE-LEAF nas telas de multivisão",
      descricao:
        "Oscilação nas telas de multivisão em dois dias seguidos, com switchover do SPG na primeira ocorrência. Time de redes aponta instabilidade na conexão SPG–SPINE-LEAF.",
      meta: [
        { label: "Equipamento", value: "SPG8000A · Tektronix" },
        { label: "Período", value: "24–25/09" },
      ],
    },
  ],
  videoData: [
    {
      numero: "#2305",
      status: "wait",
      statusLabel: "Aguardando fornecedor",
      titulo: "Falha recorrente no Sistema C do Pebble",
      descricao:
        "Material executa normalmente nos Sistemas A/B, mas exibe claquete no Sistema C. Caso está sob análise da Video Data para identificar a causa na propagação de metadados.",
      meta: [
        { label: "Equipamento", value: "Pebble · Sistema C" },
        { label: "Registro", value: "31/08, 16h17" },
      ],
    },
    {
      numero: "#2310",
      status: "wait",
      statusLabel: "Aguardando fornecedor",
      titulo: "Travamento e failover dos servidores 1 e 2",
      descricao:
        "Sequência de falhas de comunicação nos logs Master A/B no minuto do incidente, sugerindo instabilidade transitória entre componentes de playout/redundância. Logs enviados via Dropbox e caso sob análise da Video Data.",
      meta: [
        { label: "Equipamento", value: "Servidores 1 e 2" },
        { label: "Horário", value: "10/09, 01h50" },
      ],
    },
  ],
};

function LogoSvg() {
  return (
    <svg viewBox="0 0 491 249" xmlns="http://www.w3.org/2000/svg" aria-label="Logo Globo">
      <defs>
        <linearGradient id="cedG1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6B2FF2" />
          <stop offset="100%" stopColor="#12A8E8" />
        </linearGradient>
      </defs>
      <circle cx="124" cy="124" r="100" fill="url(#cedG1)" />
      <rect x="70" y="100" width="108" height="48" fill="#0A0D13" rx="4" />
      <circle cx="124" cy="124" r="24" fill="url(#cedG1)" />
      <text
        x="205"
        y="150"
        fontFamily="Space Grotesk, sans-serif"
        fontWeight="700"
        fontSize="70"
        fill="url(#cedG1)"
      >
        globo
      </text>
    </svg>
  );
}

function renderCaseMeta(meta) {
  return meta.map((item) => (
    <span key={`${item.label}-${item.value}`}>
      <b>{item.label}</b> {item.value}
    </span>
  ));
}

function CaseCard({ caso }) {
  return (
    <article className="ced-card">
      <div className="ced-card-top">
        <span className="ced-case-no">CASE {caso.numero}</span>
        <span className={`ced-badge ced-${caso.status}`}>{caso.statusLabel}</span>
      </div>
      <h3>{caso.titulo}</h3>
      <p>{caso.descricao}</p>
      <div className="ced-meta">{renderCaseMeta(caso.meta)}</div>
    </article>
  );
}

function Panel({ title, cases }) {
  return (
    <section className="ced-panel">
      <div className="ced-panel-head">
        <div className="ced-bar" />
        <h2>{title}</h2>
        <span className="ced-count">{cases.length} casos</span>
      </div>
      {cases.map((caso) => (
        <CaseCard key={caso.numero} caso={caso} />
      ))}
    </section>
  );
}

function Home() {
  const { stats, grassValley, videoData } = CED_DATA;

  return (
    <>
      <Head>
        <title>Painel CED</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Painel de casos abertos da Central de Engenharia"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="ced-root">
        <header className="ced-header">
          <div className="ced-brand">
            <LogoSvg />
            <div className="ced-brand-text">
              <span className="ced-top">CENTRAL DE ENGENHARIA</span>
              <h1>Painel de Casos Abertos</h1>
            </div>
          </div>
          <div className="ced-updated">
            <span className="ced-dot" />
            {stats.total} casos em aberto · {CED_DATA.updatedLabel}
          </div>
        </header>

        <div className="ced-stats">
          <div className="ced-stat ced-total">
            <div className="ced-num">{stats.total}</div>
            <div className="ced-label">Casos abertos no total</div>
          </div>
          <div className="ced-stat ced-gv">
            <div className="ced-num">{stats.grassValley}</div>
            <div className="ced-label">Grass Valley / Tektronix</div>
          </div>
          <div className="ced-stat ced-vd">
            <div className="ced-num">{stats.videoData}</div>
            <div className="ced-label">Video Data</div>
          </div>
          <div className="ced-stat ced-wait">
            <div className="ced-num">{stats.aguardandoFornecedor}</div>
            <div className="ced-label">Aguardando retorno de fornecedor</div>
          </div>
        </div>

        <div className="ced-legend">
          <span>
            <i style={{ background: "var(--amber)" }} />
            Aguardando retorno do fornecedor
          </span>
          <span>
            <i style={{ background: "var(--blue-tag)" }} />
            Em investigação interna
          </span>
        </div>

        <div className="ced-panels">
          <Panel title="Grass Valley" cases={grassValley} />
          <Panel title="Video Data" cases={videoData} />
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

        .ced-root {
          --bg-void: #0a0d13;
          --bg-card: #171c28;
          --line: #252c3b;
          --line-soft: #1d2331;
          --text-1: #eaedf3;
          --text-2: #8c96aa;
          --text-3: #5c6479;
          --globo-grad: linear-gradient(135deg, #6b2ff2, #12a8e8);
          --gv-accent: #8b5cf6;
          --vd-accent: #12a8e8;
          --amber: #f2a93b;
          --amber-bg: rgba(242, 169, 59, 0.12);
          --blue-tag: #4ea8f5;
          --blue-tag-bg: rgba(78, 168, 245, 0.12);
          background:
            radial-gradient(ellipse 900px 500px at 15% -10%, rgba(107, 47, 242, 0.16), transparent 60%),
            radial-gradient(ellipse 900px 500px at 100% 0%, rgba(18, 168, 232, 0.14), transparent 60%),
            var(--bg-void);
          color: var(--text-1);
          font-family: "Space Grotesk", sans-serif;
          -webkit-font-smoothing: antialiased;
          padding-bottom: 64px;
          border-radius: 12px;
          overflow: hidden;
          box-sizing: border-box;
          max-width: 1440px;
          margin: 0 auto;
        }

        .ced-mono {
          font-family: "JetBrains Mono", monospace;
        }

        .ced-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 48px;
          border-bottom: 1px solid var(--line);
          background: linear-gradient(180deg, rgba(107, 47, 242, 0.1), transparent);
          position: relative;
        }

        .ced-header::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: var(--globo-grad);
        }

        .ced-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ced-brand svg {
          height: 30px;
          width: auto;
          display: block;
        }

        .ced-brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ced-brand-text .ced-top {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--text-3);
          font-family: "JetBrains Mono", monospace;
        }

        .ced-brand-text h1 {
          font-size: 19px;
          font-weight: 600;
          margin: 0;
        }

        .ced-updated {
          text-align: right;
          font-family: "JetBrains Mono", monospace;
          font-size: 12px;
          color: var(--text-2);
        }

        .ced-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--amber);
          margin-right: 7px;
          box-shadow: 0 0 0 3px rgba(242, 169, 59, 0.18);
        }

        .ced-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-bottom: 1px solid var(--line);
        }

        .ced-stat {
          padding: 26px 48px;
          border-right: 1px solid var(--line);
        }

        .ced-stat:last-child {
          border-right: none;
        }

        .ced-stat .ced-num {
          font-family: "JetBrains Mono", monospace;
          font-size: 34px;
          font-weight: 600;
          line-height: 1;
        }

        .ced-stat .ced-label {
          margin-top: 8px;
          font-size: 13px;
          color: var(--text-2);
        }

        .ced-total .ced-num {
          background: var(--globo-grad);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ced-gv .ced-num {
          color: var(--gv-accent);
        }

        .ced-vd .ced-num {
          color: var(--vd-accent);
        }

        .ced-wait .ced-num {
          color: var(--amber);
        }

        .ced-legend {
          display: flex;
          gap: 28px;
          padding: 18px 48px;
          border-bottom: 1px solid var(--line);
          font-size: 12.5px;
          color: var(--text-2);
          flex-wrap: wrap;
        }

        .ced-legend span {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ced-legend i {
          width: 9px;
          height: 9px;
          border-radius: 2px;
          display: inline-block;
        }

        .ced-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          max-width: 1400px;
          margin: 0 auto;
        }

        .ced-panel {
          padding: 40px 48px;
        }

        .ced-panel + .ced-panel {
          border-left: 1px solid var(--line);
        }

        .ced-panel-head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 22px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--line-soft);
        }

        .ced-panel-head .ced-bar {
          width: 5px;
          height: 22px;
          border-radius: 2px;
          background: var(--globo-grad);
        }

        .ced-panel-head h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .ced-panel-head .ced-count {
          font-family: "JetBrains Mono", monospace;
          font-size: 12px;
          color: var(--text-3);
        }

        .ced-card {
          background: var(--bg-card);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 20px 22px 20px 20px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }

        .ced-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--globo-grad);
        }

        .ced-card:last-child {
          margin-bottom: 0;
        }

        .ced-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .ced-case-no {
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          color: var(--text-2);
        }

        .ced-badge {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .ced-badge.ced-wait {
          color: var(--amber);
          background: var(--amber-bg);
        }

        .ced-badge.ced-investig {
          color: var(--blue-tag);
          background: var(--blue-tag-bg);
        }

        .ced-card h3 {
          font-size: 15.5px;
          font-weight: 600;
          margin: 0 0 8px;
          line-height: 1.35;
        }

        .ced-card p {
          font-size: 13.5px;
          color: var(--text-2);
          line-height: 1.55;
          margin: 0 0 14px;
        }

        .ced-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 11.5px;
          color: var(--text-3);
          font-family: "JetBrains Mono", monospace;
        }

        .ced-meta span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ced-meta b {
          color: var(--text-2);
          font-weight: 500;
        }

        @media (max-width: 860px) {
          .ced-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            padding: 24px;
          }

          .ced-updated {
            text-align: left;
          }

          .ced-stats {
            grid-template-columns: 1fr 1fr;
          }

          .ced-stat {
            padding: 20px 24px;
            border-bottom: 1px solid var(--line);
          }

          .ced-panels {
            grid-template-columns: 1fr;
          }

          .ced-panel {
            padding: 28px 24px;
          }

          .ced-panel + .ced-panel {
            border-left: none;
            border-top: 1px solid var(--line);
          }

          .ced-legend {
            padding: 16px 24px;
          }
        }
      `}</style>
    </>
  );
}

export default Home;
