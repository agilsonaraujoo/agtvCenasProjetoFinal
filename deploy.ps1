# Script de Deploy para HostGator

# Função para mostrar progresso
function Show-Progress {
    param([string]$message)
    Write-Host "`n$message`n" -ForegroundColor Cyan
}

# Função para pausar
function Pause-Script {
    Write-Host "`nPressione qualquer tecla para continuar..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Verifica se estamos na pasta correta
if (!(Test-Path "package.json")) {
    Write-Host "Por favor, execute este script na pasta raiz do projeto." -ForegroundColor Red
    exit
}

# 1. Faz a build do projeto
Show-Progress "Fazendo build do projeto..."
npm run build

# 2. Compacta os arquivos necessários
Show-Progress "Criando arquivo zip para deploy..."
$filesToZip = @(
    "build/*",
    ".htaccess"
)

# Remove zip antigo se existir
if (Test-Path "deploy.zip") {
    Remove-Item "deploy.zip"
}

# Cria o zip
Compress-Archive -Path $filesToZip -DestinationPath "deploy.zip" -Force

# 3. Gera instruções
Show-Progress "Gerando instruções de deploy..."
$instructions = @"
Instruções de Deploy para HostGator

1. Faça login no seu painel de controle do HostGator
2. Procure por "File Manager" (Gerenciador de Arquivos)
3. Navegue até a pasta `public_html` (ou o diretório do seu domínio)
4. Faça upload do arquivo "deploy.zip"
5. Extraia o arquivo zip na pasta correta
6. Verifique se o arquivo .htaccess está na raiz do domínio
7. Limpe o cache do navegador
8. Acesse seu site para verificar se está funcionando
"@

$instructions | Out-File -FilePath "instrucoes-deploy.txt" -Encoding UTF8

# Finalização
Show-Progress "Processo concluído!"
Write-Host "Arquivos gerados:" -ForegroundColor Green
Write-Host "- deploy.zip (contém todos os arquivos necessários)" -ForegroundColor Green
Write-Host "- instrucoes-deploy.txt (instruções detalhadas)" -ForegroundColor Green

Pause-Script
