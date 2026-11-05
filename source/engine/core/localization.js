import { FormatString } from './core.js';

let gLocalizedStrings = {
    'Open from your device' : { zh : '打开本地文件' },
    'Open from url' : { zh : '从 URL 打开' },
    'Fit model to window' : { zh : '适应窗口大小' },
    'Set Y axis as up vector' : { zh : '设置 Y 轴向上' },
    'Set Z axis as up vector' : { zh : '设置 Z 轴向上' },
    'Flip up vector' : { zh : '翻转向上轴' },
    'Fixed up vector' : { zh : '固定向上轴' },
    'Free orbit' : { zh : '自由旋转视角' },
    'Pan model' : { zh : '平移移动位置 (开启后左键拖动平移；也可直接按住鼠标右键或 Shift+左键平移)' },
    'Perspective camera' : { zh : '透视视图' },
    'Orthographic camera' : { zh : '正交视图' },
    'Measure' : { zh : '测量工具' },
    'Download' : { zh : '下载原文件' },
    'Export' : { zh : '导出转换格式' },
    'Share' : { zh : '分享与嵌入' },
    'Create snapshot' : { zh : '保存截图' },
    'Dark mode' : { zh : '深色模式' },
    'Light mode' : { zh : '浅色模式' },
    'Drag and drop 3D models here.' : { zh : '将 3D 模型文件或压缩包拖放到此处' },
    'Supported formats:' : { zh : '支持直接打开或拖拽以下 3D 格式（含 ZIP 压缩包）：' },
    'Select Local Files' : { zh : '选择本地 3D 文件' },
    'Show all meshes' : { zh : '显示全部网格' },
    'Hide mesh' : { zh : '隐藏此网格' },
    'Fit mesh to window' : { zh : '适应此网格到窗口' },
    'Isolate mesh' : { zh : '单独显示此网格' },
    'Remove isolation' : { zh : '取消单独显示' },
    'Files' : { zh : '文件' },
    'Missing Files' : { zh : '缺失关联文件' },
    'Available Files' : { zh : '已加载文件' },
    'Materials' : { zh : '材质' },
    'Materials ({0})' : { zh : '材质 ({0})' },
    'Meshes' : { zh : '模型结构' },
    'Meshes ({0})' : { zh : '网格 ({0})' },
    'Flat list' : { zh : '平铺列表' },
    'Tree view' : { zh : '树状层级' },
    'Expand all' : { zh : '全部展开' },
    'Collapse all' : { zh : '全部收起' },
    'Show/hide meshes' : { zh : '显示/隐藏全部' },
    'Fit meshes to window' : { zh : '适应窗口' },
    'Details' : { zh : '几何属性' },
    'Settings' : { zh : '显示设置' },
    'Vertices' : { zh : '顶点数' },
    'Lines' : { zh : '线段数' },
    'Triangles' : { zh : '三角面数' },
    'Unit' : { zh : '单位' },
    'Millimeter' : { zh : '毫米 (mm)' },
    'Centimeter' : { zh : '厘米 (cm)' },
    'Meter' : { zh : '米 (m)' },
    'Inch' : { zh : '英寸 (inch)' },
    'Foot' : { zh : '英尺 (ft)' },
    'Unknown' : { zh : '未知' },
    'Size X' : { zh : '尺寸 X' },
    'Size Y' : { zh : '尺寸 Y' },
    'Size Z' : { zh : '尺寸 Z' },
    'Volume' : { zh : '体积' },
    'Surface' : { zh : '表面积' },
    'Calculate...' : { zh : '点击计算...' },
    'Please wait...' : { zh : '计算中...' },
    'Model Display' : { zh : '视图显示设置' },
    'Background Color' : { zh : '背景颜色' },
    'Background Image' : { zh : '背景环境图' },
    'Environment' : { zh : '环境光贴图' },
    'Show Edges' : { zh : '显示轮廓边线' },
    'Edge Color' : { zh : '边线颜色' },
    'Edge Angle Threshold' : { zh : '边线角度阈值' },
    'Import Settings' : { zh : '默认材质设置' },
    'Default Color' : { zh : '默认实体颜色' },
    'Default Line Color' : { zh : '默认线条颜色' },
    'Select a point.' : { zh : '请在模型表面点击选择第一个测量点' },
    'Select another point.' : { zh : '请在模型表面点击选择第二个测量点' },
    'Loading Model' : { zh : '正在读取模型文件...' },
    'Importing Model' : { zh : '正在解析 3D 几何数据...' },
    'Visualizing Model' : { zh : '正在生成 3D 视图...' },
    'Exporting Model' : { zh : '正在导出模型...' },
    'OK' : { zh : '确定' },
    'Cancel' : { zh : '取消' },
    'Close' : { zh : '关闭' },
    'Create' : { zh : '生成图片' },
    'Copy' : { zh : '复制' },
    'Copied' : { zh : '已复制' },
    'Create Snapshot' : { zh : '保存高清截图' },
    'Small (1280x720)' : { zh : '小尺寸 (1280x720)' },
    'Medium (1920x1080)' : { zh : '标准全高清 (1920x1080)' },
    'Large (2560x1440)' : { zh : '2K 超清 (2560x1440)' },
    'Custom' : { zh : '自定义尺寸' },
    'Width' : { zh : '宽度 (px)' },
    'Height' : { zh : '高度 (px)' },
    'Transparent background' : { zh : '透明背景 (PNG)' },
    'Scope' : { zh : '导出范围' },
    'Entire Model' : { zh : '完整模型' },
    'Visible Only' : { zh : '仅当前可见部件' },
    'Rotation' : { zh : '旋转角度' },
    'No Rotation' : { zh : '不旋转' },
    '-90 Degrees' : { zh : '-90 度' },
    '90 Degrees' : { zh : '+90 度' },
    'Select the format from the list below, and adjust the settings of the selected format.' : { zh : '请选择目标导出格式及对应参数：' },
    'Here you can load models based on their urls. You can add more lines if your model builds up from multiple files.' : { zh : '请输入模型文件的在线 URL 地址（多文件请每行输入一个 URL）：' },
    'Select Model' : { zh : '选择主模型文件' },
    'Multiple importable models found. Select the model you would like to import from the list below.' : { zh : '检测到多个可导入的 3D 模型文件，请选择要查看的模型：' },
    'Something went wrong' : { zh : '提示' },
    'No importable file found.' : { zh : '未找到受支持的 3D 模型文件。' },
    'Failed to load file for import.' : { zh : '无法加载该模型文件。' },
    'Failed to import model.' : { zh : '解析模型文件失败。' },
    'Sharing Link' : { zh : '在线直达链接' },
    'Embedding Code' : { zh : 'Iframe 嵌入代码' },
    'Use customized settings' : { zh : '包含当前视角与渲染设置' },
    'Sharing Failed' : { zh : '无法生成分享链接' },
    'Sharing works only if you load files by url. Please upload your model files to a web server, open them by url, and try embedding again.' : { zh : '本地拖拽或上传的文件仅在您的浏览器本地解析，不会上传服务器。如需生成在线分享链接，请先通过 URL 加载公开托管的模型文件。' },
    'No Name' : { zh : '未命名' },
    'Source' : { zh : '来源' },
    'Type' : { zh : '类型' },
    'Color' : { zh : '颜色' },
    'Vertex colors' : { zh : '顶点颜色' },
    'Ambient' : { zh : '环境光' },
    'Specular' : { zh : '高光' },
    'Metalness' : { zh : '金属度' },
    'Roughness' : { zh : '粗糙度' },
    'Opacity' : { zh : '不透明度' },
    'Default' : { zh : '默认材质' },
    'Model' : { zh : '模型自带' }
};

let gLanguageCode = (typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase ().startsWith ('zh')) ? 'zh' : 'en';

export function SetLocalizedStrings (localizedStrings)
{
    gLocalizedStrings = localizedStrings;
}

export function SetLanguageCode (languageCode)
{
    gLanguageCode = languageCode;
}

export function Loc (str)
{
    if (gLocalizedStrings === null || gLanguageCode === null) {
        return str;
    }
    if (!gLocalizedStrings[str] || !gLocalizedStrings[str][gLanguageCode]) {
        return str;
    }
    return gLocalizedStrings[str][gLanguageCode];
}

export function FLoc (str, ...args)
{
    return FormatString (Loc (str), ...args);
}
