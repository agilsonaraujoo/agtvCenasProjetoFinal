# Script para subir o código para o GitHub

# Função para mostrar progresso
function Show-Progress {
    param([string]$message)
    Write-Host "`n$message`n" -ForegroundColor Cyan
}

# 1. Verifica se o Git está instalado
Show-Progress "Verificando Git..."
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git não está instalado. Por favor, instale-o primeiro." -ForegroundColor Red
    exit 1
}

# 2. Pede o URL do repositório
Show-Progress "Configurando repositório..."
$repoUrl = Read-Host "Digite o URL do seu repositório GitHub (ex: https://github.com/user/repo.git)"

# 3. Configura o repositório remoto
Show-Progress "Configurando repositório remoto..."
git remote add origin $repoUrl

# 4. Renomeia a branch para main
Show-Progress "Renomeando branch..."
git branch -M main

# 5. Faz o push
Show-Progress "Enviando código para o GitHub..."
git push -u origin main

Show-Progress "Processo concluído!"
Write-Host "Seu código foi enviado para o GitHub." -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. Verifique se o código apareceu no seu repositório GitHub" -ForegroundColor Yellow
Write-Host "2. Configure o GitHub Pages se quiser hospedar o site gratuitamente" -ForegroundColor Yellow
