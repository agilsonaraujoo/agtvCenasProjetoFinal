# Script de Deploy Automatizado

Este diretório contém scripts para geração de pacotes de deploy para a HostGator.

## Como gerar um novo deploy

1. **Execute o script de deploy** com o seguinte comando:
   ```powershell
   .\gerar-deploy-completo.ps1
   ```

2. **Localize o arquivo gerado** na pasta `../deploy-archives/` com o formato `deployV{numero}_AAAAMMDDHHMMSS.zip`

3. **Faça upload** do arquivo ZIP para a HostGator e extraia o conteúdo na pasta `public_html`

## Prompt para solicitar novo deploy

Quando precisar de um novo pacote de deploy, use o seguinte prompt:

```
Por favor, gere um novo pacote de deploy para produção. 
O arquivo ZIP deve ser nomeado sequencialmente (v1, v2, v3, etc.) 
com base na versão mais recente existente na pasta de deploys.
```

## Sobre o Script

- Gera automaticamente um novo arquivo de deploy
- Numeração sequencial (v1, v2, v3, ...)
- Mantém histórico de versões
- Inclui data e hora no nome do arquivo

## Requisitos

- PowerShell 5.1+
- Node.js 16+ e npm 8+
- Acesso de administrador

## Local do Arquivo Gerado

`../deploy-archives/deployV{numero}_AAAAMMDDHHMMSS.zip`
