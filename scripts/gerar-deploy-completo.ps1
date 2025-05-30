# Script para gerar um pacote de deploy completo para a HostGator

# 1. Configurações iniciais
$deployFolder = "..\deploy-archives"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$zipFileName = "deployV2_$timestamp.zip"
$zipPath = Join-Path $deployFolder $zipFileName

# Criar pasta de deploys se não existir
if (-not (Test-Path $deployFolder)) {
    New-Item -ItemType Directory -Path $deployFolder | Out-Null
}

# Limpar builds anteriores
Write-Host "Limpando builds anteriores..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .\build -ErrorAction SilentlyContinue
Remove-Item -Force "$deployFolder\deployV2_*.zip" -ErrorAction SilentlyContinue

# 2. Instalar dependências
Write-Host "Instalando dependências..." -ForegroundColor Cyan
npm install

# 3. Criar build de produção
Write-Host "Criando build de produção..." -ForegroundColor Cyan
npm run build

# 4. Criar arquivo .htaccess otimizado
$htaccessContent = @"
# Habilita o rewrite engine
RewriteEngine On
RewriteBase /

# Redireciona todas as requisições para index.html para suportar React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/index\.html$
RewriteRule . /index.html [L]

# Configurações de cache para melhor desempenho
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType image/jpg "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/gif "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
</IfModule>

# Ativa a compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
"@

# Salvar o novo .htaccess
Set-Content -Path ".\build\.htaccess" -Value $htaccessContent

# 5. Verificar se todos os arquivos necessários existem
$requiredFiles = @(
    ".\build\index.html",
    ".\build\asset-manifest.json",
    ".\build\static\js\main.*.js",
    ".\build\static\css\main.*.css"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "ERRO: Arquivo não encontrado: $file" -ForegroundColor Red
        exit 1
    }
}

# 6. Criar arquivo ZIP
Write-Host "Criando arquivo ZIP de deploy..." -ForegroundColor Cyan
Write-Host "Arquivo será salvo em: $zipPath" -ForegroundColor Cyan

# Garantir que a pasta de destino existe
if (-not (Test-Path $deployFolder)) {
    New-Item -ItemType Directory -Path $deployFolder | Out-Null
}

# Remover arquivos antigos
Get-ChildItem -Path $deployFolder -Filter "deployV2_*.zip" | Remove-Item -Force

Add-Type -Assembly System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory(
    (Resolve-Path ".\build").Path,
    (Resolve-Path $destination).Path,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
)

# 7. Verificar se o arquivo ZIP foi criado
if (Test-Path $zipPath) {
    $zipSize = (Get-Item $zipPath).Length / 1MB
    Write-Host "`nDeploy criado com sucesso!" -ForegroundColor Green
    Write-Host "Arquivo: $((Get-Item $zipPath).FullName)" -ForegroundColor Green
    Write-Host "Tamanho: {0:N2} MB" -f $zipSize -ForegroundColor Green
    
    Write-Host "`nPróximos passos:" -ForegroundColor Yellow
    Write-Host "1. Acesse a pasta: $((Get-Item $deployFolder).FullName)"
    Write-Host "2. Faça upload do arquivo $zipFileName para a HostGator"
    Write-Host "3. Extraia o conteúdo na pasta public_html"
    Write-Host "4. Certifique-se de que o .htaccess foi extraído corretamente"
} else {
    Write-Host "ERRO: Falha ao criar o arquivo ZIP" -ForegroundColor Red
    exit 1
}
