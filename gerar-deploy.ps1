# Script para gerar arquivo ZIP otimizado para deploy no HostGator

# 1. Limpar builds anteriores
Write-Host "Limpando builds anteriores..." -ForegroundColor Yellow
Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "deploy-agtv.zip" -Force -ErrorAction SilentlyContinue

# 2. Instalar dependências e fazer build
Write-Host "Instalando dependências..." -ForegroundColor Yellow
npm install

# 3. Fazer build de produção
Write-Host "Gerando build de produção..." -ForegroundColor Yellow
npm run build

# 4. Verificar se a build foi bem-sucedida
if (-not (Test-Path "build")) {
    Write-Host "Erro: A pasta 'build' não foi criada. Verifique os erros acima." -ForegroundColor Red
    exit 1
}

# 5. Mover o arquivo .htaccess para a pasta build
Copy-Item -Path "public/.htaccess" -Destination "build/" -Force

# 6. Criar arquivo de versão
$version = Get-Date -Format "yyyyMMddHHmmss"
Set-Content -Path "build/version.txt" -Value $version

# 7. Criar arquivo ZIP otimizado
Write-Host "Criando arquivo ZIP otimizado..." -ForegroundColor Yellow
Add-Type -Assembly "System.IO.Compression.FileSystem"
[System.IO.Compression.ZipFile]::CreateFromDirectory("$PWD/build", "$PWD/deploy-agtv.zip", [System.IO.Compression.CompressionLevel]::Optimal, $false)

# 8. Gerar instruções de deploy
$instructions = @"

=== INSTRUÇÕES DE DEPLOY HOSTGATOR ===

1. Acesse o painel de controle do HostGator
2. Vá em 'File Manager' (Gerenciador de Arquivos)
3. Navegue até a pasta 'public_html' (ou a pasta do seu domínio)
4. Faça upload do arquivo 'deploy-agtv.zip'
5. Extraia o conteúdo do ZIP na pasta atual
6. Verifique se o arquivo .htaccess está na raiz
7. Acesse seu site para testar

Dicas importantes:
- O arquivo .htaccess já está configurado para roteamento SPA
- Certifique-se de que o PHP esteja na versão 7.4 ou superior
- Em caso de erros, limpe o cache do navegador

Arquivo de deploy gerado: deploy-agtv.zip
Tamanho: $([math]::Round((Get-Item "deploy-agtv.zip").Length/1MB, 2)) MB
"@

# 9. Salvar instruções em arquivo
$instructions | Out-File -FilePath "instrucoes-deploy.txt" -Encoding UTF8

# 10. Mostrar mensagem de conclusão
Write-Host "`n=== DEPLOY GERADO COM SUCESSO ===`n" -ForegroundColor Green
Write-Host "Arquivo gerado: deploy-agtv.zip"
Write-Host "Tamanho: $([math]::Round((Get-Item "deploy-agtv.zip").Length/1MB, 2)) MB"
Write-Host "`nInstruções salvas em: instrucoes-deploy.txt"
Write-Host "`nPronto para fazer upload para o HostGator!" -ForegroundColor Green
