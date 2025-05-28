# Script de Deploy Simples para HostGator

# Função para mostrar progresso
function Show-Progress {
    param([string]$message)
    Write-Host "`n$message`n" -ForegroundColor Cyan
}

# Verifica se estamos na pasta correta
if (!(Test-Path "package.json")) {
    Write-Host "Por favor, execute este script na pasta raiz do projeto." -ForegroundColor Red
    exit
}

# 1. Faz a build do projeto
Show-Progress "Fazendo build do projeto..."
npm run build

# 2. Copia apenas os arquivos necessários para uma pasta temporária
Show-Progress "Preparando arquivos para deploy..."
$deployPath = "deploy-temp"

if (Test-Path $deployPath) {
    Remove-Item -Recurse -Force $deployPath
}

New-Item -ItemType Directory -Path $deployPath

# Copia os arquivos necessários
Copy-Item "build/index.html" -Destination $deployPath
Copy-Item "build/static" -Destination $deployPath -Recurse
Copy-Item ".htaccess" -Destination $deployPath

# 3. Compacta os arquivos
Show-Progress "Criando arquivo zip para deploy..."
Compress-Archive -Path "$deployPath/*" -DestinationPath "deploy-hostgator.zip" -Force

# 4. Limpeza
Remove-Item -Recurse -Force $deployPath

# 5. Gera instruções simples
$instructions = @"
Instruções Simples de Deploy para HostGator:

1. Faça login no seu painel de controle do HostGator
2. Procure por "File Manager" (Gerenciador de Arquivos)
3. Navegue até a pasta `public_html` (ou o diretório do seu domínio)
4. Faça upload do arquivo "deploy-hostgator.zip"
5. Extraia o arquivo zip na pasta correta
6. Limpe o cache do navegador
7. Acesse seu site para verificar se está funcionando

Arquivos importantes:
- index.html (página principal)
- static/ (pasta com css, js e mídia)
- .htaccess (necessário para o React Router)
"@

$instructions | Out-File -FilePath "instrucoes-simples.txt" -Encoding UTF8

# Finalização
Show-Progress "Processo concluído!"
Write-Host "Arquivos gerados:" -ForegroundColor Green
Write-Host "- deploy-hostgator.zip (contém apenas os arquivos necessários)" -ForegroundColor Green
Write-Host "- instrucoes-simples.txt (instruções detalhadas)" -ForegroundColor Green

Write-Host "`nAgora você pode fazer upload do arquivo deploy-hostgator.zip diretamente no File Manager do HostGator." -ForegroundColor Yellow
