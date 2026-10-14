---
title: "Por que existem 23,976, 29,97 e 59,94 quadros por segundo"
topic: video-digital
date: 2026-10-12
summary: A origem da divisão por 1001 e como isso aparece no timecode.
---

As taxas "fracionadas" nasceram na TV em cores NTSC: para evitar interferência entre a subportadora de cor e o áudio, a taxa de quadros foi dividida por **1001/1000**.

| Taxa "redonda" | Taxa real |
|---|---|
| 24 | 23,976 (24000/1001) |
| 30 | 29,97 (30000/1001) |
| 60 | 59,94 (60000/1001) |

As taxas de 25 e 50 quadros (países PAL, como grande parte da Europa) não sofrem essa divisão.

## Consequências práticas

- Misturar 29,97 e 30 em uma timeline gera, com o tempo, perda de sincronia, pois a diferença acumula quadros.
- Em 29,97 existe o *drop-frame timecode*, que pula números de quadro (não quadros reais) para o timecode acompanhar o relógio de parede.
- Ao entregar ou ingerir material, confirme sempre a taxa exata no arquivo, não apenas "30".
