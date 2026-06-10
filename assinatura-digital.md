 # Assinatura Digital com Certificado A1 — Pesquisa Inicial
                                                                                                                                                                 ## Contexto     
  Webapp para assinatura digital de contratos de trabalho com validade jurídica plena,
  usando o certificado A1 (ICP-Brasil) da empresa BRASAS.

  ## Decisões técnicas

  - **Certificado**: A1 da empresa (arquivo .pfx/.p12), armazenado no servidor
  - **Padrão**: PAdES — padrão ICP-Brasil para assinatura em PDF
  - **Backend**: Python (FastAPI) + `pyhanko`
  - **Hospedagem**: Google Cloud Run (integra com Drive/Sheets já usados)
  - **Assinatura do funcionário**: simples (CPF + IP + timestamp como audit trail)

  ## Fluxo

  1. Funcionário preenche e aceita o contrato (CPF + checkbox + timestamp)
  2. Backend assina o PDF com o A1 da BRASAS (PAdES/ICP-Brasil)
  3. PDF assinado salvo no Drive + enviado por e-mail

  ## Por que não usar Google Apps Script

  GAS não suporta assinatura de PDF com certificados — precisa de backend separado.

  ## Base legal

  - **Lei 14.442/2022** — permite assinatura eletrônica em contratos trabalhistas
  - Certificado A1 ICP-Brasil dá validade plena, sem risco em reclamações trabalhistas

  ## Próximos passos

  - [ ] Definir onde o .pfx ficará armazenado (secret manager ou env var)
  - [ ] Protótipo do endpoint de assinatura com pyhanko
  - [ ] Definir template do contrato em PDF
  - [ ] Integrar com o fluxo de admissão
