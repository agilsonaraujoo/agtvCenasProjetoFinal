# Script para otimizar a imagem do WhatsApp

# Função para mostrar progresso
function Show-Progress {
    param([string]$message)
    Write-Host "`n$message`n" -ForegroundColor Cyan
}

# 1. Verifica se o ImageMagick está instalado
Show-Progress "Verificando dependências..."
if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
    Write-Host "O ImageMagick não está instalado. Por favor, instale-o primeiro." -ForegroundColor Red
    exit 1
}

# 2. Define os parâmetros
$originalImage = "build/AGTV.jpg"
$optimizedImage = "build/AGTV-optimized.jpg"
$targetWidth = 1200
$targetHeight = 630
$quality = 80

# 3. Verifica se a imagem original existe
if (-not (Test-Path $originalImage)) {
    Write-Host "Imagem original não encontrada: $originalImage" -ForegroundColor Red
    exit 1
}

# 4. Otimiza a imagem
Show-Progress "Otimizando imagem..."
magick convert $originalImage -resize "${targetWidth}x${targetHeight}" -quality $quality $optimizedImage

# 5. Verifica o tamanho da imagem otimizada
$optimizedSize = (Get-Item $optimizedImage).Length / 1KB
Show-Progress "Tamanho da imagem otimizada: ${optimizedSize} KB"

# 6. Verifica se a imagem foi otimizada com sucesso
if ($optimizedSize -gt 300) {
    Write-Host "Aviso: A imagem ainda está grande ($optimizedSize KB). Considerar reduzir a qualidade." -ForegroundColor Yellow
}

# 7. Atualiza o index.html com o novo caminho da imagem
Show-Progress "Atualizando index.html..."
$indexHtml = "public/index.html"
(Get-Content $indexHtml) -replace "AGTV.jpg", "AGTV-optimized.jpg" | Set-Content $indexHtml

Show-Progress "Processo concluído!"
Write-Host "A imagem foi otimizada e o index.html foi atualizado." -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. Faça upload do arquivo AGTV-optimized.jpg no HostGator" -ForegroundColor Yellow
Write-Host "2. Limpe o cache do WhatsApp" -ForegroundColor Yellow
Write-Host "3. Teste compartilhando o link novamente" -ForegroundColor Yellow
