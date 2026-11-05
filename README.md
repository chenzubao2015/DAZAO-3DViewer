# DAZAO 3DViewer

大造机械（DAZAO）全画幅纯净版 3D 模型在线查看器，可直接上传至 GitHub 仓库进行静态部署（GitHub Pages / Cloudflare Pages / Vercel / Nginx）。

## 功能特点

- **全画幅纯净界面**：去除顶部品牌横幅、外链图标、作者信息、赞助/广告位、QA 文档及示例模型推广，3D 画布 100% 铺满视口。
- **浮动侧边面板（默认收起）**：打开模型时默认收起左右侧栏，提供无遮挡的全屏预览视野；需要查看零件树、材质、几何尺寸/体积/表面积或切换边线/环境光时，点击左上角或右上角悬浮按钮即可展开。
- **全格式本地解析**：
  - 支持直接拖拽或选择：`step / stp`、`iges / igs`、`stl`、`obj (+mtl)`、`gltf / glb`、`fbx`、`3dm`、`3mf`、`brep`、`fcstd`、`ifc`、`dae`、`ply`、`wrl`、`3ds`、`amf`、`bim`、`off` 以及包含模型的 `.zip` 压缩包。
  - 已内置 `occt-import-js` (WASM) 与 `draco3d` 解码库至本地 `assets/libs/`，无需依赖外部 CDN 即可快速解析 STEP/IGES 等工业 CAD 图纸。
- **自适应中英界面**：根据浏览器语言自动显示简体中文或英文界面。

## GitHub 静态部署步骤

将本目录全部文件上传/推送至 `https://github.com/chenzubao2015/DAZAO-3DViewer` 仓库根目录后：

### 方式一：GitHub Pages 分支直接部署（推荐，零等待）
1. 进入 GitHub 仓库 **Settings** -> **Pages**。
2. 在 **Build and deployment** -> **Source** 下拉框选择 **Deploy from a branch**。
3. **Branch** 选择 `master`（或 `main`），目录选择 `/ (root)`，点击 **Save**。

部署完成后，访问 `https://chenzubao2015.github.io/DAZAO-3DViewer/` 即可直接在线查看 3D 文件。

## 本地运行预览

由于浏览器安全策略限制 WebAssembly (`.wasm`) 在 `file://` 协议下直接加载，本地预览请启动任意静态 HTTP 服务：

```bash
npx http-server . -p 8080
# 或使用 Python
python -m http.server 8080
```

随后在浏览器访问 `http://localhost:8080` 即可。
