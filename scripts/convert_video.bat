@echo off
echo Convertendo o vídeo para 1080p...
ffmpeg -i "public\videos\fundo-original.mp4" -vf "scale=-1:1080" -c:v libx264 -crf 23 -preset veryfast -c:a copy "public\videos\fundo-1080p.mp4"
echo Conversão concluída!
pause
