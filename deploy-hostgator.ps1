# Script de Deploy para HostGator

# Função para mostrar progresso
function Show-Progress {
    param([string]$message)
    Write-Host "`n$message`n" -ForegroundColor Cyan
}

# 1. Faz a build do projeto
Show-Progress "Fazendo build do projeto..."
npm run build

# 2. Verifica se a build foi bem-sucedida
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao fazer build do projeto" -ForegroundColor Red
    exit 1
}

# 3. Compacta os arquivos para upload
Show-Progress "Criando arquivo zip para deploy..."
Compress-Archive -Path "build/*" -DestinationPath "deploy-hostgator.zip" -Force

# 4. Gera instruções de upload
$instructions = @"
Instruções de Deploy para HostGator:

1. Faça login no seu painel de controle do HostGator
2. Procure por "File Manager" (Gerenciador de Arquivos)
3. Navegue até a pasta `public_html` (ou o diretório do seu domínio)
4. Faça upload do arquivo "deploy-hostgator.zip"
5. Extraia o arquivo zip na pasta correta
6. Verifique se o arquivo [.htaccess](cci:7://file:///a:/ProjetoAgtvCenas/.htaccess:0:0-0:0) está na raiz do domínio
7. Limpe o cache do navegador
8. Acesse seu site para verificar se está funcionando

Arquivos importantes:
- index.html (página principal)
- static/ (pasta com css, js e mídia)
- .htaccess (necessário para o React Router)

Se o site não estiver funcionando:
1. Verifique se o arquivo [.htaccess](cci:7://file:///a:/ProjetoAgtvCenas/.htaccess:0:0-0:0) está na raiz do domínio
2. Verifique se todos os arquivos da pasta static/ foram extraídos corretamente
3. Limpe o cache do navegador
4. Verifique se o servidor tem suporte a mod_rewrite
"@

$instructions | Out-File -FilePath "instrucoes-deploy.txt" -Encoding UTF8

# 5. Gera instruções de cache
$cacheInstructions = @"
Instruções para limpar cache do WhatsApp:

1. Abra o WhatsApp
2. Vá em Configurações > Dados e Armazenamento
3. Toque em "Limpar Cache"
4. Aguarde alguns minutos
5. Teste compartilhando o link novamente
"@

$cacheInstructions | Out-File -FilePath "instrucoes-cache.txt" -Encoding UTF8

Show-Progress "Processo concluído!"
Write-Host "Arquivos gerados:" -ForegroundColor Green
Write-Host "- deploy-hostgator.zip (contém todos os arquivos do site)" -ForegroundColor Green
Write-Host "- instrucoes-deploy.txt (instruções detalhadas de deploy)" -ForegroundColor Green
Write-Host "- instrucoes-cache.txt (instruções para limpar cache)" -ForegroundColor Green

Write-Host "`nAgora você pode fazer upload do arquivo deploy-hostgator.zip no File Manager do HostGator." -ForegroundColor Yellow
