@echo off
chcp 65001 >nul
echo 正在启动 3D Viewer 本地测试服务 (http://localhost:8088) ...
start http://localhost:8088
python -m http.server 8088
pause

