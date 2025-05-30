# Script para gerar um pacote de deploy completo para a HostGator

# 1. Limpar builds anteriores
Write-Host "Limpando builds anteriores..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .\build -ErrorAction SilentlyContinue
Remove-Item -Force .\deployV2.zip -ErrorAction SilentlyContinue

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
$source = ".\build\*"
$destination = ".\deployV2.zip"

if (Test-Path $destination) {
    Remove-Item $destination
}

Add-Type -Assembly System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory(
    (Resolve-Path ".\build").Path,
    (Resolve-Path $destination).Path,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
)

# 7. Verificar se o arquivo ZIP foi criado
if (Test-Path $destination) {
    $zipSize = (Get-Item $destination).Length / 1MB
    Write-Host "`nDeploy criado com sucesso!" -ForegroundColor Green
    Write-Host "Arquivo: $((Get-Item $destination).FullName)" -ForegroundColor Green
    Write-Host "Tamanho: {0:N2} MB" -f $zipSize -ForegroundColor Green
    
    Write-Host "`nPróximos passos:" -ForegroundColor Yellow
    Write-Host "1. Faça upload do arquivo deployV2.zip para a HostGator"
    Write-Host "2. Extraia o conteúdo na pasta public_html"
    Write-Host "3. Certifique-se de que o .htaccess foi extraído corretamente"
} else {
    Write-Host "ERRO: Falha ao criar o arquivo ZIP" -ForegroundColor Red
    exit 1
}
