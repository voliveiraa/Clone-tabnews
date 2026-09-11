import React, { useState } from "react";
import Head from "next/head";

const CASOS_DATA = [
  {
    fornecedor: "Grass Valley",
    caso: "00944912",
    equipamento: "IQUCP25",
    sn: "S58091262",
    titulo: "Saída em preto (black) intermitente no gateway GW5",
    status: "wait",
    statusLabel: "Aguardando fornecedor",
    periodo: "-",
    descricao:
      "O gateway identificado como GW5 apresenta falha intermitente de saída em preto (black) sempre que ocorre uma troca de sinal. Foi observado no monitor PWV RK56 e em outras saídas do mesmo gateway, sem relação com uma fonte ou destino específico. Já existe uma gravação em vídeo da falha, disponível para envio. Foi solicitado à Grass Valley um direcionamento sobre logs e diagnósticos necessários.",
  },
  {
    fornecedor: "Grass Valley",
    caso: "00943199",
    equipamento: "Mesa Masterpiece",
    sn: "-",
    titulo: "Ruído de áudio no ar durante o programa BDSP",
    status: "investig",
    statusLabel: "Em investigação",
    periodo: "-",
    descricao:
      "Durante a exibição ao vivo do programa BDSP, foi identificado um ruído de áudio no ar, com suspeita de origem na mesa de mixagem Masterpiece — equipamento que já havia apresentado ocorrências semelhantes anteriormente. O caso foi aberto para investigar a causa raiz e evitar repetição em futuras transmissões.",
  },
  {
    fornecedor: "Grass Valley",
    caso: "00945495",
    equipamento: "Mesa Masterpiece",
    sn: "-",
    titulo: "Perdas de sinal no ar — SPG e switch já descartados",
    status: "investig",
    statusLabel: "Em investigação",
    periodo: "-",
    descricao:
      "Duas perdas de sinal no ar no mesmo dia (10h05m57s–10h06m16s, 19s; e 10h07m18s–10h07m40s, 22s), além de uma terceira ocorrência de 4s. Já foi verificado que o problema não está no SPG nem no switch Cisco. Foi solicitada a análise dos logs da mesa Masterpiece para identificar a origem das perdas.",
  },
  {
    fornecedor: "Tektronix",
    caso: "00946651",
    equipamento: "SPG8000A",
    sn: "-",
    titulo: "Instabilidade SPG–SPINE-LEAF nas telas de multivisão",
    status: "wait",
    statusLabel: "Aguardando fornecedor",
    periodo: "24–25/09",
    descricao:
      "Em 25/09 ocorreu sintoma semelhante ao de 24/09: todas as telas de multivisão oscilaram, com perda de referência e switchover entre os SPGs. Horas depois, o sintoma se repetiu — todo o sistema IP oscilou — mas sem registro de switchover nos logs dessa segunda ocorrência. O time de redes identificou um problema de conexão entre o SPG e o switch de rede (SPINE-LEAF), além de instabilidade na rede no momento das ocorrências.",
  },
  {
    fornecedor: "Video Data",
    caso: "#2305",
    equipamento: "Pebble · Sistema C",
    sn: "-",
    titulo: "Falha recorrente no Sistema C do Pebble",
    status: "wait",
    statusLabel: "Aguardando fornecedor",
    periodo: "Recorrente (últ. 31/08)",
    descricao:
      "O material executa normalmente nos Sistemas A/B, mas exibe a claquete no lugar do conteúdo ao rodar no Sistema C. Tudo indica falha na propagação dos metadados de A/B para o C. Exemplo registrado: material G1 \"P0321034\", em 31/08 às 16h17, com imagens e logs anexados. Caso está sob análise da Video Data.",
  },
  {
    fornecedor: "Video Data",
    caso: "#2310",
    equipamento: "Servidores 1 e 2",
    sn: "-",
    titulo: "Travamento e failover dos servidores 1 e 2",
    status: "wait",
    statusLabel: "Aguardando fornecedor",
    periodo: "10/09, 01h50",
    descricao:
      "Travamento momentâneo dos Servidores 1 e 2 seguido de failover em 10/09 por volta de 01h50. Os logs dos Masters A e B mostram, no mesmo intervalo, uma sequência de falhas de comunicação (timeouts, erro de conexão, desconexão, VITC inválido com fallback de sync), sugerindo instabilidade transitória de conectividade entre componentes de playout/redundância. Logs enviados via Dropbox e caso sob análise da Video Data.",
  },
];

function CaretSvg({ open }) {
  return (
    <svg className={`cedforn-caret ${open ? "open" : ""}`} viewBox="0 0 16 16" width="16" height="16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function statusBadge(item) {
  return <span className={`cedforn-badge ${item.status}`}>{item.statusLabel}</span>;
}

function Home() {
  const [openCase, setOpenCase] = useState(null);

  return (
    <>
      <Head>
        <title>Casos Abertos com Fornecedores</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Painel de casos abertos com fornecedores" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="cedforn-root">
        <header className="cedforn-header">
          <div className="cedforn-brand">
            <div className="cedforn-brand-text">
              <div className="cedforn-top">CENTRAL DE ENGENHARIA</div>
              <h1>Casos Abertos com Fornecedores</h1>
            </div>
          </div>
          <div className="cedforn-count">{CASOS_DATA.length} casos em aberto</div>
        </header>

        <div className="cedforn-legend">
          <span>
            <i style={{ background: "var(--amber)" }} />
            Aguardando retorno do fornecedor
          </span>
          <span>
            <i style={{ background: "var(--blue-tag)" }} />
            Em investigação interna
          </span>
        </div>

        <div className="cedforn-scroll">
          <table className="cedforn-table">
            <thead>
              <tr>
                <th className="cedforn-caret-col"></th>
                <th>Fornecedor</th>
                <th>Caso</th>
                <th>Título</th>
                <th>Equipamento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CASOS_DATA.map((item, index) => {
                const isOpen = openCase === index;
                return (
                  <React.Fragment key={`${item.caso}-${index}`}>
                    <tr
                      className={`cedforn-row ${isOpen ? "open" : ""}`}
                      onClick={() => setOpenCase(isOpen ? null : index)}
                    >
                      <td>
                        <CaretSvg open={isOpen} />
                      </td>
                      <td className="cedforn-fornecedor">{item.fornecedor}</td>
                      <td className="cedforn-caso">CASE {item.caso}</td>
                      <td className="cedforn-titulo">{item.titulo}</td>
                      <td className="cedforn-equip">{item.equipamento}</td>
                      <td>{statusBadge(item)}</td>
                    </tr>

                    {isOpen && (
                      <tr className="cedforn-expand">
                        <td colSpan="6">
                          <div className="cedforn-expand-inner open">
                            <div className="cedforn-expand-content">
                              <p>{item.descricao}</p>
                              <div className="cedforn-meta">
                                <span>
                                  <b>Fornecedor</b> {item.fornecedor}
                                </span>
                                <span>
                                  <b>Caso</b> {item.caso}
                                </span>
                                <span>
                                  <b>Equipamento</b> {item.equipamento}
                                  {item.sn !== "-" ? ` · S/N ${item.sn}` : ""}
                                </span>
                                <span>
                                  <b>Período</b> {item.periodo}
                                </span>
                                <span>
                                  <b>Status</b> {item.statusLabel}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
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

        .cedforn-root {
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

        .cedforn-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 28px;
          border-bottom: 1px solid var(--line);
          background: linear-gradient(180deg, rgba(107, 47, 242, 0.1), transparent);
          position: relative;
        }

        .cedforn-header::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: var(--globo-grad);
        }

        .cedforn-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .cedforn-brand-text .cedforn-top {
          font-size: 10.5px;
          letter-spacing: 0.08em;
          color: var(--text-3);
          font-family: "JetBrains Mono", monospace;
        }

        .cedforn-brand-text h1 {
          font-size: 17px;
          font-weight: 600;
          margin: 2px 0 0;
        }

        .cedforn-count {
          font-family: "JetBrains Mono", monospace;
          font-size: 12px;
          color: var(--text-2);
        }

        .cedforn-legend {
          display: flex;
          gap: 24px;
          padding: 14px 28px;
          border-bottom: 1px solid var(--line);
          font-size: 12px;
          color: var(--text-2);
          flex-wrap: wrap;
        }

        .cedforn-legend span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .cedforn-legend i {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          display: inline-block;
        }

        .cedforn-scroll {
          overflow-x: auto;
        }

        table.cedforn-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 880px;
        }

        .cedforn-table thead th {
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

        .cedforn-table th.cedforn-caret-col {
          width: 34px;
          padding-left: 20px;
        }

        .cedforn-row td {
          padding: 16px;
          border-bottom: 1px solid var(--line-soft);
          font-size: 13px;
          vertical-align: middle;
        }

        .cedforn-row:nth-child(4n + 1) td,
        .cedforn-row:nth-child(4n + 2) td {
          background: var(--bg-row);
        }

        .cedforn-row:nth-child(4n + 3) td,
        .cedforn-row:nth-child(4n + 4) td {
          background: var(--bg-row-alt);
        }

        .cedforn-row:hover td {
          background: #1a2030;
        }

        .cedforn-row.open td {
          background: #1a2030;
        }

        .cedforn-caret {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          color: var(--text-3);
          transition: transform 0.18s ease;
        }

        .cedforn-caret.open {
          transform: rotate(90deg);
          color: var(--text-1);
        }

        .cedforn-fornecedor {
          font-weight: 600;
          font-size: 13.5px;
          color: var(--text-1);
        }

        .cedforn-caso {
          font-family: "JetBrains Mono", monospace;
          color: var(--blue-tag);
          font-size: 12.5px;
        }

        .cedforn-titulo {
          font-size: 13px;
          color: var(--text-1);
          max-width: 320px;
          white-space: normal;
          line-height: 1.4;
        }

        .cedforn-equip {
          font-size: 12.5px;
          color: var(--text-2);
          white-space: nowrap;
        }

        .cedforn-badge {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
          display: inline-block;
        }

        .cedforn-badge.wait {
          color: var(--amber);
          background: var(--amber-bg);
        }

        .cedforn-badge.investig {
          color: var(--blue-tag);
          background: var(--blue-tag-bg);
        }

        .cedforn-expand td {
          padding: 0;
          border-bottom: 1px solid var(--line);
        }

        .cedforn-expand-inner {
          max-height: 320px;
          overflow: hidden;
        }

        .cedforn-expand-content {
          background: var(--bg-expand);
          padding: 20px 28px 24px 58px;
          border-left: 3px solid transparent;
          border-image: var(--globo-grad) 1;
        }

        .cedforn-expand-content p {
          font-size: 13.5px;
          color: var(--text-2);
          line-height: 1.6;
          margin: 0 0 12px;
          max-width: 820px;
        }

        .cedforn-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 11.5px;
          color: var(--text-3);
          font-family: "JetBrains Mono", monospace;
        }

        .cedforn-meta span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cedforn-meta b {
          color: var(--text-2);
          font-weight: 500;
        }

        @media (max-width: 860px) {
          .cedforn-header {
            padding: 18px 20px;
          }

          .cedforn-legend {
            padding: 12px 20px;
          }

          .cedforn-expand-content {
            padding: 16px 20px 20px 44px;
          }
        }
      `}</style>
    </>
  );
}

export default Home;
