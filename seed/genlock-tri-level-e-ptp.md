---
title: "Genlock, tri-level e PTP: como o broadcast mantém tudo sincronizado"
topic: sincronismo
date: 2026-10-13
summary: Por que câmeras, switchers e servidores precisam de uma referência comum.
---

Em um estúdio, câmeras, switcher, gerador de caracteres e gravadores precisam produzir os quadros **no mesmo instante**. Sem isso, uma troca entre duas fontes gera falhas visíveis: saltos de imagem, quadros repetidos ou perdidos.

## Referência analógica: black burst e tri-level

- **Black burst**: referência para sistemas SD, e ainda usada em muita instalação mista.
- **Tri-level sync**: referência para sistemas HD; é o sinal de sincronismo que as câmeras e o switcher recebem do gerador de sincronismo (*sync generator*).

Ligar o *genlock* de um equipamento a essa referência faz com que o relógio dele siga o do gerador.

## Referência em rede: PTP

No vídeo sobre IP, a referência vem pela rede com o **PTP** (*Precision Time Protocol*, IEEE 1588). O perfil de broadcast é descrito no **SMPTE ST 2059**: um *grandmaster* distribui o tempo e todos os equipamentos se ajustam a ele.

## Resumo

| Tecnologia | Onde aparece |
|---|---|
| Black burst | SD, instalações mistas |
| Tri-level | HD, SDI |
| PTP (ST 2059) | Vídeo sobre IP (ST 2110) |

A pergunta de diagnóstico mais útil é: *qual é a referência deste equipamento e ele está travado nela?*
